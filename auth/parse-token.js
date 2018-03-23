const { OAuth2Client } = require('google-auth-library');
const audience = "15965114724-3b71qboka3ij341kddr78df42et1nt7q.apps.googleusercontent.com";
var gapiClient = new OAuth2Client(audience, '', '');

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