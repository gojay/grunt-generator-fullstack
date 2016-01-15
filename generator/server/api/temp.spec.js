'use strict';

var app = require('../../app');
var request = require('supertest');
var should = require('should');

var new<%= className %>;

describe('<%= className %> API:', function() {

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
        <% _.forEach(fields, function(field){ %> 
          <%= field.test.post[0] %> : <%= field.test.post[1] %>,
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
      <% _.forEach(fields, function(field){ %> 
        new<%= className %>.<%= field.test.post[0] %>.should.equal(<%= field.test.post[1] %>);
      <% }) %>
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
      <% _.forEach(fields, function(field){ %> 
        new<%= className %>.<%= field.test.post[0] %>.should.equal(<%= field.test.post[1] %>)
      <% }) %>
    });

  });

  describe('PUT /api/<%= name %>s/:id', function() {
    var updated<%= className %>

    beforeEach(function(done) {
      request(app)
        .put('/api/<%= name %>s/' + new<%= className %>._id)
        .send({
          name: 'Updated <%= className %>',
          price: 99999,
          description: 'This is the updated <%= name %>!!!'
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
      updated<%= className %>.name.should.equal('Updated <%= className %>');
      updated<%= className %>.price.should.equal(99999);
      updated<%= className %>.description.should.equal('This is the updated <%= name %>!!!');
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
