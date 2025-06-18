const peopleRouter = require('express').Router()
const Person = require('../models/person')

peopleRouter.get('/', (_, response) => {
  Person.find({}).then(p => {
    response.json(p)
  })
})

peopleRouter.get('/info', (request, response) => {
  Person.countDocuments({})
    .then(count => {
      const currentDate = new Date()
      const html_response = `<div>
                                <p>Phonebook has info for ${count} people</p>
                                <p>${currentDate}</p>
                              </div>`
      response.send(html_response)
    })
    .catch(error => {
      logger.error('Error counting people:', error)
      response.status(500).send('Error retrieving info')
    })
})

peopleRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id).then( person => {
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

peopleRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then( result => {
    if (result) {
      console.log(`Deleted person: ${result.name}`);
      response.status(204).end();
    } else {
      response.status(404).json({ error: 'Person not found' });
    }
  })
  .catch(error => next(error))
})

peopleRouter.put('/:id', (request, response, next) => {
  console.log(request.body)
  const body = request.body
  const person = {
    name: body.name,
    phone: body.phone
  }

  Person.findByIdAndUpdate(request.params.id, person,{
    runValidators: true,
    new:true,
    context:'query'
  })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

peopleRouter.post('/', (request, response, next) => {
  const { name, phone } = request.body
  // Crear y agregar nueva persona
  Person
    .create({
      name: name,
      phone: phone
    })
    .then( createdPerson => response.json(createdPerson))
    .catch(error => {
      console.log(error.message)
      next(error)
    })
})

module.exports = peopleRouter