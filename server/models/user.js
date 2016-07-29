console.log('user model')
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 2, maxlength: 250},
    games_played: {type: Number, default: 0},
    songs_unlocked: {type: Number, default: 0},
    games_won:  {type: Number, default: 0}

}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

mongoose.model('users', UserSchema)
