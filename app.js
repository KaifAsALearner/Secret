require('dotenv').config();
const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const md5=require("md5");

const app=express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema=new mongoose.Schema({
  email:String,
  password: String
});

const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.route("/login")
.get(function(req,res){
  res.render("login");
})
.post(function(req,res){
  const userName=req.body.username;
  const password=md5(req.body.password);
  User.findOne({email:userName})
  .then(function(data){
    if(password===data.password){
      res.render("secrets");
    }
    else{
      res.send("Entered Wrong Password");
    }
  })
  .catch((error)=>{
    res.send("Email not registered");
  });
});

app.route("/register")
.get(function(req,res){
  res.render("register");
})
.post(function(req,res){
  const newUser=new User({
    email:req.body.username,
    password:md5(req.body.password)
  });
  newUser.save()
  .then(()=>{
    res.render("secrets");
  })
  .catch((error)=>{
    res.send(error);
  });
});

app.listen(3000,function(){
  console.log("Server started on port 3000.");
});