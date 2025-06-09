require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


app.use(express.static('build'))
app.use(express.json())
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors())

let people = []

app.get('/api/people', (request, response) =>{
  Person.find({}).then(p => {
    people = p
    response.json(p)
  })
})

app.get('/info', (request, response) =>{
    const currentDate = new Date()

    const html_response = `<div>
                            <p>Phonebook has info for ${people.length} people</p>
                            <p>${currentDate}</p>
                          </div>`

    response.send(html_response)
})

app.get('/api/people/:id', (request, response, next)=>{
  Person.findById(request.params.id).then( person =>{
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }
  })
  .catch(error =>next(error))
})

app.delete('/api/people/:id', (request, response, next)=>{
  Person.findByIdAndDelete(request.params.id).then( result =>{
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.put('/api/people/:id', (request, response)=>{
  console.log(request.body)
  const body = request.body
  const person = {
    name: body.name,
    phone: body.phone
  }

  Person.findByIdAndUpdate(request.params.id, person,{new:true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/people/', (request, response)=>{
  const body = request.body
  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  // Crear y agregar nueva persona
  const person = Person({
    name: body.name,
    phone: body.phone
  });

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})