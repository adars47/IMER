const express = require('express')

const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth.js')
const listener = require('../models/Listener.js')

router.get('/',ensureGuest,(req,res)=>{
    res.render('login',{
        layout:'login'
    })
});


router.get('/dashboard',ensureAuth,async (req,res)=>{
    const listeners = await listener.find({user: req.user}).lean()
    console.log(listeners);
    res.render('dashboard',{
        name: req.user.displayName,
        listeners: listeners
    })
});

router.post('/listener',ensureAuth,async (req,res)=>{
    await listener.create({name:req.body.name,notify:req.body.notification,user:req.user})
    res.redirect('/listener')
});

router.get('/listener',ensureAuth,async (req,res)=>{
    res.render('listener',{
        notification_options: ["email","sms"]
    })
});

router.get('/edit_listener/:id',ensureAuth,async (req,res)=>{
    const listener_obj = await listener.findOne({_id: req.params.id}).lean();

    if(!listener_obj)
    {
        //return a 404 error
    }

    if(!listener_obj.user._id.equals(req.user._id))
    {
        res.redirect("/dashboard");
    }

    console.log(listener_obj);

    res.render('editListener',{
        notification_options: ["email","sms"],
        listener:listener_obj
    })
});

module.exports = router;