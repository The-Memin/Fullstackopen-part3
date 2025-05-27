const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let persons = [
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

app.delete('/api/persons/:id', (request, response)=>{
  const id = request.params.id
  persons = persons.filter(p => p.id.toString() !== id)

  response.status(204).end()
})


app.post('/api/persons/', (request, response)=>{
  const {name, phone} = request.body
  
  if(!name || !phone){
    return response.status(400).json({
      error: 'Name and phone number are required'
    })
  }
  // Validar si el nombre ya está en la agenda
  const nameExists = persons.some(person => person.name.toLowerCase() === name.toLowerCase());
  if (nameExists) {
    return response.status(409).json({ 
      error: 'Name already exists in the phonebook' 
    });
  }

  // Crear y agregar nueva persona
  const newPerson = {
    id: generateID(),
    name,
    phone
  };

  persons = persons.concat(newPerson);
  response.status(201).json(newPerson);
})

const generateID = ()=> {
  const caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  for (let i = 0; i < 5; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    id += caracteres.charAt(indiceAleatorio);
  }
  return Date.now() + "_" + id;
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})