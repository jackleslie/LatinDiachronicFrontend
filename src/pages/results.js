import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import {
  Flex,
  Box,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/core"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"

function ResultsPage({ location }) {
  const authors = location && location.state && location.state.authors
  const search = location && location.state && location.state.search
  const LEMMA_QUERY = gql`
  {
    lemma(lemma: "${search}") {
      count
      occurrences {
        line
      }
    }
  }
  `
  const [query, setQuery] = useState(LEMMA_QUERY)
  const [result, setResult] = useState()
  const { loading, error, data } = useQuery(query)

  useEffect(() => {
    if (data && data.lemma) {
      if (!data.lemma.count) {
        const FORM_QUERY = gql`
      {
        form(form: "${search}") {
          count
          occurrences {
            line
          }
        }
      }
      `
        setQuery(FORM_QUERY)
      } else {
        setResult({
          ...data.lemma,
          type: "Lemma",
        })
      }
    } else if (data && data.form) {
      if (data.form.count) {
        setResult({
          ...data.form,
          type: "Form",
        })
      } else {
        setResult({ type: "Empty" })
      }
    }
  }, [data, search])
  console.log(data)
  return (
    <Flex justify="center">
      <Box p={8} maxWidth="400px">
        <Heading mb={6} textAlign="center" fontSize={["24px", "27px"]}>
          <Link to="/">Latin Diachronic Analysis</Link>
        </Heading>

        {loading && (
          <Flex justify="center">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Flex>
        )}
        {result && result.type !== "Empty" && (
          <Flex>
            <Stat>
              <StatLabel>Type</StatLabel>
              <StatNumber>{result.type}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Occurrences</StatLabel>
              <StatNumber>{result.count}</StatNumber>
            </Stat>
          </Flex>
        )}
        {result && result.type && result.type === "Empty" && (
          <Alert status="warning">
            <AlertIcon />
            The lemma or wordform you entered is incorrect or doesn't exist in
            our database, please try again.
          </Alert>
        )}
        {error && (
          <Alert status="error">
            <AlertIcon />
            There was an error processing your request
          </Alert>
        )}
      </Box>
    </Flex>
  )
}

export default ResultsPage
