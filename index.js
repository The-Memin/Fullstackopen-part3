const express = require('express')
const app = express()

const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "phone": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "phone": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "phone": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "phone": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) =>{
    response.json({persons})
})

app.get('/info', (request, response) =>{
    const currentDate = new Date()

    const html_response = `<div>
                            <p>Phonebook has info for ${persons.length} people</p>
                            <p>${currentDate}</p>
                          </div>`

    response.send(html_response)
})

app.get('/api/persons/:id', (request, response)=>{
  const id = request.params.id
  const person = persons.find(p => p.id.toString() === id)

  person 
    ? response.json(person) 
    : response.status(404).end()
  
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})