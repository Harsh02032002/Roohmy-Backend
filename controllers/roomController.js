const Room = require('../models/Room');
const Property = require('../models/Property');
const Notification = require('../models/Notification');
const User = require('../models/user');

// Owner adds a room to their property. Room is created with status 'inactive'.
exports.createRoom = async (req, res) => {
    try {
        const propertyId = req.body.propertyId || req.body.property;
        const title = req.body.title || req.body.number || req.body.roomNo;
        const type = req.body.type || req.body.roomType || 'AC';
        const beds = Number(req.body.beds || req.body.capacity || 1);
        const price = Number(req.body.price || req.body.rent || req.body.roomRent || 0);
        const user = req.user;
        if (!user) return res.status(401).json({ message: 'Auth required' });
        if (user.role !== 'owner') return res.status(403).json({ message: 'Only owners can add rooms' });
        if (!propertyId) return res.status(400).json({ message: 'Property ID is required' });
        if (!title || !String(title).trim()) return res.status(400).json({ message: 'Room title is required' });

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: 'Property not found' });
        const ownerMatches =
            (property.owner && property.owner.toString() === user._id.toString()) ||
            (property.ownerLoginId && String(property.ownerLoginId).toUpperCase() === String(user.loginId || '').toUpperCase());
        if (!ownerMatches) {
            return res.status(403).json({ message: 'You can only add rooms to your assigned property' });
        }

        const room = await Room.create({
            property: propertyId,
            title: String(title).trim(),
            type: String(type).trim() || 'AC',
            beds: Number.isFinite(beds) && beds > 0 ? beds : 1,
            price: Number.isFinite(price) && price >= 0 ? price : 0,
            createdBy: user._id,
            status: 'inactive'
        });

        // Notify superadmins and area manager
        try {
            const notifications = [];
            const superAdmins = await User.find({ role: 'superadmin' }).lean();
            superAdmins.forEach((sa) => notifications.push(Notification.create({
                toRole: 'superadmin',
                toLoginId: sa.loginId || '',
                from: String(user.loginId || user._id || 'owner'),
                type: 'room_added',
                meta: {
                    roomId: room._id,
                    propertyId,
                    propertyTitle: property.title || '',
                    roomTitle: String(title).trim()
                }
            })));
            if (user.loginId) {
                notifications.push(Notification.create({
                    toRole: 'owner',
                    toLoginId: String(user.loginId),
                    from: String(user.loginId),
                    type: 'room_added_owner',
                    meta: {
                        roomId: room._id,
                        propertyId,
                        propertyTitle: property.title || '',
                        roomTitle: String(title).trim()
                    }
                }));
            }
            await Promise.all(notifications);
        } catch (notifyErr) {
            console.warn('createRoom notification warning:', notifyErr.message);
        }

        return res.status(201).json({ success: true, room });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const mongoose = require('mongoose');

exports.getRoomsByProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;
        console.log("Searching rooms for propertyId:", propertyId);
        
        // Ensure propertyId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
          return res.status(400).json({ message: "Invalid Property ID format" });
        }
        
        const rooms = await Room.find({ property: new mongoose.Types.ObjectId(propertyId) });
        console.log(`Found ${rooms.length} rooms for property ${propertyId}`);
        res.json(rooms);
    } catch (err) {
        console.error("Error in getRoomsByProperty:", err);
        res.status(500).json({ message: err.message });
    }
};

// Add electricity reading to a room
exports.addElectricityReading = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { unitCost, initialReading, initialReadingDate, finalReading, finalReadingDate, description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(400).json({ message: "Invalid Room ID format" });
        }

        if (!initialReading || !initialReadingDate || !finalReading || !finalReadingDate) {
            return res.status(400).json({ message: "All reading fields are required" });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Calculate units consumed and total cost
        const unitsConsumed = Number(finalReading) - Number(initialReading);
        const cost = unitCost || room.electricity?.unitCost || 0;
        const totalCost = unitsConsumed * cost;

        // Update unit cost if provided
        if (unitCost) {
            room.electricity = room.electricity || {};
            room.electricity.unitCost = unitCost;
        }

        // Add reading
        room.electricity = room.electricity || { unitCost: 0, readings: [] };
        room.electricity.readings = room.electricity.readings || [];
        room.electricity.readings.push({
            initialReading: Number(initialReading),
            initialReadingDate: new Date(initialReadingDate),
            finalReading: Number(finalReading),
            finalReadingDate: new Date(finalReadingDate),
            unitsConsumed,
            totalCost,
            description: description || ''
        });

        await room.save();

        return res.status(201).json({ 
            success: true, 
            message: "Reading added successfully",
            reading: room.electricity.readings[room.electricity.readings.length - 1],
            room 
        });
    } catch (err) {
        console.error("Error adding electricity reading:", err);
        return res.status(500).json({ message: err.message });
    }
};

// Get electricity readings for a room
exports.getElectricityReadings = async (req, res) => {
    try {
        const { roomId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(400).json({ message: "Invalid Room ID format" });
        }

        const room = await Room.findById(roomId).populate('property', 'title ownerLoginId');
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        return res.json({ 
            success: true,
            room: {
                _id: room._id,
                title: room.title,
                property: room.property,
                electricity: room.electricity || { unitCost: 0, readings: [] }
            }
        });
    } catch (err) {
        console.error("Error fetching electricity readings:", err);
        return res.status(500).json({ message: err.message });
    }
};

// Get all rooms for an owner
exports.getRoomsByOwner = async (req, res) => {
    try {
        const { ownerLoginId } = req.params;
        const properties = await Property.find({ ownerLoginId });
        const propertyIds = properties.map(p => p._id);
        const rooms = await Room.find({ property: { $in: propertyIds } }).populate('property', 'title');
        res.json({ success: true, rooms });
    } catch (err) {
        console.error("Error getting rooms by owner:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Toggle promoted status
exports.togglePromoted = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }
        room.isPromoted = !room.isPromoted;
        await room.save();
        res.json({ success: true, room });
    } catch (err) {
        console.error("Error toggling promoted status:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};