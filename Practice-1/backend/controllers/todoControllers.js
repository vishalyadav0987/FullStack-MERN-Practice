const TodoSchema = require('../models/TodoSchema');
const UserSchema = require('../models/UserSchema')


const createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;
        const { _id: userId } = req.user;
        if (!title || !description || !userId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        const todo = new TodoSchema({
            title,
            description,
            userId
        });

        await todo.save();


        const user = await UserSchema.findByIdAndUpdate(userId, {
            $push: { todos: todo._id }
        }, { new: true });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        res.status(201).json({
            success: true,
            message: "Todo created successfully",
            data: todo
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating todo",
            error: error.message
        })
    }
}


const getAllTodos = async (req, res) => {
    try {
        const todos = await TodoSchema.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Todos retrieved successfully",
            data: todos || []
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving todos",
            error: error.message
        })
    }
}



const getSingleTodo = async (req, res) => {
    try {
        const { id: todoId } = req.params
        const todo = await TodoSchema.findById(todoId);
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
                error: "Todo not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Todo retrieved successfully",
            data: todo
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving todo",
            error: error.message
        })
    }
}


const updateTodo = async (req, res) => {
    try {
        const { id: todoId } = req.params
        const { _id: userId } = req.user
        const { title, description, completed } = req.body
        const updatedTodo = await TodoSchema.findByIdAndUpdate({
            _id: todoId,
            userId: userId
        }, { title, description, completed }, {
            new: true,
            runValidators: true
        })
        if (!updatedTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
                error: "Todo not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            data: updatedTodo
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating todo",
            error: error.message
        })
    }
}


const deleteTodo = async (req, res) => {
    try {
        const { id: todoId } = req.params
        const { _id: userId } = req.user
        const deletedTodo = await TodoSchema.findByIdAndDelete({
            _id: todoId,
            userId: userId
        })
        if (!deletedTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
                error: "Todo not found"
            })
        }


        res.status(200).json({
            success: true,
            message: "Todo deleted successfully",
            data: updatedTodo
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting todo",
            error: error.message
        })
    }
}


module.exports = {
    createTodo,
    getAllTodos,
    getSingleTodo,
    updateTodo,
    deleteTodo

}