const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://guillejuma:${password}@cluster0.lnm2x0o.mongodb.net/noteBookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    phone: Number
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.phone}`)
        })
      mongoose.connection.close()
    })
}else{
    const newName = process.argv[3]
    const newPhone = Number(process.argv[4])

    if (typeof newName !== 'string') {
        console.log('Provide a valid name')
        process.exit(1)
    }
    if (isNaN(newPhone)) {
        console.log('Provide a valid number')
        process.exit(1)
    }
    const person= new Person({
        name: newName,
        phone: newPhone
    })

    person.save().then(result =>{
        console.log(`added ${result.name} number ${result.phone} to phonebook`)
        mongoose.connection.close()
    })
}

