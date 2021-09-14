# Express server with Google Sheets connections via OAuth

Resources: <br>
https://developers.google.com/sheets/api/quickstart/nodejs <br>
https://developers.google.com/workspace/guides/create-project <br>
https://cloud.google.com/docs/authentication <br>
https://developers.google.com/people/v1/how-tos/authorizing <br>
https://github.com/googleapis/google-api-nodejs-client#authentication-and-authorization <br>
https://www.section.io/engineering-education/google-sheets-api-in-nodejs/ <br>


# OAuth Credentials

To use this skeleton to create your own app, you will need to generate application credentials. Use the following link for reference:
https://developers.google.com/workspace/guides/create-credentials

These credentials identify your application. A SheetsClient object will read this file synchronously upon instantiation. You can also use the SheetsClient.readCredentials function if you wish to read the credentials asynchronously.

For your application to access any private data, it will also need an OAuth token. Access /login to prompt generation of a token. Any attempt to make a request that requires an active token should perform a check to see if this token is available. Use the checkToken(res) function in index.js to perform this check. It will automatically redirect to the Google authorization page if necessary.

Use the redirect_uri parameter to redirect the generated token data back to your server, where you can process it into a token.

# Service Account Credentials

Credentials are built into the application; you allow the service account permanent access to the resource. You must 'share' your Google Sheet with the email that Google generated for your service account.

Upon running serviceindex.js we run client.init() which is asynchronous and sets up the connection to Google. This means you won't be able to succesfully make requests using the client until a second or two after starting the application.

# Notes

Entry point for OAuth: index.js <br>
Entry point for Service Account: serviceindex.js <br>
App runs on port 5000 <br>
Google Application Credentials (OAuth) are contained in "credentials.json" <br>
Google Application Credentials (Service Account) are contained in "servicecredentials.json" <br>


