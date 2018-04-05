# Server

## Installation:

* Download & install [Node.js](https://nodejs.org/) (including NPM)
* Install SQLite
  * On Linux (Debian) just run `sudo apt-get install sqlite3`
  * On Windows, download the [command-line tool binaries](https://www.sqlite.org/download.html) and add them to your PATH
* Clone the repo
* Create a file `.env.local` in the root of the repo and insert the following line:
  ```
  GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
  ```
  with your client ID. (Google Sign-in will fail if this is not set up properly.)
* While in the repo, run `npm install`
* Once it's done installing run `npm start`
* Your server will be running at [localhost:4000](http://localhost:4000), try navigating to it and to [/api](http://localhost:4000/api).

### Communication with the Frontend

No frontend is provided with this; you need to clone and run the [frontend repo](https://github.com/gregdumb/cs160-frontend) separately. The React development server will proxy asynchronous calls from :3000 to :4000, simulating the production environment. In the final product the production build of the frontend will reside under www/ and be served by this server.

## API Reference

* Authentication
  * **POST api/login** - Logs in user, creating new if needed
    ```
    authorization: none
    
    body: {
      token: <Google token> // For new login
      OR
      sessionId: <Session ID> // For continuing existing session
    }
    
    returns: {
      firstLogin: <boolean>,
      user: {
        firstname: <string>,
        lastname: <string>,
        email: <email>,
        sessionId: <string>
      }
    }
    ```
    Returns status 400 if Google token or session ID is invalid.
    
  * **GET api/logout** - Clears user's session on server
    ```
    authorization: <sessionId> // Send session ID as auth header
    returns: none
    ```
    Returns status 200 under all circumstances.