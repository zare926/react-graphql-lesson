import qpl from 'graphql-tag'

export const SEARTCH_REPOSITORIES = qpl`
  query searchRepositories($first: Int, $after: String, $last: Int, $before: String, $query: String!){
    search(first: $first, after: $after, last: $last, before: $before, query: $query, type: REPOSITORY) {
      repositoryCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        cursor
        node {
          ... on Repository {
            id
            name
            url
            stargazers {
              totalCount
            }
            viewerHasStarred
          }
        }
      }
    }
  }
`

export const ME = qpl`
  query me {
    user(login: "zare926") {
      name
    }
  }
`