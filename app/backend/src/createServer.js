const { GraphQLServer } = require('graphql-yoga');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');

const db = require('./db');


// create the GraphQL Yoga Server


function createServer() {
    return new GraphQLServer({
        typeDefs: 'src/schema.graphql',
        resolvers: {
            Mutation, // this should not empty
            Query // this should not empty
        },
        resolverValidationOptions: {
            requireResolversForResolveType: false
        },
        context: req => ({ ...req, db }) // this surface the db on every request
    });
}

module.exports = createServer;