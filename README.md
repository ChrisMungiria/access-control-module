# Access Control Module

## This is a technical assessment for Bingwa Technologies

## The frontend is written in VueJS and the backend is written in NestJS

1. Clone the repository
2. Open the project in your IDE of choice
3. `cd backend` and run `npm install` to install the dependencies
4. `cd frontend` and run `npm install` to install the dependencies
5. Inside the frontend directory, run `npm run dev` to start the development server, this will run on port 8080 as configured in the `vite.config.js` file

- If you would like to change the port, you can modify the `vite.config.js` file. Remember to update the cors policy in the `main.ts` file of the backend to allow requests from the frontend.

6. Inside the backend directory, run `npm run start:dev` to start the development server which will run on port 3000.

## Backend Prisma migrations

1. The ORM of choice is Prisma ORM for simplicity.
2. Run `npx prisma migrate dev --name init` to create the initial migration.
3. Run `npx prisma generate` to generate the Prisma client.
4. Run `npx prisma db push` to sync the database with the migrations.
5. Run `npm run seed` to seed the database with sample data.
6. To see the database schema, run `npx prisma studio` and connect to the database.

- If you would like to reset the database, run `npx prisma reset` and then run `npm run seed` again.
