import express from 'express';
import * as dotenv from 'dotenv';
import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

router.route('/').get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});

router.route('/').post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;
    const formData = new FormData();
    formData.append("file", photo);
    formData.append("upload_preset", "aiimages");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/danlppyav/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    const imageUrl = data.secure_url;
    const newPost = new Post({
      name,
      prompt,
      photo: imageUrl,
    });
    await newPost.save()
    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });
  }
});

export default router;