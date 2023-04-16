const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Router = express();
const cloudinary = require("cloudinary");
const upload = require('../middleware/imgUpload');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../jwt/config');

cloudinary.config({
  cloud_name: "dotmufoiy",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

Router.post('/add-skill', auth, async (req, res) => {
  try {
    const { userId, skill } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }
    
    if (user.skills.indexOf(skill) !== -1) {
      return res.status(400).send({ error: 'Skill already exists' });
    }

    user.skills.push(skill);

    await user.save();

    res.status(200).json({ message: 'Skill successfully added' });
  } catch (error) {
    res.status(400).send({ error: 'Error' });
  }
});

Router.get('/user-skills/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.skills);
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'Error' });
  }
});

Router.patch('/delete-skill', auth, async (req, res) => {
  try {
    const { skill } = req.body;

    await User.updateMany(
      { skills: skill },
      { $pull: { skills: skill } },
      { new: true }
    );
    
    res.status(200).json({ message: 'Skill successfully deleted' });
  } catch (err) {
    res.status(400).send({ error: 'Error' });
  }
});

Router.post('/set-user-avatar', auth, upload, async (req, res) => {
  try {
    const user = await User.findById(req.body.id);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {});

    user.avatarId && cloudinary.v2.uploader.destroy(user.avatarId)

    cloudinary.v2.uploader.upload(req.file.path, async (err, result) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user.id },
        { $set: { avatar: result.secure_url, avatarId: result.public_id } }, 
        { new: true, upsert: true } 
      );

      res.status(200).send({ message: 'Avatar uploaded successfully', user: updatedUser, token });
    })
  } catch (error) {
    res.status(400).send({ error: 'Error' });
  }
});

Router.put('/change-user-name', auth, async (req, res) => {
  try {
    const { userId, userName } = req.body;

    const token = jwt.sign({ userId }, JWT_SECRET, {});

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { name: userName } },
      { new: true }
    );

    res.status(200).send({ 
      message: 'Name updated successfully', 
      user: updatedUser, token 
    });
  } catch {
    res.status(400).send({ error: 'Error' });
  }
})

module.exports = Router;
  