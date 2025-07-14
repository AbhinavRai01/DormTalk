const Comment = require('../schemas/comment');

const createComment = async (req, res) => {
    const { postId, content, authorID } = req.body;
    const newComment = new Comment({
        postId,
        content,
        authorID
    });

    try {
        await newComment.save();
        res.status(201).send("Comment created successfully");
    } catch (err) {
        console.error("Error creating comment", err);
        res.status(500).send("Internal Server Error");
    }
}

const getCommentsByParentID = async (req, res) => {
    const { parentID } = req.params;

    try {
        const comments = await Comment.find({ parentID });
        res.status(200).json(comments);
    } catch (err) {
        console.error("Error fetching comments", err);
        res.status(500).send("Internal Server Error");
    }
}

const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findByIdAnd
        if (!comment) {
            return res.status(404).send("Comment not found");
        }
        await Comment.findByIdAndDelete(commentId);
        res.status(200).send("Comment deleted successfully");
    }catch (err) {
        console.error("Error deleting comment", err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    createComment,
    getCommentsByParentID,
    deleteComment
}