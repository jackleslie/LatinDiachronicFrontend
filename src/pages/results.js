import React, { useState } from "react"
import { Link } from "gatsby"
import { Flex, Box, Text, Heading, Spinner } from "@chakra-ui/core"

function ResultsPage({ location }) {
  const { authors, lemma } = location.state
  console.log(authors, lemma)
  return (
    <Flex justify="center">
      <Box p={8} maxWidth="480px">
        <Heading mb={6} textAlign="center" fontSize={["24px", "27px"]}>
          <Link to="/">Latin Diachronic Analysis</Link>
        </Heading>
        <Flex justify="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      </Box>
    </Flex>
  )
}

export default ResultsPage
