const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {

  MongoClient.connect('mongodb+srv://pritam123:pritam123@cluster0.n6kdjls.mongodb.net/mongoExample?retryWrites=true&w=majority')
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
    }).catch(err => {
      console.log(err);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
};


exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
