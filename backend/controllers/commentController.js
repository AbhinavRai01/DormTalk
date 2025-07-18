const Comment = require('../schemas/comment');
const User = require('../schemas/user');

const createComment = async (req, res) => {
    const { parentID, content, authorID } = req.body;
    const newComment = new Comment({
        parentID,
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

const updateLikes = async (req, res) => {
  const { commentId } = req.params;
  const { action, userId } = req.body;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const alreadyLiked = comment.likes.includes(userId);

    if (action === 'increase') {
      if (!alreadyLiked) {
        comment.likes.push(userId);
      }
    } else if (action === 'decrease') {
      if (alreadyLiked) {
        comment.likes = comment.likes.filter(id => id !== userId);
      }
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    await comment.save();

    return res.status(200).json({ message: "Likes updated", likes: comment.likes });
  } catch (error) {
    console.error("Error updating likes:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = {
    createComment,
    getCommentsByParentID,
    deleteComment,
    updateLikes
}