var express = require('express');
var router = express.Router();
var _ = require('underscore');
var User = require('../models/user');
var passport = require('passport');
var Company = require('../models/company');
var mongoose = require('mongoose');
//var ObjectId = mongoose.Types.ObjectId;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/admin/movie',function(req,res){
    res.render('admin',{title:'I am an admin!'})
});

router.get('/admin/list',function(req,res){
    res.render('list',{title:'List'})
});

router.get('/movie/:id', function(req, res){
    res.render('details', {title:'Details'})
});

router.get('/profile',function(req,res){
    res.render('profile', {user:req.user})
});

router.get('/logout',function(req,res){
    res.redirect('/')
});

//router.post('/signup',function(req, res){
//    var userObj = req.body;
////    console.log(userObj.username);
////    console.log(userObj.password);
//    var user;
//
//    user = new User();
//    user.username = userObj.username;
//    user.password = user.generateHash(userObj.password);
//    user.save(function(err){
//        if(err){
//            console.log(err);
//            throw err;
//        }
////        console.log("Done saving!");
//        res.send('"Done saving!"');
//        done(null,'Done saving!');
//    })
//});

router.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login', { message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

router.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup', { message: req.flash('signupMessage') });
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

router.get('/dashboard/:id/apply', function(req, res){
    res.render('dashboard',{user:req.user})
});

router.post('/dashboard/:id/apply', function(req, res){
    var id = req.params.id;
    var companyObj = req.body;
    var _user;
    if(id){
         User.findById(id,function(err, user){
             var newCompany = new Company();
             newCompany.name = companyObj.Cname;
             newCompany.title = companyObj.Ctitle;
             newCompany.place.city = companyObj.Ccity;
             newCompany.place.state = companyObj.Cstate;
             newCompany.place.country = companyObj.Ccountry;
             newCompany.requirement = companyObj.Crequirement;
             newCompany.applyDate = Date.now();
             newCompany.updateDate = Date.now();
             newCompany.result = "Pending";
             user.positions.push(newCompany);
             _user = _.extend(user);
             _user.save(function(err,u){
                 if(err){
                     throw err
                 }
                 res.render('profile',{user:u});
             })
         })
    }
});

router.get('/dashboard/:id/list', function(req, res){
    var id = req.params.id;
    var _positions;
    if(id){
        User.findById(id, function(err, user){
            if(err) throw err;

            _positions = _.extend(user.positions);
            res.render('list',{userId:user._id, positions:_positions});
        })
    }
});

router.get('/dashboard/:uId/company/:cId',function(req, res){
    var userId = mongoose.Types.ObjectId(req.params.uId);
    var cId = mongoose.Types.ObjectId(req.params.cId);
    var _position;
    if(userId){
        User.aggregate([{$match:{_id:userId}},{$unwind:"$positions"},{$match:{'positions._id':cId}}],function(err,result){
            if(err) throw err;
            _position = _.extend(result[0].positions);
            res.render('detail',{position:_position,userId:userId})
        });
    }
});



module.exports = router;
