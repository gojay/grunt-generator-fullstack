'use strict';

var express = require('express');
var controller = require('./<%= name %>.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/basic', controller.basic);
router.get('/:id', controller.show);
router.get('/:id/basic', controller.basicInfo);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
