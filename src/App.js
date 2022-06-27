import React, { useState } from 'react';
import client from './client'
import {ApolloProvider} from 'react-apollo';

import { Query } from 'react-apollo'
import { SEARTCH_REPOSITORIES } from './graphql'

const VARIABLES = {
  first: 5,
  after: null,
  last: null,
  before: null,
  query: 'フロントエンドエンジニア'
}

function App() {
  const [variables, setVariables] = useState(VARIABLES)

  const { query, first, last, before, after } = variables

  return (
    <ApolloProvider client={client}>
      <div>
        Hello, GraphQL
      </div>
      <Query query={SEARTCH_REPOSITORIES} variables={{ query, first, last, before, after }}>
        {
          ({loading, error, data}) => {
            if (loading) return 'Loading...'
            if (error) return `Error! ${error.message}`
            console.log({data})
            return <div>{}</div>
          }
        }
      </Query>
    </ApolloProvider>
  );
}

export default App;
