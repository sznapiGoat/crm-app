const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { validateClient } = require('../middleware/validate');

// GET /api/clients — list with search & filter
router.get('/', async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && ['active', 'inactive', 'lead'].includes(status)) {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { email: regex }, { company: regex }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [clients, total] = await Promise.all([
      Client.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Client.countDocuments(query),
    ]);

    res.json({ success: true, total, page: parseInt(page), data: clients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/clients/stats — dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [total, active, inactive, lead] = await Promise.all([
      Client.countDocuments(),
      Client.countDocuments({ status: 'active' }),
      Client.countDocuments({ status: 'inactive' }),
      Client.countDocuments({ status: 'lead' }),
    ]);
    res.json({ success: true, data: { total, active, inactive, lead } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/clients/:id
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, data: client });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/clients
router.post('/', validateClient, async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;
    const client = await Client.create({ name, email, phone, company, status, notes });
    res.status(201).json({ success: true, data: client });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'A client with this email already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/clients/:id
router.put('/:id', validateClient, async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, company, status, notes },
      { new: true, runValidators: true }
    );
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, data: client });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'A client with this email already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/clients/:id
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
