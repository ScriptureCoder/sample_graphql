const express = require('express');
const crypto = require('crypto');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require("graphql");


const app = express();

const db = {
  users: [
    { id: "1", email: 'alex@gmail.com', name: 'Alex Mike', avatarUrl: "http://example.com/image.ppg" },
    { id: "2", email: 'sam@gmail.com', name: 'Sam Mike', avatarUrl: "http://example.com/image.ppg" },
    { id: "3", email: 'emma@gmail.com', name: 'Emma Mike', avatarUrl: "http://example.com/image.ppg" }
  ],

  messages: [
    { id: '1', userId: '1', body: 'Hello', createdAt: Date.now() },
    { id: '2', userId: '2', body: 'Hi', createdAt: Date.now() },
    { id: '3', userId: '1', body: 'What\'s up?', createdAt: Date.now() }
  ]
};

// ! mean cannot be null
const schema = buildSchema(`
    type Query {
        users: [User!]!
        user(id: ID!):User
        messages: [Message!]!
    }
    
    type Mutation {
      addUser(email: String!, name: String): User
    }

    type User {
      id: ID!
      email: String!
      name: String
      avatarUrl: String
      messages: [Message!]!
    }

    type Message {
      id: ID!
      body: String!
      createdAt: String!
    }

`);

class User {
  constructor (user) {
    Object.assign(this, user)
  }

  get messages () {
    return db.messages.filter(message => message.userId === this.id)
  }
}

const rootValue = {
  users: () => db.users.map(user => new User(user)),
  addUser: ({email, name})=> {
    const user = {
      id: crypto.randomBytes(10).toString('hex'),
      email,
      name
    };

    db.users.push(user);

    return user
  },
  user: args => db.users.find(user=>user.id === args.id),
  messages: () => db.messages,

};

app.listen(3000, ()=>{
  console.log('listening on 3000')
});


app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true
}));

// const { graphql, buildSchema } = require("graphql");

// const db = {
//   users: [
//     { id: "1", email: 'alex@gmail.com', name: 'Alex Mike' },
//     { id: "2", email: 'sam@gmail.com', name: 'Sam Mike' },
//     { id: "3", email: 'emma@gmail.com', name: 'Emma Mike' }
//   ]
// };
//
// // ! mean cannot be null
// const schema = buildSchema(`
//     type Query {
//         users: [User!]!
//     }
//
//     type User {
//       id: ID!
//       email: String!
//       name: String
//       avatarUrl: String
//     }
//
// `);
//
// const rootValue = {
//   users: () => db.users
// };
//
// graphql(
//     schema,
//     `
//     {
//       users{
//         id
//         email
//       }
//     }
//   `,
//     rootValue
// ).then(res=> console.dir(res,{depth: null}))
//     .catch(console.error);
