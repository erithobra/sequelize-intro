const express = require('express');
const router = express.Router();
const ctrl = require('../controllers');

router.get('/new', ctrl.fruits.renderNew);
router.get('/', ctrl.fruits.index);
router.get('/:index', ctrl.fruits.show);
router.post('/', ctrl.fruits.postFruit);
router.get('/:index/edit', ctrl.fruits.renderEdit);
router.put('/:index', ctrl.fruits.editFruit);
router.delete('/:index', ctrl.fruits.deleteFruit);

module.exports = router;