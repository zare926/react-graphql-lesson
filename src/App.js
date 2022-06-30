import React, { useState, useCallback,ref } from 'react';
import client from './client'
import { ApolloProvider, Query, Mutation } from 'react-apollo'
import { SEARTCH_REPOSITORIES, ADD_STAR, REMOVE_STAR } from './graphql'


function App() {

  const PER_PAGE = 5
  
  const VARIABLES = {
    first: PER_PAGE,
    after: null,
    last: null,
    before: null,
    query: ''
  }

  const [defaultState, setDefaultState] = useState(VARIABLES)
  
  const StarButton = (props) => {
    const { node , ...omitProps } = props
    // console.log(omitProps)
    // console.log(node)
    const { query, first, last, before, after } = omitProps
    const totalCount = node.stargazers.totalCount
    const viewerHasStarred = node.viewerHasStarred
    const starCount = totalCount === 1 ? "1 star" : `${totalCount} stars`
  
    const StarStatus = ({addOrRemoveStar}) => {
      return (
      <button onClick={
        () => {
          addOrRemoveStar({
            variables: { input: { starrableId: node.id } },
            update: (store, { data: { addStar, removeStar }}) => {
              const { starrable } = addStar || removeStar
              console.log({starrable})
              const data = store.readQuery({
                query: SEARTCH_REPOSITORIES,
                variables: { query, first, last, before, after } 
              })
              const edges = data.search.edges
              const newEdges = edges.map(edge => {
                if (edge.node.id === node.id){
                  const totalCount = edge.node.stargazers.totalCount
                  // const diff = viewerHasStarred ? -1 : 1
                  const diff = starrable.viewerHasStarred ? 1 : -1
                  const newTotalCount = totalCount + diff
                  edge.node.stargazers.totalCount = newTotalCount
                }
                return edge
              })

              data.search.edges = newEdges
              store.writeQuery({ query: SEARTCH_REPOSITORIES, data})
            }
          })
        }
      }>
        {starCount} | {viewerHasStarred ? 'starred' : '-'}
      </button>
      )
    }
  
    return (
      <Mutation mutation={viewerHasStarred ? REMOVE_STAR : ADD_STAR }
        // refetchQueries={ mutationRefetch => {
        //   console.log(mutationRefetch)
        //   return  [
        //     {
        //       query: SEARTCH_REPOSITORIES,
        //       variables: { query, first, last , before, after }
        //     }
        //   ]
        // }
        // }
        >
        {
          (addOrRemoveStar) => 
            <StarStatus addOrRemoveStar={addOrRemoveStar}/>
        }
      </Mutation>
    ) 
  }
  
  const myRef = React.createRef()
  // const handleChange = useCallback((e) => {
  //   setDefaultState({
  //     ...defaultState,
  //     query: e.target.value
  //   })
  // })

  const handleSubmit = (e) => {
    e.preventDefault()
    setDefaultState({
      ...defaultState,
      query: myRef.current.value
    })
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
        <input ref={myRef} />
        <input type="submit" value="Submit"/>
      </form>
      <Query query={SEARTCH_REPOSITORIES} variables={defaultState}>
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
                            <StarButton node={node} {...defaultState}/>
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
