/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/<%= name %>              ->  index
 * POST    /api/<%= name %>              ->  create
 * GET     /api/<%= name %>/:id          ->  show
 * PUT     /api/<%= name %>/:id          ->  update
 * DELETE  /api/<%= name %>/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Q = require('q');
var <%= className %> = require('./<%= name %>.model');
var utils = require('../../components/utils');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.json(statusCode, err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.json(statusCode, entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.send(404);
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .then(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return Q.Promise(function (resolve, reject) {
        entity.remove(function (err) {
          if(err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }).then(function() {
        res.send(204);
      });
    }
  };
}

// Gets a list of Persons
exports.index = function(req, res) {
  var page  = req.query.page || 1,
      limit = req.query.limit || 20,
      skip  = (page - 1) * limit;

  var query = utils.parseQuery(req.query);

  Q.all([
    <%= className %>.count(query.where).exec(),
    <% if(referer && referer.modelPopulate) { %><%=referer.modelPopulate %> <% } else { %><%= className %>.find(query.where).sort(query.sort).skip(skip).limit(limit).exec() <% } %>
  ])
  .spread(function (total, <%= name %>s) {
    res.set('X-Pagination-Total-Count', total);
    res.json(<%= name %>s);
  })
  .then(null, handleError(res));
};

// Gets a single <%= className %> from the DB
exports.show = function(req, res) {
<% if(referer) { %> <%= className %>.findById(req.params.id).populate({ path: '<%= referer.className %>', select: '<%= referer.fields.toString().replace(/\,/g, ' ') %>' }).exec() <% } else { %> <%= className %>.findById(req.params.id).exec() <% } %>
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .then(null, handleError(res));
};

// Creates a new <%= className %> in the DB
exports.create = function(req, res) {
  <%= className %>.create(req.body)
    .then(responseWithResult(res, 201))
    .then(null, handleError(res));
};

// Updates an existing <%= className %> in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  <%= className %>.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .then(null, handleError(res));
};

// Deletes a <%= className %> from the DB
exports.destroy = function(req, res) {
  <%= className %>.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .then(null, handleError(res));
};

/**
 * /api/<%= name %>/basic
 * @param  {String} req.query.q 
 * @param  {String} req.query.fields field1|field2|field3 
 *
 * @example
 *  /api/<%= name %>/basic?q=lorem&fields=field1|field2|field3
 */
exports.basic = function(req, res) {
  var q = req.query.q, fields = req.query.fields;
  var filter = {};

  if(fields) {
    var or = fields.split('|').map(function (field) {
      var obj = {};
      obj[field] = new RegExp(q, 'i');
      return obj;
    });
    filter = { $or: or };
  } else {
    <% if(referer) { %>
    filter = q ? { <%= referer.fields[0] %>: new RegExp(q, 'i') } : {} ;
    <% } else { %>
    filter = q ? { name: new RegExp(q, 'i') } : {} ;
    <% } %>
  }
  <%= className %>.find(filter).exec()
    .then(responseWithResult(res))
    .then(null, handleError(res));
};

exports.basicInfo = function(req, res) {
<% if(referer) { %> <%= className %>.findById(req.params.id).populate({ path: '<%= referer.className %>', select: '<%= referer.fields.toString().replace(/\,/g, ' ') %>' }).exec() <% } else { %> <%= className %>.findById(req.params.id).exec() <% } %>
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .then(null, handleError(res));
};
