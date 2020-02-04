import { gql } from "apollo-boost"

export const INTERSECTION_QUERY = gql`
  query(
    $authors: [String!]
    $startYear: Int!
    $endYear: Int!
    $useAll: Boolean!
  ) {
    intersection(
      authors: { list: $authors, useAll: $useAll }
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
    $useAll: Boolean!
  ) {
    lemma(
      lemma: $search
      authors: { list: $authors, useAll: $useAll }
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
    $useAll: Boolean!
  ) {
    form(
      form: $search
      authors: { list: $authors, useAll: $useAll }
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

export const WORD_TYPE_QUERY = gql`
  query($search: String!) {
    wordType(word: $search)
  }
`
