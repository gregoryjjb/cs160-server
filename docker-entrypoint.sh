#!/bin/bash

echo $GOOGLE_CLIENT_ID >> .env.local
node index.js
