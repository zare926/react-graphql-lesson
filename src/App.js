import React, { useState, useCallback } from 'react';
import client from './client'
import { ApolloProvider, Query, Mutation } from 'react-apollo'
import { SEARTCH_REPOSITORIES, ADD_STAR, REMOVE_STAR } from './graphql'


const StarButton = (props) => {
  const node = props.node
  const totalCount = node.stargazers.totalCount
  const viewerHasStarred = node.viewerHasStarred
  const starCount = totalCount === 1 ? "1 star" : `${totalCount} stars`

  const StarStatus = ({addOrRemoveStar}) => {
    return (
    <button onClick={
      () => {
        addOrRemoveStar({
          variables: {
            input: {
              starrableId: node.id
            }
          }
        })
      }
    }>
      {starCount} | {viewerHasStarred ? 'starred' : '-'}
    </button>
    )
  }

  return (
    <Mutation mutation={viewerHasStarred ? REMOVE_STAR : ADD_STAR }>
      {
        (addOrRemoveStar) => 
          <StarStatus addOrRemoveStar={addOrRemoveStar}/>
      }
    </Mutation>
  ) 
}


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

  const goPrevious = (search) => {
    setDefaultState({
      ...defaultState,
      first: null,
      after: null,
      last: PER_PAGE,
      before:  search.pageInfo.startCursor
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
                            &nbsp;
                            <StarButton node={node} />
                          </li>

                        )
                      })
                    }
                </ul>
                {search.pageInfo.hasPreviousPage && <button onClick={() => goPrevious(search)}>Previous</button> }
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
