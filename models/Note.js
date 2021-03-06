var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var noteSchema = new mongoose.Schema({
  text: { type: String, unique: false },
  twitterHandle: { type: String, unique: false },
  updated: { type: Date, unique: false },
  grade: {type: Number},
  votes: { type: Number, default: 0, unique: false }
});

noteSchema.pre('save', function(next) {
  if (!this.updated) this.updated = new Date;
  next();
});

//module.exports = mongoose.model('Note', noteSchema);
var noteModel = mongoose.model('Note', noteSchema);

// If I want to add extra functionality to the model, that's the way to do it.
noteModel.hello = function() {
};

module.exports = noteModel;
