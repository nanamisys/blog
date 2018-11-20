'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
    id: { type: String, required: true },
    password: { type: String, required: true },
    updated_at: { type: Date },
    created_at: { type: Date }
});

AccountSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

module.exports = mongoose.model('Account', AccountSchema);