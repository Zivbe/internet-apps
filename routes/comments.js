const express = require('express');
const router = express.Router();
const {
  getComments,
  getCommentById,
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentsController');

router.get('/', (req, res) => {
  if (req.query.post) {
    getCommentsByPostId(req, res);
  } else {
    getComments(req, res);
  }
});

router.get('/:comment_id', getCommentById);

router.post('/', createComment);

router.put('/:comment_id', updateComment);

router.delete('/:comment_id', deleteComment);

module.exports = router;

