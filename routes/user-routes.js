const express = require('express')
const router = express.Router()
const User = require('../models/User')
const passport = require('passport')
const multer = require("multer")
const { check, validationResult } = require('express-validator/check')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.png') 
    }
  })
  
  var upload = multer({ storage: storage })




isAuthenticated = (req,res,next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/users/login')
}
//  login user view 


router.get('/login', (req,res)=> {
    res.render('user/login', {
        error: req.flash('error')
    })
})


router.post('/login',
  passport.authenticate('local.login', {
    successRedirect: '/events',
      failureRedirect: '/users/login',
      failureFlash: true })
      )



router.get('/signup', (req,res)=> {
    res.render('user/signup', {
        error: req.flash('error')
    })
})
router.get('/stadium-signup', (req,res)=> {
    res.render('user/ssignup', {
        error: req.flash('error')
    })
})



router.post('/signup',
  passport.authenticate('local.signup', {
    successRedirect: '/users/login',
      failureRedirect: '/users/signup',
      failureFlash: true })
      )


router.get('/profile',isAuthenticated , (req,res)=> {
    if(req.user.isMember()){
    res.render('user/profile', {
        success: req.flash('success')
    })
} else {
    res.sendStatus(403) // Forbidden
}
    })
    
router.get('/sprofile',isAuthenticated , (req,res)=> {
    if(req.user.isAuthor()){
        res.render('user/sprofile', {
            success: req.flash('success')
        })
    } else {
        res.sendStatus(403) // Forbidden
    }
        })


    

router.get('/edit',isAuthenticated, (req,res)=> {
    if(req.user.isMember()){
    res.render('user/edit', {
        success: req.flash('success')
    })
}else {
    res.sendStatus(403) // Forbidden
}
    })

    router.get('/sedit',isAuthenticated, (req,res)=> {
        if(req.user.isAuthor()){
        res.render('user/sedit', {
            success: req.flash('success')
        })
    }
    else {
        res.sendStatus(403) // Forbidden
    }
        })

    router.get('/allPlayers',isAuthenticated, (req,res)=> {

        User.find({}, function(err, allUsers){
            if(err){
                console.log(err);
            } else {
               res.render('user/allPlayers',{users:allUsers});
            }
         });
         var noMatch = null;
         if(req.query.search) {
             const regex = new RegExp(escapeRegex(req.query.search), 'gi');
             // Get all Users from DB
             User.find({firstName: regex}, function(err, allUsers){
                if(err){
                    console.log(err);
                } else {
                   if(allUsers.length < 1) {
                       noMatch = "No users match that query, please try again.";
                   }
                   res.render("user/allPlayers",{users:allUsers, noMatch: noMatch});
                }
             });
         } else {
             // Get all Users from DB
             User.find({}, function(err, allUsers){
                if(err){
                    console.log(err);
                } else {
                   res.render("user/allPlayers",{users:allUsers, noMatch: noMatch});
                }
             });
         }
     });

 


    
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
  





router.post('/uploadAvatar', upload.single('avatar'), (req,res)=> {
    
    let newFields = {
        avatar: req.file.filename
    }
    User.updateOne( {_id: req.user._id}, newFields, (err)=> {
        if (!err ) {
            res.redirect('/users/profile')
        } 

    } )
})

router.post('/edit', (req,res)=> {
    
    let newFields = {
        playerPos: req.body.playerPos,
        location: req.body.location,
        mobile: req.body.mobile,
    }
    User.updateOne( {_id: req.user._id}, newFields, (err)=> {
        if (!err) {
            res.redirect('/users/profile')
        }

    } )
}) 

router.post('/sedit', (req,res)=> {
    
    let newFields = {
        location: req.body.location,
        mobile: req.body.mobile,
        cost : req.body.cost
    }
    User.updateOne( {_id: req.user._id}, newFields, (err)=> {
        if (!err) {
            res.redirect('/users/sprofile')
        }

    } )
})

// router.get('/showUser/:id', (req,res)=> {
//     User.findOne({_id: req.params.id}, (err,event)=> {
        
//        if(!err) {
           
//         res.render('/user/showUser', {
//             user: user
//         })

//        } else {
//            console.log(err)
//        }
    
//     })
 
// })



// // add a document to the DB collection recording the click event
// router.post('/clicked', (req, res) => {
//     const click = {clickTime: new Date()};
//     console.log(click);
//     console.log(db);
  
//     db.collection('clicks').save(click, (err, result) => {
//       if (err) {
//         return console.log(err);
//       }
//       console.log('click added to db');
//       res.sendStatus(201);
//     });
//   });
  
//   // get the click data from the database
//   router.get('/clicks', (req, res) => {
//     db.collection('clicks').find().toArray((err, result) => {
//       if (err) return console.log(err);
//       res.send(result);
//     });
//   });








router.get('/logout', (req,res)=> {
    req.logout();
    res.redirect('/users/login');
})


module.exports = router