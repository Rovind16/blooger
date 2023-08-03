const mongoose = require("mongoose");

const UserDetailsScehma = new mongoose.Schema(
  {
   name:String,
   email:String,
   password:String,
   confirmpassword:String
  },
  {
    collection: "UserInfo",
  }
);
mongoose.model("UserInfo", UserDetailsScehma);