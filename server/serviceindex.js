const express = require('express');
const cors = require('cors');

const { ServiceSheetsClient } = require('./ServiceSheetsClient.js');

const apiPort = 5000;
const app = express();
let client = new ServiceSheetsClient();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

client.init(); // This function takes time

app.get('/write', async (req, res) => {
    // TODO: Change this to a post request ->
    // Read range and values from post (req), then write them
    let auth = client.authClientObject;
    let spreadsheetId = client.spreadsheetId;

     //write data into the google sheets
     await client.googleSheetsInstance.spreadsheets.values.append({
        auth, //auth object
        spreadsheetId, //spreadsheet id
        range: "Sheet1!A:B", //sheet name and range of cells
        valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
        resource: {
            values: [["Git followers tutorial", "Mia Roberts"]],
        },
    });

    res.send("Written!");

});

app.get('/read', async (req, res) => {
    let auth = client.authClientObject;
    let spreadsheetId = client.spreadsheetId;
    let range = "Sheet1!A:A"; // TODO get range from req.query.range (or similar)

    const readData = await client.googleSheetsInstance.spreadsheets.values.get({
        auth, //auth object
        spreadsheetId, // spreadsheet id
        range: range, //range of cells to read from.
    })

    res.send(readData.data);
    //res.send(readData.data.values); //the actual cell values
});


app.listen(apiPort, () => console.log(`Server running on port ${apiPort} \n`));
