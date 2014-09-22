/**
 * Created by Sunny on 8/5/14.
 */
var mongoose = require('mongoose');
var Company = require('../models/company');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');

var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    registerDate:{
        date:{
            type:Date,
            default:Date.now()
        },
        dateString:{
            type:String,
            default:moment().format('MMM Do YY, h:mm:ss a')
        }
    },
    positions:{type:Array, default:[]}
},{collection:'User'});


UserSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
};

UserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
};


UserSchema.statics = {
    findById:function(id, callback){
        return this.findOne({
            _id:id
        }).exec(callback);
    },
    userDeleteCompany:function(userId, companyId, callback){
        return this.update({
            _id:userId
        },{
            $pull:{
                positions:{
                    _id:companyId
                }
            }
        }).exec(callback);
    },
    userUpdateCompanyStatus:function(userId, companyId, newStatus, newDate, callback){
        return this.update({
            _id:userId, "positions._id":companyId
        },{
            $set:{
                "positions.$.result": newStatus,
                "positions.$.updateDate.date": newDate,
                "positions.$.updateDate.dateString":moment().format('MMM Do YY, h:mm:ss a')
            }
        }).exec(callback)
    },
    userCountTotalApplications:function(userId, callback){
        return this.aggregate([{$match:{'_id':userId}},{$unwind:'$positions'},{$group:{"_id":null,"total":{$sum:1}}}]).exec(callback);
    },
    userCountDailyApplications:function(userId,callback){
        var date = new Date();
        var today = new Date([date.getFullYear(),date.getMonth()+1,date.getDate()]);
        var tomorrow = new Date([date.getFullYear(),date.getMonth()+1,date.getDate()+1]);
        return this.aggregate([{$unwind:'$positions'},{$match:{_id:userId,'positions.applyDate.date':{$gte:today,$lt:tomorrow}}},{$group:{_id:null,total:{$sum:1}}}]).exec(callback);
    },
    userCountMonthlyApplications:function(userId,callback){
        var date = new Date();
        var thisMonth = new Date([date.getFullYear(),date.getMonth()+1]);
        var nextMonth = new Date([date.getFullYear(),date.getMonth()+2]);
        return this.aggregate([{$unwind:'$positions'},{$match:{_id:userId,'positions.applyDate.date':{$gte:thisMonth,$lt:nextMonth}}},{$group:{_id:null,total:{$sum:1}}}]).exec(callback);
    },
    userCountWeeklyApplications:function(userId, callback){
        var temp = new Date();
        var today = new Date([temp.getFullYear(),temp.getMonth()+1,temp.getDate()]);
        var day = today.getDay() == 0 ? 7 : today.getDay();
        var thisWeek = new Date(today.getTime()-((day-1) * 24 * 60 * 60 * 1000));
        var nextWeek = new Date((today.getTime()+(8-day) * 24 * 60 * 60 * 1000));
        return this.aggregate([{$unwind:'$positions'},{$match:{_id:userId,'positions.applyDate.date':{$gte:thisWeek,$lt:nextWeek}}},{$group:{_id:null,total:{$sum:1}}}]).exec(callback);
    },
    userUpdateCompanyName:function(userId, companyId, newName, callback){
        return this.update({
            _id:userId, "positions._id":companyId
        },{
            $set:{
                "positions.$.name": newName
            }
        }).exec(callback)
    },
    userUpdateCompanyLocation:function(userId, companyId, newLocation, callback){
        return this.update({
            _id:userId, "positions._id":companyId
        },{
            $set:{
                "positions.$.place.city": newLocation
            }
        }).exec(callback)
    },
    userUpdateCompanyPosition:function(userId, companyId, newPosition, callback){
        return this.update({
            _id:userId, "positions._id":companyId
        },{
            $set:{
                "positions.$.title": newPosition
            }
        }).exec(callback)
    },
    userUpdatePositionRequirement:function(userId, companyId, newRequirement, callback){
        return this.update({
            _id:userId, "positions._id":companyId
        },{
            $set:{
                "positions.$.requirement": newRequirement
            }
        }).exec(callback)
    }
};

module.exports = UserSchema;