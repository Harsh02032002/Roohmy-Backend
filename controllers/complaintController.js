const Complaint = require('../models/Complaint');

// Get all complaints for a specific tenant
exports.getTenantComplaints = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const complaints = await Complaint.find({ tenantId }).sort({ createdAt: -1 });
        res.json({ success: true, complaints });
    } catch (err) {
        console.error("Get Tenant Complaints Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all complaints for a specific owner
exports.getOwnerComplaints = async (req, res) => {
    try {
        const { ownerLoginId } = req.params;
        const complaints = await Complaint.find({ 
            ownerLoginId: { $regex: new RegExp('^' + ownerLoginId + '$', 'i') } 
        }).sort({ createdAt: -1 });
        res.json({ success: true, complaints });
    } catch (err) {
        console.error("Get Owner Complaints Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Create a new complaint
exports.createComplaint = async (req, res) => {
    try {
        let { tenantId, tenantName, tenantPhone, property, roomNo, bedNo, category, description, priority, type, ownerLoginId, escalated, imageStr } = req.body;

        // Auto-resolve ownerLoginId if missing
        if ((!ownerLoginId || ownerLoginId.trim() === '') && tenantId) {
             const Tenant = require('../models/Tenant');
             const Property = require('../models/Property');
             const t = await Tenant.findById(tenantId);
             if (t && t.propertyId) {
                 const p = await Property.findById(t.propertyId);
                 if (p && p.ownerLoginId) {
                     ownerLoginId = p.ownerLoginId;
                 }
             }
        }

        const complaint = new Complaint({
            tenantId,
            type: type || 'Tenant',
            ownerLoginId: ownerLoginId ? String(ownerLoginId).toUpperCase() : '',
            tenantName: tenantName || 'Unknown',
            tenantPhone: tenantPhone || 'N/A',
            property: property || 'N/A',
            roomNo: roomNo || 'N/A',
            bedNo: bedNo || 'N/A',
            category: category || 'Other',
            description,
            priority: priority || 'Low',
            status: 'Open',
            escalated: escalated || false,
            imageStr: imageStr || ''
        });

        await complaint.save();

        res.status(201).json({
            success: true,
            message: 'Complaint submitted successfully',
            complaint
        });
    } catch (err) {
        console.error("Create Complaint Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update complaint status
exports.updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, ownerResponse } = req.body;

        const updateData = {
            status,
            updatedAt: new Date()
        };

        if (ownerResponse) {
            updateData.ownerResponse = ownerResponse;
        }

        if (status === 'Resolved') {
            updateData.resolvedAt = new Date();
        }

        const complaint = await Complaint.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        res.json({ success: true, complaint });
    } catch (err) {
        console.error("Update Complaint Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Assign staff to complaint
exports.assignStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedStaffId, assignedStaffName } = req.body;

        const complaint = await Complaint.findByIdAndUpdate(
            id,
            { 
                $set: { 
                    assignedStaffId: assignedStaffId, 
                    assignedStaffName: assignedStaffName,
                    status: 'In Progress', // automatically move to in progress when assigned
                    updatedAt: new Date()
                }
            },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        res.json({ success: true, complaint });
    } catch (err) {
        console.error("Assign Staff Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all complaints
exports.getAllComplaints = async (req, res) => {
    try {
        const { type } = req.query;
        const query = type ? { type } : {};
        const complaints = await Complaint.find(query).sort({ createdAt: -1 });
        res.json({ success: true, complaints });
    } catch (err) {
        console.error("Get All Complaints Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete a complaint
exports.deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        
        const complaint = await Complaint.findByIdAndDelete(id);
        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }
        
        res.json({ success: true, message: 'Complaint deleted successfully' });
    } catch (err) {
        console.error("Delete Complaint Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
