const mongoose = require('mongoose');
const Post = require('../models/Post');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.post_id)) {
      return res.status(400).json({ error: 'Invalid post ID format' });
    }

    const post = await Post.findById(req.params.post_id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostsBySender = async (req, res) => {
  try {
    const senderId = parseInt(req.query.sender);
    const posts = await Post.find({ sender: senderId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addPost = async (req, res) => {
  try {
    const { title, content, sender } = req.body;
    
    if (!title || !content || sender === undefined) {
      return res.status(400).json({ error: 'Missing required fields: title, content, sender' });
    }
    
    const newPost = new Post({
      title,
      content,
      sender: parseInt(sender)
    });
    
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content, sender } = req.body;

    if (!isValidObjectId(req.params.post_id)) {
      return res.status(400).json({ error: 'Invalid post ID format' });
    }
    
    const post = await Post.findById(req.params.post_id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (sender !== undefined) post.sender = parseInt(sender);
    
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPosts,
  getPostById,
  getPostsBySender,
  addPost,
  updatePost
};
