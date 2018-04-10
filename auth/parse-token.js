const { OAuth2Client } = require('google-auth-library');
const audience = process.env.GOOGLE_CLIENT_ID;
var gapiClient = new OAuth2Client(audience, '', '');

// Give alert if audience is not set, as Google sign-in
// will fail
if(audience) {
    console.log("Google Sign-in Initialized");
    console.log("\tClient ID:", audience);
}
else {
    console.error("ERROR: No Google Client ID set, sign-in WILL FAIL. Set env variable GOOGLE_CLIENT_ID");
}

var parser = (idToken, onSuccess, onFailure) => {
    if(audience) {
        gapiClient.verifyIdToken({idToken, audience})
        .then(login => {
            onSuccess(login.getPayload());
        })
        .catch(error => {
            if(onFailure) onFailure(error);
        });
    }
    else {
        onFailure({message: "No audience specified"});
    }
}

module.exports = parser;