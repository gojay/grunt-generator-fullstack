'use strict';

var app = require('../../app');
var request = require('supertest');
var should = require('should');
var mongoose = require('mongoose');
var _ = require('lodash');

var <%= className %> = require('./<%= name %>.model');

var new<%= className %>;

var newDate = new Date().toISOString();
var updateDate = new Date(Date.now()+24*60*60*1000).toISOString();
var newObjectId = mongoose.Types.ObjectId();
var updateObjectId = mongoose.Types.ObjectId();

describe('<%= className %> API:', function() {

  before(function(done) {
    <%= className %>.remove(done);
  });

  describe('GET /api/<%= name %>s', function() {
    var <%= name %>s, headers;

    beforeEach(function(done) {
      request(app)
        .get('/api/<%= name %>s')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          headers = res.headers;
          <%= name %>s = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      <%= name %>s.should.be.instanceOf(Array);
    });

    it('"x-pagination-total-count" should exists & equal 0', function() {
      should.exist(headers['x-pagination-total-count']);
      headers['x-pagination-total-count'].should.equal('0');
    });

  });

  describe('POST /api/<%= name %>s', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/<%= name %>s')
        .send({
        <% _.forEach(tests.post, function(test){ %> 
          <%= test.key %> : <%= test.value %>,
        <% }) %>
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          new<%= className %> = res.body;
          done();
        });
    });

    it('should respond with the newly created <%= name %>', function() {
    <% _.forEach(tests.post, function(test){ if(test.type == 'Date') { %>
      new Date(new<%= className %>.<%= test.key %>).should.be.an.instanceOf(<%= test.type %>);
      new<%= className %>.<%= test.key %>.should.be.an.instanceOf(String).and.equal(<%= test.expect %>);
    <% } else if(test.type == 'ObjectId') { %>
      mongoose.Types.ObjectId.isValid(new<%= className %>.<%= test.key %>).should.equal(true);
      new<%= className %>.<%= test.key %>.should.equal(<%= test.expect %>.toString());
    <% } else { %>
      new<%= className %>.<%= test.key %>.should.be.an.instanceOf(<%= test.type %>).and.equal(<%= test.expect %>);
    <% } }) %>
    });

  });

  describe('GET /api/<%= name %>s', function() {
    var <%= name %>s, headers;

    beforeEach(function(done) {
      request(app)
        .get('/api/<%= name %>s')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          headers = res.headers;
          <%= name %>s = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      <%= name %>s.should.be.instanceOf(Array);
    });

    it('"x-pagination-total-count" should exists & equal 1', function() {
      should.exist(headers['x-pagination-total-count']);
      headers['x-pagination-total-count'].should.equal('1');
    });

  });

  describe('GET /api/<%= name %>s/:id', function() {
    var <%= name %>;

    beforeEach(function(done) {
      request(app)
        .get('/api/<%= name %>s/' + new<%= className %>._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          <%= name %> = res.body;
          done();
        });
    });

    afterEach(function() {
      <%= name %> = {};
    });

    it('should respond with the requested <%= name %>', function() {
    <% _.forEach(tests.post, function(test){ if(test.type == 'Date') { %>
      new Date(new<%= className %>.<%= test.key %>).should.be.an.instanceOf(<%= test.type %>);
      new<%= className %>.<%= test.key %>.should.be.an.instanceOf(String).and.equal(<%= test.expect %>);
    <% } else if(test.type == 'ObjectId') { %>
      mongoose.Types.ObjectId.isValid(new<%= className %>.<%= test.key %>).should.equal(true);
      new<%= className %>.<%= test.key %>.should.equal(<%= test.expect %>.toString());
    <% } else { %>
      new<%= className %>.<%= test.key %>.should.be.an.instanceOf(<%= test.type %>).and.equal(<%= test.expect %>);
    <% } }) %>
    });

  });

  describe('PUT /api/<%= name %>s/:id', function() {
    var updated<%= className %>;

    beforeEach(function(done) {
      request(app)
        .put('/api/<%= name %>s/' + new<%= className %>._id)
        .send({
        <% _.forEach(tests.put, function(test){ %> 
          <%= test.key %> : <%= test.value %>,
        <% }) %>
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updated<%= className %> = res.body;
          done();
        });
    });

    afterEach(function() {
      updated<%= className %> = {};
    });

    it('should respond with the updated <%= name %>', function() {
    <% _.forEach(tests.put, function(test){ if(test.type == 'Date') { %>
      new Date(updated<%= className %>.<%= test.key %>).should.be.an.instanceOf(<%= test.type %>);
      updated<%= className %>.<%= test.key %>.should.equal(<%= test.expect %>);
    <% } else if(test.type == 'ObjectId') { %>
      mongoose.Types.ObjectId.isValid(updated<%= className %>.<%= test.key %>).should.equal(true);
      updated<%= className %>.<%= test.key %>.should.equal(<%= test.expect %>.toString());
    <% } else { %>
      updated<%= className %>.<%= test.key %>.should.be.an.instanceOf(<%= test.type %>).and.equal(<%= test.expect %>);
    <% } }) %>
    });

  });

  describe('BASIC', function() {

    before(function (done) {
      var data = [];
      _.times(4, function(n) {
        data.push({
      <% _.forEach(tests.fieldsObj, function(item) { 
        switch(item.type) {
          case 'String': %>
          <%= item.name %>: <%= item.value ? '\''+ item.value +'\'' : '\''+ item.name +' some-\'+ n' %>,
            <% break; 
          case 'Number': %>
          <%= item.name %>: 10 * n,
            <% break; 
          case 'Date': %>
          <%= item.name %>: new Date(Date.now() + n*60*60*1000),
            <% break; 
          case 'ObjectId': %>
          <%= item.name %>: mongoose.Types.ObjectId(),
            <% break; 
        }
      }); %> 
        });
      });

      <%= className %>.create(data).then(function() {
        done();
      });
    });

    describe('GET /api/<%= name %>s/basic?q=some', function() {
      var <%= name %>s;

      beforeEach(function(done) {
        request(app)
          .get('/api/<%= name %>s/basic?q=some')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            <%= name %>s = res.body;
            done();
          });
      });

      afterEach(function() {
        <%= name %>s = {};
      });

      it('should respond instanceOf Array & greater than 1', function() {
        <%= name %>s.should.be.an.instanceOf(Array);
        <%= name %>s.length.should.be.above(1);
      });

      it('should respond items have properties "<%= tests.fieldsArr %>"', function() {
        _.forEach(<%= name %>s, function(item) {
          var fields = '<%= tests.fieldsArr %>'.split(',');
          fields.unshift('_id');
          item.should.have.properties(fields);
        });
      });

    });

    describe('GET /api/<%= name %>s/:id/basic', function() {
      var <%= name %>;

      beforeEach(function(done) {
        request(app)
          .get('/api/<%= name %>s/' + new<%= className %>._id + '/basic?fields=<%= tests.fieldsArr.slice(0,2) %>')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            <%= name %> = res.body;
            done();
          });
      });

      afterEach(function() {
        <%= name %> = {};
      });

      it('should have <%= name %>', function() {
        <%= name %>.should.be.instanceOf(Object);
      });

      it('should respond item have properties "<%= tests.fieldsArr.slice(0,2) %>"', function() {
        var fields = '<%= tests.fieldsArr.slice(0,2) %>'.split(',');
        fields.unshift('_id');
        <%= name %>.should.have.properties(fields);
      });

    });

  });

  describe('DELETE /api/<%= name %>s/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/<%= name %>s/' + new<%= className %>._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when <%= name %> does not exist', function(done) {
      request(app)
        .delete('/api/<%= name %>s/' + new<%= className %>._id)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
