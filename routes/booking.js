var express=require("express")
var router=express.Router({mergeParams: true})
var booking = require("../models/booking")
var slot=require("../models/slot")


router.get("/slotsdashboard",function(req,res){
    slot.find({},function(err,foundslots){
        if(err){
            req.flash("error","Something went wrong")
            res.redirect("back")
        }else{
            res.render("slots/slotsdashboard",{slots:foundslots})
        }
    })
})

router.get("/bookslot/:id",isLoggedIn,function(req,res){
    slot.findById(req.params.id,function(err,foundSlot){
        if(err){
            req.flash("error","Something went wrong")
            res.redirect("back")
        }else{
            res.render("slots/booking",{slot:foundSlot})
        }
    })
})

router.post("/bookslot/:id",isLoggedIn,function(req,res){
    slot.findById(req.params.id,function(err,foundSlot){
        if(err){
            req.flash("error","Something went wrong")
            res.redirect("back")
        }else{
            if(foundSlot.slotCapacity==req.body.capacity){
                var newUser={
                    id:req.user._id,
                    username:req.user.username
                }
                var newSlot={
                    id:foundSlot._id,
                    slotnumber:foundSlot.slotnumber
                }
                book={
                    checkout:req.body.date+' '+req.body.time,
                    user:newUser,
                    slot:newSlot
                }
                booking.create(book,function(err,newBooking){
                    if(err){
                        req.flash("error","Something went wrong")
                        res.redirect("back")
                    }else{
                        update={
                            avaliablity:false
                        }
                        slot.findByIdAndUpdate(req.params.id,update,function(err,foundSlot){
                            if(err){
                                req.flash("error","Something went wrong")
                                res.redirect("back")
                            }else{

                             /*   var transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                      user: 'nikhilsharma.cse17@chitkarauniversity.edu.in',
                                      pass: '7878989845456565'
                                    }
                                  });
                                  
                                  var mailOptions = {
                                    from: 'nikhilsharma.cse17@chitkarauniversity.edu.in',
                                    to: 'req.user.email',
                                    subject: 'Sending Email using Node.js',
                                    text: 'That was easy!'
                                  };
                                  
                                  transporter.sendMail(mailOptions, function(error, info){
                                    if (error) {
                                      console.log(error);
                                    } else {
                                      console.log('Email sent: ' + info.response);
                                    }
                                  });




*/



/*

                                var smtpTransport = nodemailer.createTransport({
                                    service: 'Gmail', 
                                    auth: {
                                      user:process.env.MAIL,
                                      pass: process.env.MAILPASS
                                    }
                                  });
                                  var mailOptions = {
                                    to: req.user.email,
                                    from: 'nikhilsharma.cse17@chitkarauniversity.edu.in',
                                    subject: 'Slot booking confirmation',
                                    text: 'We have successfully booked slot numer '+foundSlot.slotnumber+
                                    ' for you.\nKindly come back to us again and free up the parking slot which will be helpful for many people like you.\n\n'+
                                    'Thanks and regards\n'+
                                    'Admin-Smart parking slots'
                                  };*/




/*
                                 
                                  smtpTransport.sendMail(mailOptions, function(err) {
                                      if(err){
                                          console.log(err)
                                        res.redirect("back")
                                      }else{
                                        const accountSid =process.env.SID ;
                                        const authToken = process.env.Token;
                                        const client = require('twilio')(accountSid, authToken);
                                        client.messages
                                              .create({
                                                 from: 'whatsapp:79461396431',
                                                 to: 'whatsapp:+91'+req.user.phone,
                                                 body: 'We have successfully booked slot numer '+foundSlot.slotnumber+
                                                 ' for you.\nKindly come back to us again and free up the parking slot which will be helpful for many people like you.\n\n'+
                                                 'Thanks and regards\n'+
                                                 'Admin-Smart parking slots'
                                               })
                                                req.flash('success', 'Booking has done and a mail has been sent to your e-mail and a Whatsapp message about booking details');
                                                
                                    }
                                })*/  
                                res.redirect("/dashboard")    
                            }
                        })
                    }
                })
            }else{
                req.flash("error","This slot is not compitable for your requirements")
                res.redirect("back")
            }
        }
    })
})

router.get("/currentbookings",isLoggedIn,function(req,res){
    booking.find().where('user.id').equals(req.user._id).exec(function(err,bookings){
        if(err){
            req.flash("error","Something went wrong")
            res.redirect("back")
        }else{
            res.render("user/current_bookings",{bookings:bookings})
        }
    })
})


router.post("/currentbookings/:id",isLoggedIn,function(req,res){
    newBooking={
        checkedout:true,
        checkout:Date.now()
    }
    booking.findByIdAndUpdate(req.params.id,newBooking,function(err,foundBooking){
        if(err){
            req.flash("error","Something went wrong")
            res.redirect("back")
        }else{
            newSlot={
                avaliablity:true
            }
            slot.findByIdAndUpdate(foundBooking.slot.id,newSlot,function(err,foundSlot){
                if(err){
                    req.flash("error","Something went wrong")
                    res.redirect("back")
                }else{
                    req.flash("success","Successfully slot has checked out. Thank you for booking")
                    res.redirect("/dashboard")
                }
            })
        }
    })
})

router.get("/bookinghistory",isLoggedIn,function(req,res){
    booking.find().where('user.id').equals(req.user._id).exec(function(err,bookings){
        if(err){
            req.flash("error","Something went wrong")
            res.redirect("back")
        }else{
            res.render("slots/booking_history",{bookings:bookings})
        }
    })
})


// Export models
module.exports=router

// +++++++++++ Middle ware ++++++++++++++++
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash("error","You must be logged in first")
        res.redirect("/login")
    }
}
