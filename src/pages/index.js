import React, { useState } from "react"
import {
  Flex,
  Box,
  Stack,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Heading,
  Button,
} from "@chakra-ui/core"

import { AuthorSearch } from "../components"

function IndexPage({ data }) {
  const { authors } = data.latin
  const [authorsToSearch, setAuthorsToSearch] = useState([])
  const [lemmaToSearch, setLemmaToSearch] = useState("")
  console.log(authorsToSearch)
  console.log(lemmaToSearch)
  return (
    <Flex justify="center">
      <Box p={8} maxWidth="480px">
        <Heading mb={6} textAlign="center" fontSize={["24px", "30px"]}>
          Latin Diachronic Analysis
        </Heading>
        <Stack spacing={3}>
          <FormControl>
            <FormLabel htmlFor="author">Author</FormLabel>
            <AuthorSearch authors={authors} onUpdate={setAuthorsToSearch} />
            <FormHelperText id="author-helper-text">
              Enter as many authors as you'd like, or leave blank to search all
              authors.
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="lemma">Lemma</FormLabel>
            <Input
              type="lemma"
              id="lemma"
              aria-describedby="lemma-helper-text"
              value={lemmaToSearch}
              onChange={e => setLemmaToSearch(e.target.value)}
            />
            <FormHelperText id="lemma-helper-text">
              Enter any lemma or a wordform.
            </FormHelperText>
          </FormControl>
        </Stack>
        <Flex justify="center">
          <Button mt={6} width={["100%", "60%"]} disabled={!lemmaToSearch}>
            Search
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}

export default IndexPage

export const query = graphql`
  query {
    latin {
      authors {
        name
      }
    }
  }
`
