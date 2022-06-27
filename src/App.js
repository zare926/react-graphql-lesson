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

  const [defaultState, setDefaultState] = useState(VARIABLES)

  const handleChange = useCallback((e) => {
    console.log(e.target.value)
    setDefaultState({
      ...defaultState,
      query: e.target.value
    })
  })

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <ApolloProvider client={client}>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input value={defaultState.query} onChange={(e) => handleChange(e)} />
      </form>
      <Query query={SEARTCH_REPOSITORIES} variables={{...defaultState}}>
        {
          ({loading, error, data}) => {
            if (loading) return 'Loading...'
            if (error) return `Error! ${error.message}`
            const search = data.search
            const repositoryCount = search.repositoryCount

            const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories'
            const title = `GitHub Repositories Search Results - ${repositoryCount} ${repositoryUnit}`
            return <h2>{title}</h2>
          }
        }
      </Query>
    </ApolloProvider>
  );
}

export default App;
