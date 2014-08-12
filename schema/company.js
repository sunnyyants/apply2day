/**
 * Created by Sunny on 8/7/14.
 */

var mongoose = require('mongoose');
var moment = require('moment');

var CompanySchema = new mongoose.Schema({
    name:String,
    title:String,
    place:{
        city:String,
        state:String,
        country:String
    },
    requirement:String,
    applyDate:{
        date:{
            type:Date,
            default:Date.now()
        },
        dateString:{
            type:String,
            default:moment().format('MMM Do YY, h:mm:ss a')
        }

    },
    updateDate:{
        date:{
            type:Date,
            default:Date.now()
        },
        dateString:{
            type:String,
            default:moment().format('MMM Do YY, h:mm:ss a')
        }
    },
    result:String
},{collection:"Company"});

CompanySchema.statics={
    findById:function(id, callback){
        return this.findOne({
            _id:id
        }).exec(callback)
    }
};

module.exports = CompanySchema;