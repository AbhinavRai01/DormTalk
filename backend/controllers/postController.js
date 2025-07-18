const Post = require('../schemas/post');
const User = require('../schemas/user');

const createPost = async (req, res) => {
    const { title, content, cluster, authorID, imageURL } = req.body;
    const newPost = new Post({
        title,
        content,
        cluster,
        authorID,
        imageURL
    });

    try {
        await newPost.save();
        res.status(201).send("Post created successfully");
    } catch (err) {
        console.error("Error creating post", err);
        res.status(500).send("Internal Server Error");
    }
}

const getPostsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const posts = await Post.find({ authorID: userId });
        res.status(200).json(posts);
    } catch (err) {
        console.error("Error fetching posts", err);
    }
}

const getPostById = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId).populate('cluster', 'name');
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.status(200).json(post);
    } catch (err) {
        console.error("Error fetching post", err);
        res.status(500).send("Internal Server Error");
    }
}

const updateLikes = async (req, res) => {
    const { postId, action, userId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }

        if (action === 'increase') {
            post.likes.push(userId);
        } else if (action === 'decrease') {
            post.likes = post.likes.filter(item => item != userId);
        } else {
            return res.status(400).send("Invalid action");
        }

        await post.save();
        res.status(200).json(post);
    } catch (err) {
        console.error("Error updating likes", err);
        res.status(500).send("Internal Server Error");
    }
}

const getFeedPosts = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findOne({ userId });
        console.log(user);
        const following = user.followedUsers || [];
        const joinedClusters = user.joinedClusters || [];
        following.push(userId); // Include the user's own posts

        console.log(following);

        const posts = await Post.find({$or: [
            { authorID: { $in: following } },
            { cluster: { $in: joinedClusters } }
        ]}).sort({ createdAt: -1 }).limit(20).select('_id');
        res.status(200).json(posts);
    } catch (err) {
        console.error("Error fetching feed posts", err);
        res.status(500).send("Internal Server Error");
    }
}

const getPostbyCluster = async (req, res) => {
    const { clusterId } = req.params;

    try {
        const posts = await Post.find({ cluster: clusterId }).sort({ createdAt: -1 }).select('_id');
        if (!posts.length) {
            return res.status(404).send("No posts found for this cluster");
        }
        res.status(200).json(posts);
    } catch (err) {
        console.error("Error fetching posts by cluster", err);
        res.status(500).send("Internal Server Error");
    }
}

const deletePost = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findByIdAndDelete(postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.status(200).send("Post deleted successfully");
    } catch (err) {
        console.error("Error deleting post", err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { createPost, getPostsByUser, getPostById, getPostbyCluster, updateLikes, getFeedPosts, deletePost };