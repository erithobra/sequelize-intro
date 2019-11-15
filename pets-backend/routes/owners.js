const express = require('express');
const router = express.Router()
const Owner = require('../models').Owner
const Pet = require('../models').Pet

// INDEX FOR ALL OWNERS
router.get('/', (req, res) => {
  Owner.findAll({
    include: [{
      model: Pet,
      attributes: ['name', 'breed', 'age']
    }],
    attributes: ['firstName', 'lastName']
  })
    .then(owners => {
      res.json({ owners })
    })
})

router.get('/:id', (req, res) => {
  let foundOwner = {}
  Owner.findByPk(req.params.id, {
    include: [{ model: Pet }]
  })
    .then(owner => {
      res.json({ owner })
    })
})

// DELETE AN OWNER
router.delete('/:id', (req, res) => {
  Owner.destroy({ where: { id: req.params.id } })
    .then(() => {
      return Owner.findAll()
    })
    .then(owners => {
      res.json({ owners })
    })
})


module.exports = router;