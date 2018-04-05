const { OAuth2Client } = require('google-auth-library');
const audience = process.env.GOOGLE_CLIENT_ID;
var gapiClient = new OAuth2Client(audience, '', '');

if(audience) {
    console.log("Google Sign-in Initialized");
    console.log("\tClient ID:", audience);
}
else {
    console.error("ERROR: No Google Client ID set, sign-in is insecure. Set GOOGLE_CLIENT_ID");
}

var parser = (idToken, onSuccess, onFailure) => {
    gapiClient.verifyIdToken({idToken, audience})
    .then(login => {
        onSuccess(login.getPayload());
    })
    .catch(error => {
        if(onFailure) onFailure(error);
    });
}

module.exports = parser;