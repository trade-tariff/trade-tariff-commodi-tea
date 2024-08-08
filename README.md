# trade-tariff-commodi-tea

Express app enabling gamification of description classification
(converting a description to a commodity code) as part of continuous search improvemments.

## Prerequisites

- Node.js (v14 or higher)
- Yarn
- Sequelize CLI
- Docker
- Docker Compose

### Setup

#### Install Dependencies

- `yarn install`

#### Create Models and Migrations

- Review `npx sequelize --help` for more commands (like creating the database).

- Create a Model.
*The model has been created for testing purpose, you can delete it and recreate yours*

```bash
npx sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string
```

- Create a Migration.

```bash
npx sequelize migration:generate --name create-user
```

- Run migrations.
*Migrations are automatically run when you use Docker Compose.
To manually run migrations:*

```bash
npx sequelize db:migrate
```

- Create a Seeder.
*Seeder has been created for testing purpose,
you can delete it and recreate your own*

```bash
npx sequelize seed:generate --name demo-user
```

- Update the Seeder File
*Edit the generated seed file in `seeders/`
directory to include the data you want to seed.*

- Run the seeder.
*Seed data is automatically applied when you use Docker Compose.
To manually run the seeder:*

```bash
npx sequelize db:seed:all
```

#### Docker commands

- Build and Run Containers

```bash
docker compose up --build -d
```

- Stop and Remove Containers

```bash
docker compose down
```

### Access the Database using psql

- Access the PostgreSQL Container

```bash
docker exec -it <db-container-name> psql -U <postgres-user> -d <postgres-db>
```

## Useful psql Commands

- List Tables

```bash
\dt
```

- View Table Content

```bash
SELECT * FROM <table-name>;
```

- View Table Structure

```bash
\d+ <table-name>
```

- Exit psql

```bash
\q
```

### Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/getting-started/)
- [Sequelize CLI Documentation](https://github.com/sequelize/cli)
