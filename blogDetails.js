const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
    name: String,
    email:String,
    title: String,
    content: String,
    category: String,
    img:String,
    formattedDateTime:String,
    comment:[],
  },
  {
    collection: "Blog",
  }
  );
  
  const Blog = mongoose.model("Blog", blogSchema);
  