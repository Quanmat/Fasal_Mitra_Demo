FROM node:18

# Set the working directory
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

# Build the Next.js app
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]