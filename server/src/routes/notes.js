const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// All routes are scoped to the authenticated user (req.user.id set by `protect`).

// GET /api/notes — list current user's notes (supports ?search=)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const query = { user: req.user.id };

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ title: regex }, { content: regex }];
    }

    const notes = await Note.find(query).sort({ pinned: -1, updatedAt: -1 });
    res.json({ success: true, total: notes.length, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/notes/:id
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/notes
router.post('/', async (req, res) => {
  try {
    const { title, content, pinned } = req.body;
    const note = await Note.create({
      user: req.user.id,
      title: title || 'Untitled',
      content: content || '',
      pinned: !!pinned,
    });
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/notes/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, content, pinned } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (content !== undefined) update.content = content;
    if (pinned !== undefined) update.pinned = pinned;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      update,
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
