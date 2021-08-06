const mongoose = require("mongoose");

const password = process.argv[2];
const url = `mongodb+srv://fullstackboi:${password}@cluster0.rmglt.mongodb.net/notes-node?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phone = mongoose.model("Phone", phoneSchema);

if (process.argv.length < 4) {
  Phone.find({}).then((res) => {
    console.log(`phonebook:`);
    res.forEach((element) => {
      console.log(element.name, element.number);
    });
    mongoose.connection.close();
  });
} else {
  const phone = new Phone({
    name: process.argv[3],
    number: process.argv[4],
  });
  phone.save().then((res) => {
    console.log(`added ${phone.name} number ${phone.number} to phonebook`);
    mongoose.connection.close();
  });
}
