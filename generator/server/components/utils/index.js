'use strict';

var _ = require('lodash');

/**
 * parse query parameters
 *
 * http://localhost:9000/api/:controller?
 *     // match
 *     id=1|2|3|4&
 *     sellPrice[gte]=10000&
 *     sellPrice[lte]=90000&
 *     {field}={value}&
 *     // regex
 *     q[name]=john&
 *     q[desc]=something&
 *     // auto
 *     q[sellPrice]=9000|-9000|9000-|9000-10000
 *     // symbol
 *     q[sellPrice]=>10|>=10|<10|<=10|=10
 *     // boolean operator
 *     q[operator]=or&
 *     sort[name]=asc&
 *     sort[createdAt]=desc&
 *     fields=name|stockCount&
 *     page=1&
 *     limit=10
 */
function parseQuery( query ) {
    var options = {};
    options.where = {};

    var keys = ['fields', 'limit', 'page', 'q', 'sort'];
    var queryKeys = _.keys(query);
    var fieldKeys = _.difference(queryKeys, keys);

    if( !_.isEmpty(fieldKeys) ) {
        options.where = _.chain(query)
          .pick(function(v,k) { 
            return ~_.indexOf(fieldKeys, k);
          }).transform(function(result, v, k){
            var filter = {};
            if( _.isString(v) ) {
                if( /\|/.test(v) ) { // in array
                    var values = v.split('|');
                    filter.$in = k == 'id' ? _.map(values, function(item){ return parseInt(item) }) : values ;
                    result[k] = filter;
                } else { // match
                    result[k] = v;
                }
            } else {
                result[k] = _.transform(v, function(result, v, k) {
                    var numbers = ['gt', 'gte', 'lt', 'lte'];
                    result['$'+k] = ~_.indexOf(numbers, k) ? parseInt(v) : v ;
                });
            }
          }).value();
    }

    if( query.q ) {
      var q = _.chain(query.q)
        .omit('operator')
        .transform(function(result, v, k) {
          var filter = {};
          if( k == 'id' && !_.isEmpty(v) ) {
            result[k] = v;
          } 
          // regex range numbers
          // accept "-" on first, last or between 2 numbers
          // example: 100, -100, 100-, 100-200
          else if( /^(\-)?\d+(\-)?(\d+)?$/.test(v) ) {
            var price = parseInt(v.replace('-', ''));
            var index = v.indexOf('-');
            if( ~index ) {
                if( index == 0 ) {
                    filter['$lte'] = price;
                } else if( index == (v.length - 1) ) {
                    var agg = price == 0 ? '$gt' : '$gte';
                    filter[agg] = price;
                } else {
                    var numbers = v.split('-').map(function(n) { return parseInt(n); });
                    filter = { $gte: numbers[0], $lte: numbers[1] };
                }
            } else { // if null / not match is equal
                filter = v;
            }
            result[k] = filter;
          } 
          // regex gt, gte, lt, lte, equal = symbols
          else if(/[<>]=?|=/.test(v)) {
            var symbol = v.match(/[<>]=?|=/)[0];
            var number = parseInt(v.replace(symbol, ''));
            switch(symbol) {
              case '<':
                filter = { $lt: number };
                break;
              case '<=':
                filter = { $lte: number };
                break;
              case '>':
                filter = { $gt: number };
                break;
              case '>=':
                filter = { $gte: number };
                break;
              default:
                filter = number;
                break;
            }
            result[k] = filter;
          }
          else if(!_.isEmpty(v)) {
            result[k] = { $regex: v, $options: 'i' };
          }
        }).value();

        // operator query
        var _where = q;
        if(_.has(query.q, 'operator') && ~_.indexOf(['or', 'and'], query.q.operator)) {
          var operator = '$' + query.q.operator;
          _where = {};
          _where[operator] = q;
        }

        options.where = _.assign(options.where, _where);
    }

    if( query.sort ) {
      options.sort = _.reduce(query.sort, function (result, v, k) {
        result[k] = v =='desc' ? -1 : 1;
        return result;
      }, {});
    }

    if( query.limit ) {
      options.limit = parseInt(query.limit);
    }

    // limit & offset
    if( query.page ) {
      options.limit = parseInt(query.limit) || 10;
      options.offset = options.limit * (query.page - 1);
    }

    // attributes
    if( query.fields ) {
      options.attributes = query.fields.split('|');
    }
    // attributes
    if( query.select ) {
      options.attributes = query.select.split('|');
    }

    return options;
}

module.exports.parseQuery = parseQuery;
