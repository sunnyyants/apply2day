/**
 * Created by Sunny on 8/5/14.
 */
var mongoose = require('mongoose');

var UserSchema = require('../schema/user');

var User = mongoose.model('User', UserSchema);

module.exports = User;