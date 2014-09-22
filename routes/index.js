var express = require('express');
var router = express.Router();
var _ = require('underscore');
var User = require('../models/user');
var passport = require('passport');
var Company = require('../models/company');
var mongoose = require('mongoose');
var moment = require('moment');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});


router.get('/profile',function(req,res){
    res.redirect('/user/' + req.user._id + "/dashboard");
//    res.render('profile', {user:req.user})
});

router.get('/user/:id/dashboard',function(req,res){
    res.render('profile',{user:req.user})
});

router.get('/logout',function(req,res){
    res.redirect('/')
});


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
    successRedirect : '/profile/', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

router.get('/user/:id/apply', function(req, res){
    var id = mongoose.Types.ObjectId(req.params.id);
    var total,daily,weekly,monthly;
    if(id){
        async.parallel([
            function(cb){
                User.userCountTotalApplications(id,function(err,result){
                    total = result.length == 0 ? 0 : _.extend(result[0].total);
                    cb(null, total);
                });
            },
            function(cb){
                User.userCountDailyApplications(id,function(err,result){
                    daily = result.length == 0 ? 0 : _.extend(result[0].total);
                    cb(null, daily);
                });
            },
            function(cb){
                User.userCountWeeklyApplications(id,function(err,result){
                    weekly = result.length == 0 ? 0 : _.extend(result[0].total);
                    cb(null, weekly);
                });
            },
            function(cb){
                User.userCountMonthlyApplications(id,function(err,result){
                    monthly = result.length == 0 ? 0 : _.extend(result[0].total);
                    cb(null, monthly);
                })
            }
        ],function(err,results){
            res.render('apply',{userId:id,total:results[0],daily:results[1],weekly:results[2], monthly:results[3]})
        });
    }
});

router.post('/user/:id/apply', function(req, res){
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
            newCompany.applyDate.date = Date.now();
            newCompany.applyDate.dateString = moment().format('MMM Do YY, h:mm:ss a');
            newCompany.updateDate.date = Date.now();
            newCompany.updateDate.dateString = moment().format('MMM Do YY, h:mm:ss a');
            newCompany.result = "Pending";
            user.positions.push(newCompany);
            _user = _.extend(user);
            _user.save(function(err,user){
                if(err){
                    throw err
                }
                res.render('profile',{user:user});
            })
        })
    }
});

router.get('/user/:id/list', function(req, res){
    var id = req.params.id;
    var _positions;
    if(id){
        User.findById(id, function(err, user){
            if(err) throw err;

            _positions = _.extend(user.positions);
            res.render('list',{userId:user._id, positions:_positions,order:1});
        })
    }
});

router.get('/user/:userId/company/:companyId',function(req, res){
    var userId = mongoose.Types.ObjectId(req.params.userId);
    var companyId = mongoose.Types.ObjectId(req.params.companyId);
    var _position;
    if(userId){
        User.aggregate([{$match:{_id:userId}},{$unwind:"$positions"},{$match:{'positions._id':companyId}}],function(err,result){
            if(err) throw err;
            _position = _.extend(result[0].positions);
            res.render('detail',{position:_position,userId:userId,companyId:companyId})
        });
    }
});

router.get("/user/:uId/delete/:cId", function(req, res){
    var userId = mongoose.Types.ObjectId(req.params.uId);
    var cId = mongoose.Types.ObjectId(req.params.cId);

    if(userId){
        User.userDeleteCompany(userId,cId, function(err,result){{
            if(err) throw err;
            res.redirect('/user/' + userId + "/list");
        }})
    }
});

router.get("/user/:userId/update/:companyId/:newStatus", function(req,res){
    var userId = mongoose.Types.ObjectId(req.params.userId);
    var companyId = mongoose.Types.ObjectId(req.params.companyId);
    var newStatus = req.params.newStatus;
    var newDate = new Date();
    if(userId){
        User.userUpdateCompanyStatus(userId,companyId,newStatus, newDate, function(err,result){
            if(err) throw err;
            res.redirect('/user/' + userId + "/list");
        })
    }
});

router.post("/user/:userId/search", function(req, res){
    var userId = mongoose.Types.ObjectId(req.params.userId);
    var companyName = req.body.name;
    var _positions = [];
    if(userId){
        User.aggregate([{$match:{_id:userId}},{$unwind:'$positions'},{$match:{'positions.name':companyName}}],function(err,results){
            if(err) throw err;
            for(var i = 0; i < results.length; i++){
                if(results[i].hasOwnProperty("positions")){
                    _positions.push(results[i].positions);
                }
            }
            res.render('list',{userId:userId, positions:_positions,order:1});
        })
    }
});

router.get("/user/:userId/sort/appDate/:order",function(req,res){
    var userId = mongoose.Types.ObjectId(req.params.userId);
    var order = parseInt(req.params.order);
    var _positions;
    if(userId){
        User.aggregate([{$unwind:'$positions'},{$sort:{"positions.applyDate.date":order}},{$group:{_id:"$_id", positions:{$push:'$positions'}}}], function(err, results){
            if(err) throw err;
            _positions = _.extend(results[0].positions);
            res.render('list',{userId:userId, positions:_positions,order:-order});
        })
    }
});

router.get("/user/:userId/sort/updateDate/:order",function(req,res){
    var userId = mongoose.Types.ObjectId(req.params.userId);
    var order = parseInt(req.params.order);
    var _positions;
    if(userId){
        User.aggregate([{$unwind:'$positions'},{$sort:{"positions.updateDate.date":order}},{$group:{_id:"$_id", positions:{$push:'$positions'}}}], function(err, results){
            if(err) throw err;
            _positions = _.extend(results[0].positions);
            res.render('list',{userId:userId, positions:_positions,order:-order});
        })
    }
});

router.get('/user/:userId/updateInfo/:companyId', function(req,res){
    var userId = mongoose.Types.ObjectId(req.params.userId);
    var companyId = mongoose.Types.ObjectId(req.params.companyId);
    var _position;
    if(userId){
        User.aggregate([{$match:{_id:userId}},{$unwind:"$positions"},{$match:{'positions._id':companyId}}],function(err,result){
            if(err) throw err;
            _position = _.extend(result[0].positions);
            res.render('updateInfo',{position:_position,userId:userId,companyId:companyId})
        });
    }
});

router.post('/user/:userId/updateInfo/:companyId', function(req,res){
    var companyObj = req.body;
    var userId = mongoose.Types.ObjectId(req.params.userId);
    var companyId = mongoose.Types.ObjectId(req.params.companyId);
    if(companyObj.Cname !== ''){
        User.userUpdateCompanyName(userId, companyId, companyObj.Cname);
    }
    if(companyObj.Ctitle !== ''){
        User.userUpdateCompanyLocation(userId, companyId, companyObj.Ctitle);
    }
    if(companyObj.Ccity !== ''){
        User.userUpdateCompanyPosition(userId, companyId, companyObj.Ccity);
    }
    if(companyObj.Crequirement !== ''){
        User.userUpdatePositionRequirement(userId, companyId, companyObj.Crequirement);
    }
    res.redirect('/user/' + userId + '/company/' + companyId);
});
module.exports = router;
