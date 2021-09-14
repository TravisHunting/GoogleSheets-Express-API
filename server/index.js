const express = require('express');
const cors = require('cors');

const { SheetsClient } = require('./SheetsClient.js');

const apiPort = 5000;
const app = express();
let client = new SheetsClient();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

async function checkToken(res) {
    // add a call to checkToken before making a request that requires a token
    if (client.hasToken) { return true }
    let attempt = await client.readToken();
    if (!attempt) {
        let authUrl = client.getNewTokenLink();
        res.redirect(authUrl);
        return false;
    }
    return true;
}

app.get('/a', async (req, res) => {
    if (! await checkToken(res)) {
        return
    }

    let attempt = await client.listSheet();
    if (!attempt) {
        res.send("Error");
        return;
    }

    res.send(attempt); // sends rows (array), which is listed as text on screen
});

app.get('/displaysheet', async (req, res) => {
    // pass in a spreadsheet ID like this:
    // http://localhost:5000/displaysheet?id=1WjM31LPBdqNS7cpcp4kjkqbGdg1lFlgm2GfMYolqChs 

    if (! await checkToken(res)) {
        return
    }

    let params = {spreadsheetId: req.query.id};
    let attempt = await client.listSheetByID(params.spreadsheetId);
    if (!attempt) {
        res.send("Error");
        return;
    }

    res.send(attempt); // sends rows (array), which is listed as text on screen
});

app.get('/login', async (req, res) => {
    if (! await checkToken(res)) {
        return
    }
    
    res.send("Logged in!!!")
});

app.get('/readtokencode', async (req, res) => {
    // By examining credentials.json you can see that this is listed as the redirect_uri
    // This needs to be marked as allowed on https://console.cloud.google.com/apis/credentials
    // The Google OAuth process redirects to this URL with a code parameter
    // This code parameter is then read and used to generate a token for the user
    let code = {code: req.query.code};
    console.log(code);
    let tokenSave = await client.getNewTokenFromCode(code);
    if (tokenSave) {
        let tokenAttempt = await client.readToken();
        if (tokenAttempt) {
            res.redirect('/login');
            return;
        }
    }
        
    res.send("Token Save failed");
})


app.listen(apiPort, () => console.log(`Server running on port ${apiPort} \n`));
