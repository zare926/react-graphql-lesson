import qpl from 'graphql-tag'

export const ME = qpl`
  query me {
    user(login: "zare926") {
      name
    }
  }
`