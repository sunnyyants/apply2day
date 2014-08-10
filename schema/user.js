/**
 * Created by Sunny on 8/5/14.
 */
var mongoose = require('mongoose');
var Company = require('../models/company');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    registerDate:{
        type:Date,
        default:Date.now()
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
      }).exec(callback)
  }
};



module.exports = UserSchema;