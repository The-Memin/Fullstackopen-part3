require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


app.use(express.json())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(express.static('dist'))
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

app.get('/api/people/:id', (request, response)=>{
  Person.findById(request.params.id).then( person =>{
    response.json(person)
  })
})

app.delete('/api/people/:id', (request, response)=>{
  Person.deleteOne({_id: request.params.id}).then(_ =>{
    response.json(_)
  })
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


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})