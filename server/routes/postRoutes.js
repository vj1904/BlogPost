const express = require("express");
const multer = require("multer");
const {
  createPost,
  updatePost,
  getAllPosts,
  getSinglePost,
} = require("../controllers/postController");

const router = express.Router();
const uploadMiddleware = multer({ dest: "uploads/" });

router.post("/post", uploadMiddleware.single("file"), createPost);
router.put("/post", uploadMiddleware.single("file"), updatePost);
router.get("/post", getAllPosts);
router.get("/post/:id", getSinglePost);

module.exports = router;
