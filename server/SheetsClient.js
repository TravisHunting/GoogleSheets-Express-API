const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first time.
const TOKEN_PATH = 'token.json';


class SheetsClient {
  /* On instantiation a SheetClient object will attempt to read credentials from local files.
  Until this process is finished (less than 1-2 seconds usually) you cannot succesfully
  call any methods that require an authorized client. You can also choose to pass an 
  authorized client into the constructor */
  constructor(props = {}) {
    this.oAuth2Client = props.oAuth2Client || false;

    if (!props.oAuth2Client) {
      this.init();
    }
  }

  init() {
    let self = this;
    fs.readFile('../credentials.json', (err, content) => {
      if (err) {
        return console.log('Error loading client secret file:', err) 
      };

      let authDetails = JSON.parse(content);
      const {client_secret, client_id, redirect_uris} = authDetails.web;
      self.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
          console.log("Error loading token: ", err);
          return self.getNewToken(self.oAuth2Client);
        }
        self.oAuth2Client.setCredentials(JSON.parse(token));
        console.log("SheetsClient initialized");
      })

    });
  }

  getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
      });
    });
  }

  // listSheet returns a promise, so you can use "await" when calling it
  listSheet() {
    let auth = this.oAuth2Client;
    const sheets = google.sheets({version: 'v4', auth});
    
    const sheetsPromise = new Promise(function(resolve,reject) {
      // insert any asynchronous function into a promise 
      // replace the returns with 'resolve' or 'reject'
      // now you can 'await' the result
      sheets.spreadsheets.values.get({
        spreadsheetId: '1WjM31LPBdqNS7cpcp4kjkqbGdg1lFlgm2GfMYolqChs',
        range: 'Sheet1!A1:C',
      }, (err, res) => {
        if (err) {
          console.log('The API returned an error: ' + err);
          reject("The API returned an error. Please try again.");
        }
        const rows = res.data.values;
        if (rows.length) {
          console.log('Printing all data');
          // Print columns A and E, which correspond to indices 0 and 4.
          // rows.map((row) => {
          //   console.log(`${row[0]}, ${row[4]}`);
          // });
          console.log(rows);
          resolve(rows);
        } else {
          console.log('No data found.');
          resolve("No data found.");
        }
      });
    })

    return sheetsPromise;
  }

}

module.exports.SheetsClient = SheetsClient;