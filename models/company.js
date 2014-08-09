/**
 * Created by Sunny on 8/7/14.
 */
var mongoose = require('mongoose');

var CompanySchema = require('../schema/company');

var Company = mongoose.model("Company",CompanySchema);

module.exports = Company;