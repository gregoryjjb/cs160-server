FROM node:9

# Optional: uncomment for SQLite3
#RUN apt-get update && \
#    DEBIAN_FRONTEND=noninteractive apt-get -yq install sqlite3 && \
#    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

EXPOSE 4000

# Bundle app source
COPY . .
RUN chmod +x *-entrypoint.sh
ENTRYPOINT "./docker-entrypoint.sh"
