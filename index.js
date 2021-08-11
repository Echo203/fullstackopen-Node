require("dotenv").config();
const { Router, request, response } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Phone = require("./models/mongo");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json("Missing content");
  }

  const newPerson = new Phone({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => next(err));
});

//Fetch all entries
app.get("/api/persons", (req, res) => {
  Phone.find({}).then((numbers) => {
    res.json(numbers);
  });
});

app.get("/info", (req, res) => {
  Phone.find({}).then((numbers) => {
    res.send(
      `Phonebook has total of ${
        numbers.length
      } contacts, today is ${new Date()}`
    );
  });
});

//Fetch specific entry
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  Phone.findById(id)
    .then((person) => {
      res.json(person);
    })
    .catch((err) => {
      res.status(404).end();
    });
});

//Updating existing number
app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  const updatedNumber = {
    name: body.name,
    number: body.number,
  };

  Phone.findByIdAndUpdate(id, updatedNumber, { new: true })
    .then((updatedNumber) => {
      res.json(updatedNumber);
    })
    .catch((err) => next(err));
});

//Deleting number
app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Phone.findByIdAndDelete(id)
    .then((deleteNote) => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

//Error handling
const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  if (err.name === "ValidationError") {
    res.status(409).json({ err: "Unique name required" });
  }
  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
