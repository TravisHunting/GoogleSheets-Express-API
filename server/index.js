const express = require('express');
const cors = require('cors');

const { SheetsClient } = require('./SheetsClient.js');

const apiPort = 5000;
const app = express();
let client = new SheetsClient();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
    let attempt = await client.listSheet();
    res.send(attempt);
});


app.listen(apiPort, () => console.log(`Server running on port ${apiPort} \n`));
