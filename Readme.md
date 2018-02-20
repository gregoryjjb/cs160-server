# Server

## Installation:

* Download [Node](https://nodejs.org/) (including NPM)
* Install SQLite
  * On Linux (Debian) just run
    > sudo apt-get install sqlite3
  * On Windows, download the [command-line tool binaries](https://www.sqlite.org/download.html) and add them to your PATH
* Clone the repo
* CD into the repo and run
  > npm install
* Once it's done installing run
  > npm start
* Your server will be running at [localhost:4000](http://localhost:4000), try navigating to it and to [/api](http://localhost:4000/api).

### Communication with the Frontend

No frontend is provided with this; you need to clone and run the [frontend repo](https://github.com/gregdumb/cs160-frontend) separately. The React development server will proxy asynchronous calls from :3000 to :4000, simulating the production environment. In the final product the production build of the frontend will reside under www/ and be served by this server.

Commit test