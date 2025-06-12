require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors())

app.get('/api/people', (request, response) => {
  Person.find({}).then(p => {
    console.log(p)
    response.json(p)
  })
})

app.get('/info', (request, response) => {
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
      console.error('Error counting people:', error)
      response.status(500).send('Error retrieving info')
    })
})

app.get('/api/people/:id', (request, response, next) => {
  Person.findById(request.params.id).then( person => {
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/people/:id', (request, response, next) => {
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

app.put('/api/people/:id', (request, response, next) => {
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

app.post('/api/people/', (request, response, next) => {
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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})