import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import { NODE_ENV, APP_PORT, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, JWT_KEY } from './config'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import schemaDirectives from './directives'

(
  async ()=>{
    try {

      await mongoose.connect(
        `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
        { useNewUrlParser: true }
      )

      const app = express()

      const IN_PROD =  NODE_ENV !== 'production'

      app.disable('x-powered-by')

      const server = new ApolloServer({
        typeDefs,
        resolvers,
        playground: IN_PROD,
        schemaDirectives,
        context: ({ req, res }) => ({ req, res })

      });

      server.applyMiddleware({ app })

      app.listen({ port: APP_PORT }, () =>
        console.log(`🚀 Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`)
      )

    }catch (e) {
      console.error(e);
    }
  }
)();
