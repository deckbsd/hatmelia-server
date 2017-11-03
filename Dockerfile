FROM node:carbon

WORKDIR /hatmelia/server

# Install app dependencies
COPY package.json package-lock.json ./

RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
