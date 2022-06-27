import React from 'react';
import client from './client'
import {ApolloProvider} from 'react-apollo';
import qpl from 'graphql-tag'
import { Query } from 'react-apollo'

const ME = qpl`
  query me {
    user(login: "zare926") {
      name
      avaterUrl
    }
  }
`

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        Hello, GraphQL
      </div>
      <Query query={ME}>
        {
          ({loading, error, data}) => {
            if (loading) return 'Loading...'
            if (error) return `Error! ${error.message}`

            return <div>{data.user.name}</div>
          }
        }
      </Query>
    </ApolloProvider>
  );
}

export default App;
