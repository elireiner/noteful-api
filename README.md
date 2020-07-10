# Noteful-api

## Database handling

Create database `createdb -U dunder_mifflin noteful`

Create 'folders' and 'notes' tables `npm run migrate -- 1`

Seed the folders table `psql -U dunder_mifflin -d noteful -f ./seeds/seed.noteful_folders.sql`

Seed the notes table `psql -U dunder_mifflin -d noteful -f ./seeds/seed.noteful_notes.sql`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.