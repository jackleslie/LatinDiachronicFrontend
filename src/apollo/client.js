import ApolloClient from "apollo-boost"
import fetch from "isomorphic-fetch"

export const client = new ApolloClient({
  uri:
    process.env.NODE_ENV === "production"
      ? process.env.GATSBY_API_URL
      : process.env.GATSBY_API_URL_DEV,
  fetch,
})
