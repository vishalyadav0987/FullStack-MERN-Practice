const express = require('express');
const router = express.Router();
const {
    createNote,
    getAllNotes,
    getSingleNote,
    updateNote,
    deleteNote,
    getNotesAccordingToTag,
    getSingleNoteAccodingToDate,
    getNotesInRangeDate
} = require('../controllers/notesControllers')
const {
    authMiddleware
} = require('../middleware/authMiddleware')



router.post('/create', authMiddleware, createNote);
router.get('/all', authMiddleware, getAllNotes);
router.get('/:id', getSingleNote);
router.delete('/remove/:id', authMiddleware, deleteNote);
router.put('/update/:id', authMiddleware, updateNote);
router.put('/all/:tag', authMiddleware, getNotesAccordingToTag);
router.get('/single-date', authMiddleware, getSingleNoteAccodingToDate);
router.get('/range-date', authMiddleware, getNotesInRangeDate);

module.exports = router;
