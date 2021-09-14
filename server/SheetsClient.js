const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first time.
const TOKEN_PATH = 'token.json';


class SheetsClient {
  // Performs Synch file read
  constructor() {
    this.hasToken = false;

    try {

    let credentialRaw = fs.readFileSync('../credentials.json');
    let authDetails = JSON.parse(credentialRaw);
    const {client_secret, client_id, redirect_uris} = authDetails.web;

    this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('File not found!');
      } else {
        throw err;
      }
    }
  }

  // Promise
  readToken() {
    let self = this;
    const readTokenPromise = new Promise(function(resolve,reject) {
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
          //console.log("Error loading token: ", err);
          console.log("Error loading token");
          //resolve(self.getNewTokenLink(self.oAuth2Client));
          resolve(false);
          return;
        }

        self.oAuth2Client.setCredentials(JSON.parse(token));
        self.hasToken = true;
        resolve(true);
      });
    });

    return readTokenPromise;
  }

  // Synch
  getNewTokenLink() {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log(authUrl);
    return authUrl;
  }

  // Promise - Unused
  readCredentials() {
    // No longer used because we are reading the credentials synchronously on instantiation
    // If desired this can be used like so: 
    // let clientInit = await client.readCredentials();
    // if (!clientInit) {
    //     res.send("Inappropriate or non-existent application credentials");
    // }
    let self = this;
    const credentialsPromise = new Promise(function(resolve,reject) {
      fs.readFile('../credentials.json', (err, content) => {
        if (err) {
          console.log('Error loading client secret file:', err);
          resolve(false); 
        };
  
        let authDetails = JSON.parse(content);
        const {client_secret, client_id, redirect_uris} = authDetails.web;
        self.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        resolve(true);
      });
    });

    return credentialsPromise
  }

  // Promise
  getNewTokenFromCode(code) {
    let self = this;

    let tokenSavePromise = new Promise(function(resolve,reject) {

      self.oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          console.error('Error while trying to retrieve access token', err);
          resolve(false);
        }

        self.oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) {
            console.error(err);
            resolve(false);
          }

          console.log('Token stored to', TOKEN_PATH);
          resolve(true);
        });
      });

    })

    return tokenSavePromise;
  }

  // Promise
  listSheet() {
    // Practice function that displays one specific sheet from a google sheet
    let auth = this.oAuth2Client;
    const sheets = google.sheets({version: 'v4', auth});
    
    const sheetsPromise = new Promise(function(resolve,reject) {
      sheets.spreadsheets.values.get({
        spreadsheetId: '1WjM31LPBdqNS7cpcp4kjkqbGdg1lFlgm2GfMYolqChs',
        range: 'Sheet1!A1:C',
      }, (err, res) => {
        if (err) {
          console.log('The API returned an error: ' + err);
          resolve(false);
          return;
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

  // Promise
  listSheetByID(spreadsheetId) {
    // TODO: add params that let you hone in on the sheet and range you want
    let auth = this.oAuth2Client;
    const sheets = google.sheets({version: 'v4', auth});
    
    const sheetsPromise = new Promise(function(resolve,reject) {
      sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Sheet1!A1:C',
      }, (err, res) => {
        if (err) {
          console.log('The API returned an error: ' + err);
          resolve(false);
          return;
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