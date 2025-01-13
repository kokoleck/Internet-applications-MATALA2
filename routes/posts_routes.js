const express = require("express");
const router = express.Router();
const Post = require("../controllers/post");

router.get("/", Post.getAllPosts);
router.get("/:id", Post.getPostsById);

router.post("/", Post.createPost);
router.delete("/:id", Post.deletePost);

module.exports = router;
