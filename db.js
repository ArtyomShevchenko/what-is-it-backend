const { MongoClient } = require('mongodb')

// local 
// # 1
// const URL = 'mongodb://localhost:27017'

// # 2
const URL = 'mongodb://localhost:27017/what-is-it'

// MongoDB Cloud (Atlas)
// const URL = 'mongodb+srv://Artyom:532499Artyom@cluster0.wyriyhn.mongodb.net/what-is-it'

let dbConnection;

module.exports = {
    // connectToDb: (cd) => {
    connectToDb: (cd, sellector) => {
        MongoClient
            .connect(URL)
            .then((client) => {
                console.log('Connection to MongoDB successful.')

                // # 1
                // dbConnection = client.db('what-is-it')
                
                // # 2
                dbConnection = client.db()
                
                return cd()
            })
            .catch((err) => cd(err))
    },
    getDb: () => dbConnection,
}