var bodyParser=require("body-parser"),
methodOverride=require("method-override"),
expressSanitizer=require("express-sanitizer");
mongoose      =require("mongoose"),
express       =require("express"),
app           =express();

//APP CONFIG
mongoose.connect('mongodb://localhost:27017/myBlogapp', {useNewUrlParser: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//MONGOOSE CONFIG
var blogSchema=mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});

var Blog=new mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"Thought",
//     image:"https://images.unsplash.com/photo-1553531768-d2a5f2c7ca2a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=802&q=80",
//     body:"hello this is a post body"
// },function(err,post){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(post);
//     }
// });
app.get("/",function(req,res){
    res.redirect("/blogs");
})
// INDEX
app.get("/blogs",function(req,res){
    Blog.find({},function(err,post){
        if(err){
            console.log("Bro!You got an Error");
        }
        else{
            res.render("index",{blog:post}); 
        }
    });
   
});
//CREATE
app.get("/blogs/new",function(req,res){
    res.render("new");
});

app.post("/blogs",function(req,res){
    
    Blog.create(req.body.blog,function(err,post){
       if(err){
           res.render("new");
       }else{
           res.redirect("/blogs"); 
       }
    });
   
});
// SHOW
app.get("/blogs/:id",function(req,res){
   
        Blog.findById(req.params.id,function(err,found){
             if(err){
        res.redirect("/blogs");
    }
    else{
        res.render("show",{blog:found});
    }
    });
});
//EDIT
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,found){
             if(err){
        res.redirect("/blogs");
    }
    else{
        res.render("edit",{blog:found});
    }
    });
});
//UPDATE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,Updated){
        if(err){
            res.redirect("/");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});
// DELETE
app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndDelete(req.params.id,function(err){
      if(err){
          res.redirect("/blogs/"+req.params.id);
      }else{
          res.redirect("/");
      }
   });
});
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server is Connected Now!!");
});