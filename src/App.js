import React, { useState, useCallback } from 'react';
import client from './client'
import {ApolloProvider} from 'react-apollo';

import { Query } from 'react-apollo'
import { SEARTCH_REPOSITORIES } from './graphql'

const PER_PAGE = 5

const VARIABLES = {
  first: PER_PAGE,
  after: null,
  last: null,
  before: null,
  query: 'フロントエンドエンジニア'
}

function App() {

  const [defaultState, setDefaultState] = useState(VARIABLES)

  const handleChange = useCallback((e) => {
    setDefaultState({
      ...defaultState,
      query: e.target.value
    })
  })

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const goNext = (search) => {
    setDefaultState({
      ...defaultState,
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null
    })
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
            return (
              <React.Fragment>
                <h2>{title}</h2>
                <ul>
                    {
                      search.edges.map(edge => {
                        const node = edge.node
                        return (
                          <li key={node.id}>
                            <a href={node.url} target="_blank" rel="noopener noreferrer">{node.name}</a>
                          </li>

                        )
                      })
                    }
                </ul>
                {search.pageInfo.hasNextPage && <button onClick={() => goNext(search)}>Next</button> }
              </React.Fragment>
            )
          }
        }
      </Query>
    </ApolloProvider>
  );
}

export default App;
