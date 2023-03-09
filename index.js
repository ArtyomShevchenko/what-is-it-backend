const express = require('express');
const router = require('./router.js');
const { connectToDb } = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(router);

connectToDb((err) => {
    if (!err) {
        app.listen(PORT, () => console.log('Server runing on PORT:' + PORT))
    }
    else {
        console.log('Error: No connection to MongoDb')
    }
});