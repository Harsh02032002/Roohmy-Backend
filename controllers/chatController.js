const ChatMessage = require('../models/ChatMessage');
const WebsiteEnquiry = require('../models/WebsiteEnquiry');
const Owner = require('../models/Owner');

const normalizeLoginId = (value) => String(value || '').trim();

function generateWebsiteUserIdFromEmail(email) {
    const safeEmail = String(email || '').trim().toLowerCase();
    if (!safeEmail) return '';
    let hash = 0;
    for (let i = 0; i < safeEmail.length; i += 1) {
        hash = (hash * 31 + safeEmail.charCodeAt(i)) % 1000000;
    }
    return `roomhyweb${String(hash).padStart(6, '0')}`;
}

// Get inbox summary for a specific login id
exports.getInbox = async (req, res) => {
  try {
    const loginId = normalizeLoginId(req.params.login_id);
    const searchQuery = String(req.query.search || '').trim().toLowerCase();

    if (!loginId) {
      return res.status(400).json({ error: 'login_id is required' });
    }

    const loginVariants = [...new Set([loginId, loginId.toLowerCase(), loginId.toUpperCase()])];

    const messages = await ChatMessage.find({
      $or: [
        { room_id: { $in: loginVariants } },
        { sender_login_id: { $in: loginVariants } }
      ]
    })
      .sort({ created_at: -1 })
      .limit(1000)
      .lean();

    const summaryMap = new Map();

    for (const msg of messages) {
      const sender = normalizeLoginId(msg.sender_login_id);
      const receiver = normalizeLoginId(msg.room_id);
      const isOutgoing = loginVariants.includes(sender);
      const partnerId = isOutgoing ? receiver : sender;

      if (!partnerId || partnerId.toLowerCase() === 'system') continue;

      const existing = summaryMap.get(partnerId) || {
        participant_login_id: partnerId,
        participant_name: '',
        last_message: '',
        last_message_at: null,
        last_sender_login_id: '',
        unread_count: 0
      };

      if (!existing.last_message_at) {
        existing.last_message = msg.message || '';
        existing.last_message_at = msg.created_at;
        existing.last_sender_login_id = sender;
      }

      // Keep searching for a name if we only have the ID so far
      if (!isOutgoing && msg.sender_name && (!existing.participant_name || existing.participant_name === partnerId)) {
        existing.participant_name = msg.sender_name;
      }

      // Default name to partnerId if still empty
      if (!existing.participant_name) {
        existing.participant_name = partnerId;
      }

      if (!isOutgoing && !msg.is_read && loginVariants.includes(receiver)) {
        existing.unread_count += 1;
      }

      summaryMap.set(partnerId, existing);
    }

    // Enhance participants with real details from multiple sources
    const websiteEnquiries = await WebsiteEnquiry.find({}).lean();
    const owners = await Owner.find({}).lean();

    for (const item of summaryMap.values()) {
        const pid = item.participant_login_id;
        const currentName = item.participant_name || "";
        
        // 1. Try matching by Email Hash (Strongest)
        let match = websiteEnquiries.find(enq => 
            enq.owner_email && generateWebsiteUserIdFromEmail(enq.owner_email) === pid
        );

        // 2. Try matching by Login ID directly
        if (!match) {
            match = owners.find(o => o.loginId === pid);
        }

        // 3. Try matching by NAME (Fuzzy match for website users)
        if (!match && currentName && currentName !== pid) {
            const searchName = currentName.toLowerCase().trim();
            match = websiteEnquiries.find(enq => (enq.owner_name || "").toLowerCase().trim() === searchName) ||
                    owners.find(o => (o.name || "").toLowerCase().trim() === searchName);
        }

        if (match) {
            // Update name only if it's currently a loginId
            if (!item.participant_name || item.participant_name === pid) {
                item.participant_name = match.owner_name || match.name || item.participant_name;
            }
            item.participant_email = match.owner_email || match.email || item.participant_email;
            item.participant_phone = match.owner_phone || match.phone || item.participant_phone;
            item.participant_property = match.property_name || item.participant_property;
            item.participant_city = match.city || item.participant_city;
        }
    }

    let inbox = Array.from(summaryMap.values()).sort((a, b) => {
      const aTime = new Date(a.last_message_at || 0).getTime();
      const bTime = new Date(b.last_message_at || 0).getTime();
      return bTime - aTime;
    });

    if (searchQuery) {
      inbox = inbox.filter((item) =>
        `${item.participant_login_id} ${item.participant_name} ${item.last_message}`.toLowerCase().includes(searchQuery)
      );
    }

    return res.json({
      success: true,
      login_id: loginId,
      count: inbox.length,
      conversations: inbox
    });
  } catch (error) {
    console.error('Error fetching inbox:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Get messages for a specific room (receiver's loginId)
exports.getMessages = async (req, res) => {
  try {
    const { room_id } = req.params;
    
    if (!room_id) {
      return res.status(400).json({ error: 'room_id is required' });
    }

    const messages = await ChatMessage.find({ room_id })
      .sort({ created_at: 1 })
      .limit(100);

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get 1:1 conversation by two login ids (both directions)
exports.getConversation = async (req, res) => {
  try {
    const user1 = String(req.query.user1 || '').trim();
    const user2 = String(req.query.user2 || '').trim();

    if (!user1 || !user2) {
      return res.status(400).json({ error: 'user1 and user2 are required' });
    }

    const user1Variants = [...new Set([user1, user1.toLowerCase(), user1.toUpperCase()])];
    const user2Variants = [...new Set([user2, user2.toLowerCase(), user2.toUpperCase()])];

    const messages = await ChatMessage.find({
      $or: [
        { room_id: { $in: user1Variants }, sender_login_id: { $in: user2Variants } },
        { room_id: { $in: user2Variants }, sender_login_id: { $in: user1Variants } }
      ]
    })
      .sort({ created_at: 1 })
      .limit(200);

    res.json(messages);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { room_id } = req.params;
    
    await ChatMessage.updateMany(
      { room_id, is_read: false },
      { is_read: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get unread count for a room
exports.getUnreadCount = async (req, res) => {
  try {
    const { room_id } = req.params;
    
    const count = await ChatMessage.countDocuments({
      room_id,
      is_read: false
    });

    res.json({ unread_count: count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a message (optional)
exports.deleteMessage = async (req, res) => {
  try {
    const { message_id } = req.params;
    
    await ChatMessage.findByIdAndDelete(message_id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: error.message });
  }
};
