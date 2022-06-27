import React, { useState, useCallback } from 'react';
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

  const handleChange = useCallback((e) => {
    console.log(e.target.value)
    setVariables({
      ...variables,
      query: e.target.value
    })
  })

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <ApolloProvider client={client}>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input value={variables.query} onChange={(e) => handleChange(e)} />
      </form>
      <Query query={SEARTCH_REPOSITORIES} variables={{...variables}}>
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
