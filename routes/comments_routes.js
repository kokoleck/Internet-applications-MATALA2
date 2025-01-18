const express = require("express");
const router = express.Router();
const {
    createComment,
    getAllComments,
    getCommentsByPostId,
    updateComment,
    deleteComment,
} = require("../controllers/comments_controller");

router.post("/", createComment);
router.get("/", getAllComments);
router.get("/post/:postId", getCommentsByPostId);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

module.exports = router;
