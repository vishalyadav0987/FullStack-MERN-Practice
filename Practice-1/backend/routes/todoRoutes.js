const express = require('express');
const router = express.Router();
const { createTodo, getAllTodos, getSingleTodo, deleteTodo, updateTodo } = require('../controllers/todoControllers')
const {
    authMiddleware
} = require('../middleware/authMiddleware')



router.post('/create', authMiddleware, createTodo);
router.get('/all', getAllTodos);
router.get('/:id', getSingleTodo);
router.delete('/remove/:id', authMiddleware, deleteTodo);
router.put('/update/:id', authMiddleware, updateTodo);

module.exports = router;
