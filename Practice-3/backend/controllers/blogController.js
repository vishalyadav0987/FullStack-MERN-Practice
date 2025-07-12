const BlogSchema = require('../models/BlogSchema')
const UserSchema = require('../models/UserSchema')
const CommentSchema = require('../models/CommentSchema')

const createBlog = async (req, res) => {
    try {
        const {
            title,
            content,
            image,
            relatedTo
        } = req.body;


        const userId = req.user._id

        if (!title || !content || !image || relatedTo) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" })
        }

        const blog = await BlogSchema.create({
            title,
            content,
            image,
            relatedTo,
            userId
        });

        const user = await UserSchema
            .findByIdAndUpdate(userId, {
                $push: {
                    blogs: blog._id
                }
            }, {
                new: true
            });

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog,

        });




    } catch (error) {
        console.log("Error in Create blog controller", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const getAllBlogs = async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.body;
        const skip = (page - 1) * limit;
        const blogs = await BlogSchema.find({}).sort({ createdAt: -1 }).skip(skip).limit(10)
            .populate("userId", "name email")
            .populate("likes", "name email")


        res.status(200).json({
            success: true,
            message: "All blogs fetched successfully",
            data: blogs || [],
            total: blogs.length
        });
    } catch (error) {
        console.log("Error in Get all blogs controller", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        })

    }
}



const getBlogById = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await BlogSchema.findById(blogId)
            .populate("userId", "name email")
            .populate("likes", "name email")
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog
        });
    } catch (error) {
        console.log("Error in Get blog by id controller", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


const getAllBlogOfUser = async (req, res) => { // mid
    try {
        const userId = req.user._id;
        const blogs = await BlogSchema.find({ userId })
            .populate("userId", "name email")
            .populate("likes", "name email");
        if (!blogs || blogs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No blogs found for this user"
            });
        }
        res.status(200).json({
            success: true,
            message: "User blogs fetched successfully",
            data: blogs
        });
    } catch (error) {
        console.log("Error in Get all blog of user controller", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user._id;
        const blog = await BlogSchema.findByIdAndUpdate({
            _id: blogId,
            userId: userId
        }, req.body, { new: true });
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blog
        });
    } catch (error) {
        console.log("Error in Update blog controller", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}



const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user._id;
        const blog = await BlogSchema.findByIdAndDelete({
            _id: blogId,
            userId: userId
        });


        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        await
            BlogSchema.updateMany({
                _id: blogId,
                userId: userId
            }, {
                $pull: {
                    comments: { blogId: blogId }
                }
            });

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });

    } catch (error) {
        console.log("Error in Delete blog controller", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}



const commentOnBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user._id;
        const { comment } = req.body;
        const blog = await BlogSchema.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        const newComment = new CommentSchema({
            userId: userId,
            comment: comment,
            blogId: blogId
        });

        await newComment.save();

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: newComment
        });

    } catch (error) {
        console.log("Error in Comment on blog controller", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}



const getAllCommentsOfBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const comments = await CommentSchema.find({ blogId })
            .populate("userId", "name email");

        if (!comments || comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No comments found for this blog"
            });
        }

        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            data: comments
        });
    } catch (error) {
        console.log("Error in Get all comments of blog controller", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}



const likeAndDislikeBlog = async (req, res) => {
    try {
        // check for Already liked the Blog Or not
        const { userId, blogId } = req.body
        const blog = await BlogSchema.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        const likedArray = blog?.likes.includes(userId);

        // 1st case if already liked
        if (likedArray) {
            // remove the user from likes array
            await BlogSchema.findByIdAndUpdate(blogId, {
                $pull: { likes: userId }
            });
            return res.status(200).json({
                success: true,
                message: "Blog disliked successfully"
            });
        }
        // 2nd case if not liked
        else {
            const blog = await BlogSchema.findByIdAndUpdate(blogId, {
                $addToSet: { likes: userId },
            })

            return res.status(200).json({
                success: true,
                message: "Blog liked successfully"
            });
        }


    } catch (error) {
        console.log("Error in likeAndDislikeBlog controller", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    getAllBlogOfUser,
    updateBlog,
    deleteBlog,
    commentOnBlog,
    getAllCommentsOfBlog,
    likeAndDislikeBlog
}