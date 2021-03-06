const mongoose = require('mongoose');
const db = process.env.MONGO_URI;
const connection = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDb connected !');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connection;
