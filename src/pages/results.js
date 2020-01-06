import React, { useState } from "react"
import { Link } from "gatsby"
import {
  Flex,
  Box,
  Text,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/core"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"

function ResultsPage({ location }) {
  const authors = location && location.state && location.state.authors
  const lemma = location && location.state && location.state.lemma
  const APOLLO_QUERY = gql`
  {
    lemma(lemma: "${lemma}") {
      count
      occurrences {
        line
      }
    }
  }
  `
  const { loading, error, data } = useQuery(APOLLO_QUERY)
  console.log(data)
  return (
    <Flex justify="center">
      <Box p={8} maxWidth="480px">
        <Heading mb={6} textAlign="center" fontSize={["24px", "27px"]}>
          <Link to="/">Latin Diachronic Analysis</Link>
        </Heading>
        <Flex justify="center">
          {loading && (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          )}
          {data && (
            <Alert status="success">
              <AlertIcon />
              Successful query!
            </Alert>
          )}
          {error && (
            <Alert status="error">
              <AlertIcon />
              There was an error processing your request
            </Alert>
          )}
        </Flex>
      </Box>
    </Flex>
  )
}

export default ResultsPage
