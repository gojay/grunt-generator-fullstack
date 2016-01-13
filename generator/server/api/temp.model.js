'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

var <%= className %>Schema = new Schema({
<% if(fields) { _.forEach(fields, function(field) { %>
    <%= field.name %>: <%= field.modelObj %>,
<% }) } else { %>
    name: String,
    info: String,
    <% } %>
    created: {
        type: Date,
        default: Date.now
    }
});

<%= className %>Schema.methods = {
    saveAsync: function() {
        var self = this;
        return Q.Promise(function (resolve, reject) {
            self.save(function (err, result) {
                if(err) return reject(err);
                resolve(result);
            });
        });
    }
};

module.exports = mongoose.model('<%= className %>', <%= className %>Schema);
