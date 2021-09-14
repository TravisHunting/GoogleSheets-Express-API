const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];


class ServiceSheetsClient {

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: "../servicecredentials.json",
      scopes: SCOPES[0]
    });

    this.authClientObject;
    this.googleSheetsInstance;
    this.spreadsheetId = '1UsEeg_oKSXDGMotAkEiD7BDOuNwpE928eBei5MNxGY8';
  }

  async init() {
    this.authClientObject = await this.auth.getClient();
    this.googleSheetsInstance = google.sheets({ version: "v4", auth: this.authClientObject });
    return;
  }

}

module.exports.ServiceSheetsClient = ServiceSheetsClient;