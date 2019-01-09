##### Sign up with Prisma.io

> make sure you are in your backend directory

```
npm i -g prisma
prisma login #will fire browser!
prisma init
> use demo server
> demo-us1 server #[choose with low letancy]
> your serber name 'delme' or anything you like
> state could be 'dev'
> generated Prisma client #Dont generate
```

> it will generate two file 

```
datamodal.graphql
prisma.yml
```

Put these file information into .env file because these are sensitive data, put the prisma endpoint to PRISMA_ENDPOINT

```
FRONTEND_URL="http://localhost:7777"
PRISMA_ENDPOINT="yougottafillthisout"
PRISMA_SECRET="omgplzdonttellanyone"
APP_SECRET="jwtsecret123"
STRIPE_SECRET="sk_123youchanget his"
PORT=4444

```
> replace prisma.yml with these data

```
endpoint: ${env:PRISMA_ENDPOINT}
datamodel: datamodel.prisma
secret: ${env:PRISMA_SECRET}
```

```
## this request for deployement to the prisma server to fetch schema back

hooks:
    post-deploy:
    - graphql get-schema  -p  prisma
```

> now run

```
prisma deploy #will through an Error related to ENV variable

prisma deploy --help
prisma deploy -env-file variables.env
```

##### Output 

```
Creating stage dev for service GuptaJi √
Deploying service `GuptaJi` to stage `dev` to server `prisma-us1` 1.5s

Changes:

User (Type)
+ Created type `User`
+ Created field `id` of type `ID!`
+ Created field `name` of type `String!`
+ Created field `updatedAt` of type `DateTime!`
+ Created field `createdAt` of type `DateTime!`

Applying changes 2.6s

Your Prisma GraphQL database endpoint is live:

HTTP:  https://us1.prisma.sh/*****
WS:    wss://us1.prisma.sh/*****


post-deploy:
Running graphql get-schema  -p  prisma...

```

> **npm run deploy**


> now go back to prisma website and inside Services

```
src\generated\prisma.graphql
```

##### changed file

```
type User {
    id: ID! @unique
    name: String!
    email: String!
}

```

> output

```
Deploying service `GuptaJi` to stage `dev` to server `prisma-us1` 1.5s

Changes:

User (Type)
+ Created field `email` of type `String!`

Applying changes 1.8s

Your Prisma GraphQL database endpoint is live:

HTTP:  https://us1.prisma.sh/*****
WS:    wss://us1.prisma.sh/*****


post-deploy:
project prisma - Schema file was updated: src\generated\prisma.graphql

Running graphql get-schema -p prisma √
```

> go to playground with the like given it the output of deploy

```

query {
    users {
        id
        name
    }
}

## run this mutation

```

```
## create mutation by going to new tab

mutation {
    createUser(data: {
        name: "Gaurav Gupta"
        email: "noobcoder@goons.com"
    }) {
        name
        email
    }
}

```

> now check out your data browser in web prisma website

























