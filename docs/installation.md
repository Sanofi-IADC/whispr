# Installation

## Setup with Docker

Requirements:

- Have Docker installed

### Configuration

Whispr is configured thanks to environment variables in `docker-compose.yml`.
You can leave the default values for development.

### Initialize the containers

#### Quickstart

```bash
$ docker-compose up
```

This spins up whispr, a mongoDB, redis and a localstack environment with an s3 instance.

Nothing to configure, easy to use

#### Quickstart for developers

Start mongoDB, redis and localstack environment dockers with an s3 instance and ports exposed to your development machine
```bash
$ docker-compose -f docker-compose.dev.yml up
```

Install node packages then run the project in watch mode
```bash
$ npm install
$ npm run start:dev
```

#### Using MongoDB Replicatsets

If you want to use mongoDB replicasets use `docker-compose.rep.yml` or `docker-compose.dev.rep.yml`

Both include two mongoDB instances which need to be connected on the first startup.

On the first start up you need to open a bash and type in the following

```bash
$ docker-compose -f docker-compose.rep.yml up (or docker-compose -f docker-compose.dev.rep.yml up)
$ docker exec -it localmongo1 mongo
```

Once in the mongoshell, run the following command to initiate the cluster.

```javascript
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
  ],
});

exit;
```

::: warning Localstack
`docker-compose.rep.yml` and `docker-compose.dev.rep.yml` don't include a localstack instance. But these can easily be added
:::

### Running the app

```bash
$ docker-compose up
```

## Installation without Docker

### Install the whispr node application

```bash
$ npm install
```

### Install Redis:

```bash
apt update && apt upgrade
apt install redis-server
```

::: warning Troubleshooting : Windows
On Windows you have to install WSL Ubuntu before running the install commands
:::

Then start the server

```bash
redis-server
```

### Initialize MongoDB as a cluster:

Install current version of MongoDB from: https://www.mongodb.com/download-center/.

```bash
# In an elevated cmd:
cd C:\Program Files\MongoDB\Server\4.2\bin
mkdir .\srv\mongodb\rs0-0;
mkdir .\srv\mongodb\rs0-1;
mongod --replSet rs0 --port 27017 --bind_ip localhost --dbpath ./srv/mongodb/rs0-0
mongod --replSet rs0 --port 27018 --bind_ip localhost --dbpath ./srv/mongodb/rs0-1

# Connect to the first replicaset:
mongo --port 27017
```

In the mongo shell Create the following config:

```javascript
rsconf = {
  _id: "rs0",
  members: [
    {
      _id: 0,
      host: "localhost:27017",
    },
    {
      _id: 1,
      host: "localhost:27018",
    },
  ],
};

rs.initiate(rsconf);
```

For all later startups of the database:

```bash
# In an elevated cmd or create a .bat File:
start cmd.exe /k "cd C:\Program Files\MongoDB\Server\4.2\bin & mongod --replSet rs0 --port 27017 --bind_ip localhost --dbpath ./srv/mongodb/rs0-0"

start cmd.exe /k "cd C:\Program Files\MongoDB\Server\4.2\bin & mongod --replSet rs0 --port 27018 --bind_ip localhost --dbpath ./srv/mongodb/rs0-1"

start cmd.exe /k "wsl redis-server"
```

### Create a file named 'local.env' in the project root folder:

To configure the application, you need to provide a `local.env` file.

You can create your `local.env` file from the `example.env` file. Most of the configuration is already done, however you will need to change the following lines.

```
MONGOOSE_HOST = localhost
MONGOOSE_HOST_READ = localhost
MONGOOSE_PORT = 27017
MONGOOSE_PORT_READ = 27018

REDIS_HOST = localhost
REDIS_HOST_READ = localhost
WHISPR_AUTH_CONFIG_SECRET = (change to your auth server - see [Security](./security.md))
```

### Setup a local AWS instance with localstack (optional)

If you want to work with a local file storage instead of AWS use this:

- Install Docker: https://www.docker.com/products/docker-desktop
- Install Python: https://www.python.org/downloads/
- Install Localstack: https://github.com/localstack/localstack
- Install AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html

```bash
# run the following parts in different shells
localstack start
# wait until the first command is finished
aws --endpoint-url=http://localhost:4572 s3 mb s3://demo-bucket
aws --endpoint-url=http://localhost:4572 s3api put-bucket-acl --bucket demo-bucket --acl public-read
```

Add to your `local.env`

```bash
AWS_S3_ENDPOINT = http://localhost:4572/
AWS_BUCKET_NAME = demo-bucket
```

Switch to Node 12 (required for some file upload dependencies)

```bash
# Setting Node version
nvm install 12.13.0

# Check the node version is correctly set, must be 12.13.0
node -v
```

Export/set dummy environment variables for local stack (required to run tests)
```
# Mac/Linux
export AWS_ACCESS_KEY_ID=dummy
export AWS_SECRET_ACCESS_KEY=dummy

# or Windows
set AWS_ACCESS_KEY_ID=dummy
set AWS_SECRET_ACCESS_KEY=dummy
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
