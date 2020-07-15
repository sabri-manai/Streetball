const express = require("express")
const router = express.Router()
const Event = require('../models/Evnet')
const User = require('../models/User')

const { check, validationResult, body } = require('express-validator/check')
const moment = require('moment');
moment().format();

isAuthenticated = (req,res,next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/users/login')
}

router.get('/create',isAuthenticated, (req,res)=> {
   
    res.render('event/create', {
        errors: req.flash('errors')
    })

})
router.get('/booking-date',isAuthenticated, (req,res)=> {
   
    res.render('event/bookingDate', {
        errors: req.flash('errors')
    })

})

router.get('/splanning',isAuthenticated, (req,res)=> {
    Event.find() 
       .then ((docs) => {


    res.render('event/splanning', {
        errors: req.flash('errors'),
        event: docs,

    });
}).catch(err => console.log('Error in retriving employees list'));

});

// router.get('/:pageNo?', (req,res)=> {   
//     let pageNo = 1

//     if ( req.params.pageNo) {
//         pageNo = parseInt(req.params.pageNo)
//     }
//     if (req.params.pageNo == 0)   {
//         pageNo = 1
//     }
    
//     let q = {
//         skip: 6 * (pageNo - 1),
//         limit: 6
//     }
//     let totalDocs = 0 

//     Event.countDocuments({}, (err,total)=> {

//     }).then( (response)=> {
//         totalDocs = parseInt(response)
//         Event.find({},{},q, (err,events)=> { 
//                  let chunk = []
//                  let chunkSize = 3
//                  for (let i =0 ; i < events.length ; i+=chunkSize) {
//                      chunk.push(events.slice( i, chunkSize + i))
//                  }
//                   res.render('event/index', {
//                       chunk : chunk,
//                       message: req.flash('info'),
//                       total: parseInt(totalDocs),
//                       pageNo: pageNo
//                   }  )
//                 })
//     })  
// })

router.get('/:pageNo?', (req,res)=> {   
    let pageNo = 1

    if ( req.params.pageNo) {
        pageNo = parseInt(req.params.pageNo)
    }
    if (req.params.pageNo == 0)   {
        pageNo = 1
    }
    
    let q = {
        skip: 6 * (pageNo - 1),
        limit: 6
    }
    let totalDocs = 0 

    Event.countDocuments({}, (err,total)=> {

    }).then( (response)=> {
        totalDocs = parseInt(response)
        Event.find({},{},q, (err,events)=> { 
                 let chunk = []
                 let chunkSize = 3
                 for (let i =0 ; i < events.length ; i+=chunkSize) {
                     chunk.push(events.slice( i, chunkSize + i))
                 }
                  res.render('event/index', {
                      chunk : chunk,
                      message: req.flash('info'),
                      total: parseInt(totalDocs),
                      pageNo: pageNo
                  }  )
                })
    })  
})

router.post('/create', [
    check('title').isLength({min: 5}).withMessage('Title should be more than 5 char'),
    check('description').isLength({min: 5}).withMessage('Description should be more than 5 char'),
    check('location').isLength({min: 3}).withMessage('Location should be more than 5 char'),
    check('date').isLength({min: 5}).withMessage('Date should valid Date'),

] , (req,res)=> {

    const errors = validationResult(req)

    if( !errors.isEmpty()) {
        
        req.flash('errors',errors.array())
        res.redirect('/events/create')
    } else{
        
        let newEvent = new Event({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            location: req.body.location,
            user_id:  req.user.id,
            booking: req.body.booking,
            created_at: Date.now()
        })

        newEvent.save( (err)=> {
            if(!err) {
                console.log('event was added')
                req.flash('info', ' The event was created successfuly')
                res.redirect('/events')
            } else {
                console.log(err)
            } 
        })
    }
})

router.post('/booking-date', [
    check('title').isLength({min: 5}).withMessage('Title should be more than 5 char'),
    check('description').isLength({min: 5}).withMessage('Description should be more than 5 char'),
    check('location').isLength({min: 3}).withMessage('Location should be more than 5 char'),
    check('date').isLength({min: 5}).withMessage('Date should valid Date'),
] ,async (req, res) => {
    await User.findOneAndUpdate({ _id: req.user._id }, {
        $set: {
            bookingDate: req.body.date,
        }
    });

 let event = await Event.findOne({date: req.body.date});

 if (event){

     return( res.redirect("/events/splanning" ) , {date: res.body.date} )   ;
 }
  else {
    const errors = validationResult(req)

    if( !errors.isEmpty()) {
        req.flash('errors',errors.array())
        res.redirect('/events/bookingDate')
    } else{
        
        let newEvent = new Event({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            location: req.user.location,
            user_id:  req.user.id,
            created_at: Date.now()
        })

        await newEvent.save(  (err)=> {
            if(err) {
                console.log(err)
            } 
        });

        let newEvent2 = new Event({
            title: req.body.title2,
            description: req.body.description,
            date: req.body.date,
            location: req.user.location,
            user_id:  req.user.id,
            created_at: Date.now()
        })

      await  newEvent2.save( (err)=> {
            if(err) {
                console.log(err)
            }  
        });
        
        let newEvent3 = new Event({
            title: req.body.title3,
            description: req.body.description,
            date: req.body.date,
            location: req.user.location,
            user_id:  req.user.id,
            created_at: Date.now()
        })

      await  newEvent3.save( (err)=> {
            if(err) {
                console.log(err)
            } 
        });

        let newEvent4 = new Event({
            title: req.body.title4,
            description: req.body.description,
            date: req.body.date,
            location: req.user.location,
            user_id:  req.user.id,
            created_at: Date.now()
        })

      await  newEvent4.save( (err)=> {
            if(err) {
                console.log(err)

            } 
        });
        let newEvent5 = new Event({
            title: req.body.title5,
            description: req.body.description,
            date: req.body.date,
            location: req.user.location,
            user_id:  req.user.id,
            created_at: Date.now()
        })

       await newEvent5.save( (err)=> {
            if(err) {
                console.log(err)

            } 
        });
        let newEvent6 = new Event({
            title: req.body.title6,
            description: req.body.description,
            date: req.body.date,
            location: req.user.location,
            user_id:  req.user.id,
            created_at: Date.now()
        })

      await  newEvent6.save( (err)=> {
        if(!err) {
            console.log('event was added')
            req.flash('info', ' The event was created successfuly')
            res.redirect('/events/splanning')
        } else {
            console.log(err)
        }
        });
    } 

}
})


router.get('/show/:id', (req,res)=> {
    Event.findOne({_id: req.params.id}, (err,event)=> {
        
       if(!err) {
           
        res.render('event/show', {
            event: event
        })

       } else {
           console.log(err)
       }
    
    })
 
})

// edit route

router.get('/edit/:id', isAuthenticated,(req,res)=> {
    if(req.user.isMember()){
    Event.findOne({_id: req.params.id}, (err,event)=> {
        
        if(!err) {
       
         res.render('event/edit', {
             event: event,
             date: moment(event.date).format('YYYY-MM-DD'),
             errors: req.flash('errors'),
             message: req.flash('info')
         })
 
        } else {
            console.log(err)
        }
     
     })
    }
    else {
        res.sendStatus(403) // Forbidden
    } 
})

router.post('/update',[
    check('title').isLength({min: 5}).withMessage('Title should be more than 5 char'),
    check('description').isLength({min: 5}).withMessage('Description should be more than 5 char'),
    check('location').isLength({min: 3}).withMessage('Location should be more than 5 char'),
    check('date').isLength({min: 5}).withMessage('Date should valid Date'),

], isAuthenticated,(req,res)=> {
    if(req.user.isMember()){
    const errors = validationResult(req)
    if( !errors.isEmpty()) {
       
        req.flash('errors',errors.array())
        res.redirect('/events/edit/' + req.body.id)
    } else {
       // crete obj
       let newfeilds = {
           title: req.body.title,
           description: req.body.description,
           location: req.body.location,
           date: req.body.date
       }
       let query = {_id: req.body.id}

       Event.updateOne(query, newfeilds, (err)=> {
           if(!err) {
               req.flash('info', " The event was updated successfuly"),
               res.redirect('/events/edit/' + req.body.id)
           } else {
               console.log(err)
           }
       })
    }
}
else {
    res.sendStatus(403) // Forbidden
} 
})







 // edit route stadium

router.get('/sedit/:id', isAuthenticated,(req,res)=> {
    if (req.user.isAuthor()){
    Event.findOne({_id: req.params.id}, (err,event)=> {
        
        if(!err) {
       
         res.render('event/sedit', {
             event: event,
             eventDate: moment(event.date).format('YYYY-MM-DD'),
             errors: req.flash('errors'),
             message: req.flash('info')
         })
 
        } else {
            console.log(err)
        }
    
     })
    }
    else {
        res.sendStatus(403) // Forbidden
    } 
})

router.post('/supdate',[
    check('title').isLength({min: 5}).withMessage('Title should be more than 5 char'),
    check('description').isLength({min: 5}).withMessage('Description should be more than 5 char'),
    check('location').isLength({min: 3}).withMessage('Location should be more than 5 char'),
    check('date').isLength({min: 5}).withMessage('Date should valid Date'),

], isAuthenticated,(req,res)=> {
    if(req.user.isAuthor()){
    const errors = validationResult(req)
    if( !errors.isEmpty()) {
       
        req.flash('errors',errors.array())
        res.redirect('/events/sedit/' + req.body.id)
    } else {
       // crete obj
       let newfeilds = {
           title: req.body.title,
           description: req.body.description,
           location: req.body.location,
           date: req.body.date,
           booking: req.body.booking
       }
       let query = {_id: req.body.id}

       Event.updateOne(query, newfeilds, (err)=> {
           if(!err) {
               req.flash('info', " The event was updated successfuly"),
               res.redirect('/events/show/' + req.body.id)
           } else {
               console.log(err)
           }
       })
    }
}
else {
    res.sendStatus(403) // Forbidden
} 
})




router.delete('/delete/:id',isAuthenticated, (req,res)=> {
    if(req.user.isAuthor()){
    let query = {_id: req.params.id}

    Event.deleteOne(query, (err)=> {

        if(!err) {
            res.status(200).json('deleted')
        } else {
            res.status(404).json('There was an error .event was not deleted')
        }
    })
}
else {
    res.sendStatus(403) // Forbidden
} 
})

module.exports = router 


