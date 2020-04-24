var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var userSchema = new Schema({
    admin:{
        type: Boolean,
        default: false
    }
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',userSchema);