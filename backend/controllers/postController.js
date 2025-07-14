const Post = require('../schemas/post');
const User = require('../schemas/user');

const createPost = async (req, res) => {
    const { title, content, tags, authorID, imageURL } = req.body;
    const newPost = new Post({
        title,
        content,
        tags,
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
    }catch(err){
        console.error("Error fetching posts", err);
    }
}

const getPostById = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.status(200).json(post);
    } catch (err) {
        console.error("Error fetching post", err);
        res.status(500).send("Internal Server Error");
    }
}

const updateLikes = async (req,res) =>{
    const { postId, action } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }

        if (action === 'increase') {
            post.likes += 1;
        } else if (action === 'decrease') {
            post.likes -= 1;
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
        const {userId} = req.body;
        const user = await User.find({userId});
        const following = user.followedUser || [];
        following.push(userId); // Include the user's own posts

        const posts = await Post.find({authorID : { $in : following}}).sort({ createdAt: -1 }).limit(20).select('_id');
        res.status(200).json(posts);
    } catch (err) {
        console.error("Error fetching feed posts", err);
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

module.exports = {createPost, getPostsByUser, getPostById, updateLikes, getFeedPosts, deletePost};