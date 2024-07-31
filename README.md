# trade-tariff-commodi-tea

Express app enabling gamification of description classification
(converting a description to a commodity code) as part of continuous search improvemments.

# commodi-tea App - Database Setup Guide

This guide provides instructions on how to set up and use Sequelize with PostgreSQL for the commodi-tea app. It also includes details on how to install and use Postgres.app for managing your PostgreSQL databases on macOS.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Postgres.app (for macOS users)
- Sequelize CLI

## Step 1: Install Postgres.app (macOS Only)

Postgres.app is a full-featured PostgreSQL installation packaged as a standard Mac app.

1. **Download and Install Postgres.app:**
   - Go to [Postgres.app](https://postgresapp.com/) and download the latest version.
   - Drag the app to your Applications folder and open it.
   - Follow the on-screen instructions to initialize the database.

## Step 2: Install Sequelize and Sequelize CLI

In your project directory, install Sequelize and the Sequelize CLI:

```bash
yarn add sequelize sequelize-cli
```

# Step 3: Configure Environment Variables

Create a .env file in the root directory and add your database credentials.

DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_HOST=localhost

# Step 4: Create a model file

```bash
npx sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string
```

# Step 5: Create a migration

```bash
npx sequelize migration:generate --name create-user
```

# Step 6: Run migrations

```bash
npx sequelize db:migrate
```

# Step 7: Create a seeder

```bash
npx sequelize seed:generate --name demo-user
```

# Step 8: Update the Seeder File

Edit the generated seed file in seeders/ directory to include the data you want to seed.

# Step 9: Run the seeder

```bash
npx sequelize db:seed:all
```

# Step 9: Testing the Connection

A testConnection.ts file is provided in the root directory to test the database connection. Run the test script:

```bash
yarn test-connection
```

# Resources

[Sequelize Documentation](https://sequelize.org/docs/v6/getting-started/)
[Sequelize CLI Documentation](https://github.com/sequelize/cli)
