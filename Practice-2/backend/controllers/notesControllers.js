const NotesSchema = require('../models/NotesSchema');
const UserSchema = require('../models/UserSchema')


const createNote = async (req, res) => {
    try {
        const { title, description } = req.body;
        const { _id: userId } = req.user;
        if (!title || !description || !userId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        const todo = new NotesSchema({
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


const getAllNotes = async (req, res) => {
    try {
        const { userId } = req.user;
        const todos = await NotesSchema.find({
            userId
        }).sort({ createdAt: -1 });
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



const getSingleNote = async (req, res) => {
    try {
        const { id: todoId } = req.params
        const todo = await NotesSchema.findById(todoId);
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


const updateNote = async (req, res) => {
    try {
        const { id: todoId } = req.params
        const { _id: userId } = req.user
        const { title, description, completed } = req.body
        const updatedTodo = await NotesSchema.findByIdAndUpdate({
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


const deleteNote = async (req, res) => {
    try {
        const { id: todoId } = req.params
        const { _id: userId } = req.user
        const deletedTodo = await NotesSchema.findByIdAndDelete({
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


const getNotesAccordingToTag = async (req, res) => {
    try {
        const { tag } = req.params
        const { _id: userId } = req.user
        const notes = await NotesSchema.find({
            userId: userId,
            tags: tag
        });
        if (!notes) {
            return res.status(404).json({
                success: false,
                message: "No notes found with this tag",
                error: "No notes found with this tag"
            })
        }
        res.status(200).json({
            success: true,
            message: "Notes found with this tag",
            data: notes
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error fetch notes because to tags",
            error: error.message
        })
    }
}



const getSingleNoteAccodingToDate = async (req, res) => {
    try {
        const { data } = req.body;
        const note = await NotesSchema.findOne({
            userId: req.user._id,
            createdAt: data
        });
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "No note found with this date",
                error: "No note found with this date"
            })
        }
        res.status(200).json({
            success: true,
            message: "Note found with this date",
            data: note
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetch note because to date",
            error: error.message
        })
    }
}


const getNotesInRangeDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const notes = await NotesSchema.find({
            userId: req.user._id,
            createdAt: { $gte: startDate },
            createdAt: { $lte: endDate }
        })


        if (!notes) {
            return res.status(404).json({
                success: false,
                message: "No note found with this date",
                error: "No note found with this date"
            })
        }
        res.status(200).json({
            success: true,
            message: "Note found with this date",
            data: notes
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetch note because to date",
            error: error.message
        })
    }
}


module.exports = {
    createNote,
    getAllNotes,
    getSingleNote,
    updateNote,
    deleteNote,
    getNotesAccordingToTag,
    getSingleNoteAccodingToDate,
    getNotesInRangeDate

}