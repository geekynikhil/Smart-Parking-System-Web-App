

// packages
var express=require("express")
var app=express();
app.use(express.static("public"))
app.set("view engine","ejs")
var  bodyparser=require("body-parser")
app.use(bodyparser.urlencoded({extended:true}))
var methodOverride= require("method-override")
app.use(methodOverride("method"))
require('dotenv').config();
var flash=require("connect-flash")
app.use(flash())



// mongodb
const mongoose = require("mongoose")

const mongoString = "mongodb+srv://predatoreagle98:predatoreagle98@cluster0.rkana2c.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(mongoString, {useNewUrlParser: true})

mongoose.connection.on("error", function(error) {
  console.log(error)
})

mongoose.connection.on("open", function() {
  console.log("Connected to MongoDB database.")
})

// models

var slot=require("./models/slot")
var user=require("./models/user")


//passport initilize

var passport=require("passport")
var localStratagy=require("passport-local")
var expressSessions=require("express-session")

app.use(expressSessions({
   //secret:process.env.SECRET,
    //resave: false,
    //saveUninitialized :false
    secret: 'anything', resave: true, saveUninitialized: true
    
}))
app.use(passport.initialize())
app.use(passport.session())


// passport use
passport.use(new localStratagy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

app.use(function(req, res, next){
    res.locals.currentUser = req.user,
    res.locals.error=req.flash("error")
    res.locals.success= req.flash("success")
    next();
});


//routes

app.get("/",function(req,res){
  res.render("landing")
})

app.get("/dashboard",function(req,res){
  res.render('dashboard')
})

//user routes
var userRoutes=require("./routes/user")
app.use(userRoutes)
var bookingRoutes=require("./routes/booking")
app.use(bookingRoutes)



//creation of slots

var count=1
 
const abc=5

if(slot.avaliablity==true){
    console.log("asfgg" )
}
else{
   // console.log(slot.avaliablity);
for(var i=0;i<abc;i++){
    size=2
   avl=true
    if(count>1 && count <10){
       size=1
   }
   if(count%5==0){
        size=3
   }
  
    newslot={
       slotnumber:count,
       slotCapacity:size,
      avaliablity:avl
   }

     count++
    slot.create(newslot,function(err,slot){
        if(err){
             console.log(err)
         }else{
            // console.log(slot)
         }
     })
 }
 console.log("Done creation of slots")}

 module.exports = app;
