const Comment = require('../models/Comment');
const Post = require('../models/Post');

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.comment_id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.query.post;
    const comments = await Comment.find({ postId: postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const { content, postId, userId } = req.body;
    
    if (!content || !postId || userId === undefined) {
      return res.status(400).json({ error: 'Missing required fields: content, postId, userId' });
    }
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const newComment = new Comment({
      content,
      postId: postId,
      userId: parseInt(userId)
    });
    
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { content, userId } = req.body;
    
    const comment = await Comment.findById(req.params.comment_id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (content !== undefined) comment.content = content;
    if (userId !== undefined) comment.userId = parseInt(userId);
    
    const updatedComment = await comment.save();
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.comment_id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    await Comment.findByIdAndDelete(req.params.comment_id);
    res.json({ message: 'Comment deleted successfully', comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getComments,
  getCommentById,
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment
};

