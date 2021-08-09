const mongoose = require("mongoose");

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
  name: String,
  number: String,
});

phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Phone", phoneSchema);
