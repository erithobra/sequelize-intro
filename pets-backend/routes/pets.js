const express = require('express');
const router = express.Router();
const Pet = require('../models').Pet;

// ALL THE PETS
router.get('/', (req, res) => {
  Pet.findAll()
    .then(pets => {
      res.json({ pets: pets })
    })
})

// ONE PET
router.get('/:id', (req, res) => {
  Pet.findByPk(req.params.id)
    .then(pet => {
      res.json({ pet: pet })
    })
})

// CREATE A PET
router.post('/', (req, res) => {
  console.log(req.body)
  Pet.create(req.body.newPet)
    // .then(() => {
    //   return Pet.findAll()
    // })
    .then(pet => {
      res.json({ pet })
    })
})

// UPDATE A PET
router.put('/:id', (req, res) => {
  Pet.update(req.body, {
    where: { id: req.params.id }
  })
    .then(pet => {
      res.json({ pet: pet })
    })
})

// DELETE A PET
router.delete('/:id', (req, res) => {
  Pet.destroy({ where: { id: req.params.id } })
    .then(() => {
      return Pet.findAll()
    })
    .then(pets => {
      res.json({ pets: pets })
    })
})

module.exports = router;