# Express server with Google Sheets connection

Resources: <br>
https://developers.google.com/sheets/api/quickstart/nodejs <br>
https://developers.google.com/workspace/guides/create-project <br>
https://cloud.google.com/docs/authentication <br>
https://developers.google.com/people/v1/how-tos/authorizing <br>
https://github.com/googleapis/google-api-nodejs-client#authentication-and-authorization <br>


# Credentials

To use this skeleton to create your own app, you will need to generate application credentials. Use the following link for reference:
https://developers.google.com/workspace/guides/create-credentials

These credentials identify your application. For your application to access any private data, it will also need an OAuth token. Running the application without a token will prompt you to generate one, taking you to a web page where you can choose a Google account from which to allow access.

Use the redirect_uri parameter to redirect the generated token data back to your server, where you can process it into a token.

The other type of authorization you can use is '2 legged'/'service account', where the credentials are built into the application, and you allow the service account permanent access to the resource. 

# Notes

Entry point: index.js <br>
App runs on port 5000 <br>
Google Credentials are contained in "credentials.json" <br>
After instantiating a new SheetsClient object you must wait for it to intialize (read files asynchronously) before you can use it to communicate with Google Sheets.

