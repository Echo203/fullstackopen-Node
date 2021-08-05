const { Router, request, response } = require("express");
const express = require("express");
const morgan = require("morgan")
const cors = require('cors')
const app = express();

let persons = [
	{ 
		"id": 1,
		"name": "Arto Hellas", 
		"number": "040-123456"
	},
	{ 
		"id": 2,
		"name": "Ada Lovelace", 
		"number": "39-44-5323523"
	},
	{ 
		"id": 3,
		"name": "Dan Abramov", 
		"number": "12-43-234345"
	},
	{ 
		"id": 4,
		"name": "Mary Poppendieck", 
		"number": "39-23-6423122"
	}
]

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token("body", (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// const XD = (req, res, next) => {
// 	console.log(req.body)
// 	console.log(typeof req.body)
// 	const x = JSON.stringify(req.body)
// 	console.log(typeof x)
// 	next()
// }
// app.use(XD)

const generateId = () => {
	return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (req, res) => {
	const body = req.body

	if (!body.name || !body.number) {
		return res.status(400).json("Missing content")
	}

	if (persons.find(p => p.name === body.name)) {
		return res.status(400).json("Name already in the book")
	}

	const newPerson = {
		id: generateId(),
		name: body.name,
		number: body.number
	}

	persons = persons.concat(newPerson)
	res.json(newPerson)
})

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/info', (req, res) => {
	res.send(`Phonebook has total of ${persons.length} contacts, today is ${new Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(p => p.id === id)
	if (!person) {
		return res.status(404).end()
	}

	res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
	const id = req.params.id
	persons = persons.filter(p => p.id !== id)

	res.status(204).end()
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
