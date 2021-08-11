const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const password = process.env.PORT;
const url = process.env.MONGODB_URI

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(res => {
  console.log('Connection established to DB')
}).catch(err => {
  console.log('Error occured' + err)
})

const phoneSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minLength: 8
  },
});

phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

phoneSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' })

module.exports = mongoose.model("Phone", phoneSchema);
