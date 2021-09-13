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
    // https://github.com/googleapis/google-api-nodejs-client#authentication-and-authorization
    // let attempt = await client.readToken()
    // if attempt is rejected, getNewToken - generate the authURL for the user
    // using a redirect_url, then res.send the authURL
    // handle the redirect with a different app.get() method and use that to generate a token
    // This will provide an object with the access_token and refresh_token.
    // Save these somewhere safe so they can be used at a later time.
    // const {tokens} = await oauth2Client.getToken(code)
    // oauth2Client.setCredentials(tokens);
    res.send(attempt);
});


app.listen(apiPort, () => console.log(`Server running on port ${apiPort} \n`));
