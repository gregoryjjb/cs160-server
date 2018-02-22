const { OAuth2Client } = require('google-auth-library');
const audiance = "15965114724-3b71qboka3ij341kddr78df42et1nt7q.apps.googleusercontent.com";
var gapiClient = new OAuth2Client(audiance, '', '');

var authenticate = (idToken, onSuccess, onFailure) => {
    const audiance2 = "15965114724-3b71qboka3ij341kddr78df42et1nt7q.apps.googleusercontent.com";
    gapiClient.verifyIdToken({idToken, audiance2})
    .then(login => {
        //console.log(login.getPayload());
        onSuccess(login.getPayload());
    })
    .catch(error => {
        console.log("Error occured");
        //console.log(error);
        if(onFailure) onFailure(error);
    });
}

module.exports = authenticate;