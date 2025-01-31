# Fastify API Server

## Installation

1. Clone the repo

```bash
git clone git@github.com:chulander/fastify-app.git
```

2. Install the dependencies

```bash
cd fastify-app
npm install
```

### Set up the environment variables

1. Create a **.env** file in the root of the project

```bash
touch .env
```

2. add the following environment variables to the **.env** file
   use the template in the **.env.example** file

```bash
ALLOWED_ORIGINS=http://localhost:5173
PORT=4000
DATABASE_URL=
ENCRYPTION_KEY=
TOKEN_SECRET=YOUR-TOKEN-SECRET
REFRESH_TOKEN_SECRET=YOUR-REFRESH-TOKEN-SECRET
```

3. For the encryption key, generate a random 32 character string

```bash
openssl rand -hex 32
```

4. set the encryption key in the **.env** file

```bash
ENCRYPTION_KEY=your_encryption_key
```

### For local Development

#### Setup the database

1. Download Docker Desktop from [Docker](https://www.docker.com/products/docker-desktop)
2. Start the database

```bash
docker run --name postgres-container \
  -e POSTGRES_USER=YourUserNameHere \
  -e POSTGRES_PASSWORD=YourPasswordHere \
  -e POSTGRES_DB=YourDatabaseNameHere \
  -p 5432:5432 \
  -d postgres
```

3. Update the **DATABASE_URL** in the **.env** file

```bash
DATABASE_URL=postgresql://YourUserNameHere:YourPasswordHere@localhost:5432/YourDatabaseNameHere
```

4. Run the database scripts

```bash
npm run db:push
npm run db:generate
```

5. Start the server

```bash
npm run dev
```
