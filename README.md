# Express server with Google Sheets connection

Resources: <br>
https://developers.google.com/sheets/api/quickstart/nodejs <br>
https://developers.google.com/workspace/guides/create-project <br>


# Notes

Entry point: index.js <br>
App runs on port 5000 <br>
Google Credentials are contained in "credentials.json" <br>
After instantiating a new SheetsClient object you must wait for it to intialize (read files asynchronously) before you can use it to communicate with Google Sheets.
