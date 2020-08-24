//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/blogDB', { useUnifiedTopology: true , useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected");
});

const blogSchema = new mongoose.Schema({
    title:String,
    content:String
});

const Blog = mongoose.model('blog',blogSchema);

const blog = new Blog({
    title:"Hello World",
    content:"My name is Ahmed. Hello world"
});


app.get("/",function(req,res)
{
  Blog.find(function(err,result)
  {
      if(!err)
      {
          res.render("index",{blog:result});
      }
  });
});
// Publish code
app.get("/compose",function(req,res)
{
    res.render("compose");
});
app.post("/compose",function(req,res)
{
    const head = req.body.txt;
    const body = req.body.txtare;
    
    const blog = new Blog({
        title:head,
        content:body
    });
    blog.save(function(err)
    {
        if(!err)
        {
            res.redirect("/");
        }
    });
});
// end

app.get("/post/:link",function(req,res)
{
    const value = req.params.link;
    Blog.findOne({_id:value},function(err,result)
    {
        if(!err)
        {
            res.render("post",{blogTitle:result.title,blogPost:result.content});
        }
    });
});

// about contact
app.get("/about",function(req,res)
{
    res.render("about");
});

app.get("/contact",function(req,res)
{
    res.render("contact");
});

app.listen(3000);