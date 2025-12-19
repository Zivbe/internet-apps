const { comments } = require('../data/store');

const getComments = (req, res) => {
  res.json(comments);
};

const getCommentById = (req, res) => {
  const commentId = parseInt(req.params.comment_id);
  const comment = comments.find(c => c.id === commentId);
  
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  
  res.json(comment);
};

const getCommentsByPostId = (req, res) => {
  const postId = parseInt(req.query.post);
  const filteredComments = comments.filter(c => c.postId === postId);
  res.json(filteredComments);
};

const createComment = (req, res) => {
  const { content, postId, userId } = req.body;
  
  if (!content || postId === undefined || userId === undefined) {
    return res.status(400).json({ error: 'Missing required fields: content, postId, userId' });
  }
  
  const newComment = {
    id: comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1,
    content,
    postId: parseInt(postId),
    userId: parseInt(userId),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  comments.push(newComment);
  res.status(201).json(newComment);
};

const updateComment = (req, res) => {
  const commentId = parseInt(req.params.comment_id);
  const commentIndex = comments.findIndex(c => c.id === commentId);
  
  if (commentIndex === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  
  const { content, userId } = req.body;
  
  if (content !== undefined) comments[commentIndex].content = content;
  if (userId !== undefined) comments[commentIndex].userId = parseInt(userId);
  comments[commentIndex].updatedAt = new Date().toISOString();
  
  res.json(comments[commentIndex]);
};

const deleteComment = (req, res) => {
  const commentId = parseInt(req.params.comment_id);
  const commentIndex = comments.findIndex(c => c.id === commentId);
  
  if (commentIndex === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  
  const deletedComment = comments.splice(commentIndex, 1)[0];
  res.json({ message: 'Comment deleted successfully', comment: deletedComment });
};

module.exports = {
  getComments,
  getCommentById,
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment
};

