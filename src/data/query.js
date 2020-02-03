import { gql } from "apollo-boost"

export const INTERSECTION_QUERY = gql`
  query($authors: [String!], $startYear: Int!, $endYear: Int!) {
    intersection(
      authors: { list: $authors, useAll: false }
      restOfLit: {
        useAll: false
        span: { startYear: $startYear, endYear: $endYear }
      }
    ) {
      occurrences {
        ambiguos
        line
        source {
          name
          author {
            name
          }
        }
      }
      lemma
      count
      forms {
        count
        form
      }
    }
  }
`

export const LEMMA_QUERY = gql`
  query(
    $search: String!
    $authors: [String!]
    $startYear: Int!
    $endYear: Int!
  ) {
    lemma(
      lemma: $search
      authors: { list: $authors, useAll: false }
      span: {
        useAll: false
        span: { startYear: $startYear, endYear: $endYear }
      }
    ) {
      count
      occurrences {
        ambiguos
        line
        source {
          name
          author {
            name
            timeSpan {
              end
              start
            }
          }
        }
      }
    }
  }
`

export const FORM_QUERY = gql`
  query(
    $search: String!
    $authors: [String!]
    $startYear: Int!
    $endYear: Int!
  ) {
    form(
      form: $search
      authors: { list: $authors, useAll: false }
      span: {
        useAll: false
        span: { startYear: $startYear, endYear: $endYear }
      }
    ) {
      count
      occurrences {
        ambiguos
        line
        source {
          name
          author {
            name
            timeSpan {
              end
              start
            }
          }
        }
      }
    }
  }
`
