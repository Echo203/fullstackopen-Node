require("dotenv").config();
const { Router, request, response } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Phone = require("./models/mongo");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json("Missing content");
  }

  const newPerson = new Phone({
    name: body.name,
    number: body.number,
  });

	newPerson.save().then(savedPerson => {
		res.json(savedPerson)
	})
});

app.get("/api/persons", (req, res) => {
  Phone.find({}).then((numbers) => {
    res.json(numbers);
  });
});

app.get("/info", (req, res) => {
  res.send(
    `Phonebook has total of ${persons.length} contacts, today is ${new Date()}`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  Phone.findById({ id })
    .then((person) => {
      res.json(person);
    })
    .catch((err) => {
      res.status(404).end();
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
