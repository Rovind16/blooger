const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");
const SibApiV3Sdk = require('sib-api-v3-sdk');
app.use(express.json({ limit: "10mb" }));
app.use(express.json());
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { log } = require("console");

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";
const mongourl = "mongodb+srv://rovind:rovind1409@cluster0.2brjnbo.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongourl, {
  useNewUrlParser: true
})
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((e) => console.log(e));

require("./userDetails");
require("./blogDetails");

//sendEmail

const apiKey = "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";
const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = apiKey;
const sendinBlue = new SibApiV3Sdk.TransactionalEmailsApi(defaultClient);

const sendEmailNotification = (email,name, blogTitle) => {
  const emailData = {
    to: [{ email }],
    sender: { email: "whiteking1409@gmail.com", name: "BlogVista" },
    subject: "Confirmation for uploading blog",
    params: {
      BLOG_TITLE: blogTitle,
    },
    htmlContent: `
    <h3>Dear ${name}</h3>
    <p>Your blog ${blogTitle} has been uploaded successfully</p>
    <p>Thank you for uploading your blog..<p/>
    <p>Thank you!</p>
    `
  };

  sendinBlue.sendTransacEmail(emailData).then(
    (response) => {
      console.log("ok");
    },
    (error) => {
      console.log("fail");
    }
  );
};





//register
const User = mongoose.model("UserInfo");
app.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
      name,
      email,
      password,
      confirmPassword,

    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});


//login
app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.json({ error: "User not found" });
    }
    if (password === user.password) {
      const token = jwt.sign({}, JWT_SECRET);
  
      if (res.status(201)) {
        return res.json({ status: "ok", data: token,val:email });
      } else {
        return res.json({ error: "error" });
      }
    }
  
    res.json({ status: "error", error: "Invalid password" });
  });
  
  //upload blog
  const Blog = mongoose.model("Blog");
  app.post("/upload-blog",  async(req, res) => {
    const { name, email,title, content, category,img, formattedDateTime } = req.body;
    try{
    await Blog.create({
        name,
        email,
        title,
        content,
        category,
        img,
        formattedDateTime, 
      });
      sendEmailNotification(email, name,title);
      res.send({ status: "ok" });
    } catch (error) {
      res.send({ status: "error" });
    }
    
});

//retrive blog
app.get('/get-blog', async (req, res) => {
  try {
    const data = await Blog.find({});
    res.json({ status: 'ok', data: data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});      


//remove-blog
app.post("/remove-blog", async (req, res) => {
  const { email, title, content } = req.body; 
  try {
    const result = await Blog.deleteOne({ email, title, content });
    if (result.deletedCount > 0) {
      res.json({ status: "ok", message: "Blog removed successfully" });
    } else {
      res.json({ status: "error", message: "Blog not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//Username
app.post("/username", async (req, res) => {
  const {email} = req.body;
  const user = await User.findOne({ email });
  const uname=user.name; 
  const userName=uname;
  if(userName.length>=1){
  return res.json({status:"ok",data:userName})
  }else{
  return res.json({ error: "error" });
  }
});




//comment
app.post('/comment', async (req, res) => {
  try {
    const user = await Blog.findOne({ title: req.body.blogtitle });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.comment.push(req.body.comment);
    await user.save();

    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


//seperate blog
  app.get('/seperateblog/:id',async (req,res) => {
    let {id} = req.params;
    try {
      const data = await Blog.find({_id:id});
      res.json({ status: 'ok', data: data });
    } catch (err) {
      res.status(500).json({ err: 'Server error' });
    }
  })




app.listen(5000, ()=>{
    console.log("Server connected");
});