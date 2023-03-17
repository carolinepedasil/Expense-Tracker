const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config({ path: './config.env' });
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const connection = require('./db/connection');

app.use(require('./routes/route'));

connection.then(database => {
    if(!database) return process.exit(1);

    app.listen(port, () => {
        console.log(`Server is running on port: http://localhost:${port}`);
    });

    app.on('error', error => console.log(`Failed to connect with HTTP Server: ${error}`));
}).catch(error => {
    console.log(`Connection failed... ${error}`);
});
