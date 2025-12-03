const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

// Middleware
app.use(cors({credentials:true, origin: process.env.CLIENT_URL}));
app.use(express.json());
app.use(cookieParser());

// Database Connection
mongoose.connect(process.env.MONGO_URI);

// 1. REGISTER
app.post('/register', async (req,res) => {
  const {username,password} = req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
  } catch(e) {
    res.status(400).json(e);
  }
});

// 2. LOGIN
app.post('/login', async (req,res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = userDoc && bcrypt.compareSync(password, userDoc.password);
  if(passOk){
    // Login successful
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if (err) throw err;
      // Set cookie with appropriate settings for Vercel/Production
      res.cookie('token', token, {
        httpOnly: true,
        secure: true, // required for Vercel/Production (https)
        sameSite: 'none' // required for cross-site cookie
      }).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

// 3. PROFILE (Check Logged In User)
app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  if (!token) return res.json(null);
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });
});

// 4. LOGOUT
app.post('/logout', (req,res) => {
  res.cookie('token', '', {
    expires: new Date(0),
    secure: true,
    sameSite: 'none'
  }).json('ok');
});

// 5. CREATE POST
app.post('/post', async (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {title,summary,content,cover} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover,
      author:info.id,
    });
    res.json(postDoc);
  });
});

// 6. GET ALL POSTS
app.get('/post', async (req,res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});

// 7. GET SINGLE POST
app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
});

// 8. UPDATE POST
app.put('/post', async (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content,cover} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover,
    });
    res.json(postDoc);
  });
});

// 9. DELETE POST
app.delete('/post/:id', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) return res.status(400).json('you are not the author');
        
        await Post.findByIdAndDelete(id);
        res.json('ok');
    });
});

// For local dev, we listen. For Vercel, we export.
if (require.main === module) {
    app.listen(4000, () => {
        console.log('Server running on port 4000');
    });
}

const PORT = 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app; 


