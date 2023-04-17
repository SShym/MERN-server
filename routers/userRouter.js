const express = require('express');
const Router = express();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

Router.post('/register', async (req, res) => {
  try {
    const { email, name, avatar, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User is already exists' });
    }
  
    const salt  = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      avatar,
      email,
      password: hashedPassword,
    });
  
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({ token, user: { 
      id: user._id, 
      email, 
      name, 
      avatar 
    }});
  } catch(error){
    res.status(400).send({ error: 'Error while registration' });
  }
});

Router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: `User doesn't exists` });
    }

    if(!user.password){
      return res.status(401).json({ 
        message: `Account is registered through a social network` 
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {});

    res.json({ token, user: { 
      id: user._id, 
      name: user.name, 
      email: user.email 
    }});
  } catch(error){
    res.status(400).send({ error: 'Error during authorization' });
  }
});

Router.post('/google-auth',  async (req, res) => {
  try {
    const { id, email, name, avatar } = req.body.user;

    const user = await User.findOne({ email });
  
    if (user) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {});
  
      res.status(200).json({ 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email,
          avatar: user.avatar
        }, 
        token
      });
    } else {
      const newUser = await User.create({ 
        id,
        email,
        name,
        avatar
      });
  
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {});
  
      res.status(201).json({ 
        user: { 
          id: newUser._id, 
          name: newUser.name, 
          email: newUser.email,
          avatar: newUser.avatar
        }, 
        token
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }  
});

module.exports = Router;