'use strict';

var app = require('../../app');
var should = require('should');
var utils = require('./index');
var _ = require('lodash');

describe.skip('Utils', function() {

	var query = {
        "id": "1|2|3",
        "field1": "value1",
        "field2": {
            "like": "%hat"
        },
        "field3": {
            "notLike": "hat%"
        },
        "price": {
            "gte": "100",
            "lte": "500",
        },
        "q": {
            "name": "john",
            "desc": "some",
            "sellPrice": "1000",
        },
        "fields": "name|stockCount",
        "sort": {
            "name": "asc",
            "sellPrice": "desc",
            "createdAt": "desc"
        },
        "page": "1",
        "limit": "10"
    };

    var parseQuery;

    before(function(done) {
		parseQuery = utils.parseQuery(query);
		done();
    });

    it('should have "where" query when through query as field', function(done) {
        parseQuery.where.should.containEql({
            id: { $in: [1,2,3] },
            field1: 'value1',
            field2: { $like: '%hat' },
            field3: { $notLike: 'hat%' },
            price: {
                $gte: 100,
                $lte: 500
            }
        });
        done();
    });

    it('should have "where" query and as expected', function(done) {
    	parseQuery.where.should.containEql({
    		name: { $iLike: '%john%' },
    		desc: { $iLike: '%some%' },
    		sellPrice: 1000
    	});
    	delete query.q.id;
    	done();
    });

    it('should have "where" operator query and as expected', function(done) {
    	query.q['operator'] = 'or';
		var newParseQuery = utils.parseQuery(query);
    	newParseQuery.where.should.containEql({
    		$or: {
	    		name: { $iLike: '%john%' },
	    		desc: { $iLike: '%some%' },
	    		sellPrice: 1000
    		}
    	});
    	done();
    });

    it('should don\'t have "where" operator query, when query operator not allowed', function(done) {
    	query.q['operator'] = 'xx';
		var newParseQuery = utils.parseQuery(query);
    	newParseQuery.where.should.containEql({
    		name: { $iLike: '%john%' },
    		desc: { $iLike: '%some%' },
    		sellPrice: 1000
    	});
    	done();
    });

    describe('sellPrice query', function(){

	    it('should query is $lte, when value of sellPrice starts with -', function(done) {
	    	query.q['sellPrice'] = '-1000';
			var newParseQuery = utils.parseQuery(query);
	    	newParseQuery.where.should.containEql({
	    		sellPrice: { $lte: 1000 }
	    	});
	    	done();
	    });

	    it('should query is $gte, when value of sellPrice ends with -', function(done) {
	    	query.q['sellPrice'] = '1000-';
			var newParseQuery = utils.parseQuery(query);
	    	newParseQuery.where.should.containEql({
	    		sellPrice: { $gte: 1000 }
	    	});
	    	done();
	    });

	    it('should query is $gt, when value of sellPrice is 0-', function(done) {
	    	query.q['sellPrice'] = '0-';
			var newParseQuery = utils.parseQuery(query);
	    	newParseQuery.where.should.containEql({
	    		sellPrice: { $gt: 0 }
	    	});
	    	done();
	    });

	    it('should query is between, when value of sellPrice have "-" between 2 numbers', function(done) {
	    	query.q['sellPrice'] = '1000-2000';
			var newParseQuery = utils.parseQuery(query);
	    	newParseQuery.where.should.containEql({
	    		sellPrice: { $between: [1000, 2000] }
	    	});
	    	done();
	    });

	    it('should don\'t have any query, when value of sellPrice is invalid pattern', function(done) {
	    	query.q['sellPrice'] = '1000AS';
			var newParseQuery = utils.parseQuery(query);
	    	newParseQuery.where.should.containEql({
	    		name: { $iLike: '%john%' },
	    		desc: { $iLike: '%some%' }
	    	});
	    	done();
	    });
    });

    it('should have attributes query and as expected', function(done) {
    	parseQuery.attributes.should.be.ok.and.eql(['name', 'stockCount']);
    	done();
    });

    it('should have order query and as expected', function(done) {
    	parseQuery.order.should.be.ok.and.eql([
    		['name', 'asc'],
    		['sellPrice', 'desc'],
    		['createdAt', 'desc']
		]);
    	done();
    });

    it('should have limit & offset query and as expected', function(done) {
    	parseQuery.offset.should.equal(0);
    	parseQuery.limit.should.equal(10);
    	done();
    });

    it('should offset query updated according page', function(done) {
    	query.page = '2';
		var newParseQuery = utils.parseQuery(query);
    	newParseQuery.offset.should.equal(10);
    	done();
    });
});