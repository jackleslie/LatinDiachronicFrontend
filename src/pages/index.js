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
import { Link, graphql } from "gatsby"

import { AuthorSearch, Slider, SEO } from "../components"
import { yearLabel } from "../utils"

function IndexPage({ data }) {
  const { authors } = data.latin
  const [authorsToSearch, setAuthorsToSearch] = useState([])
  const [lemmaToSearch, setLemmaToSearch] = useState("")
  const [clicked, setClicked] = useState(false)
  const [timeSpan, setTimeSpan] = useState([-500, 600])

  return (
    <Flex justify="center">
      <SEO title="Search" />
      <Box p={8} maxWidth="500px">
        <Heading mb={6} textAlign="center" fontSize={["24px", "36px"]}>
          <Link to="/">Latin Diachronic Analysis</Link>
        </Heading>
        <Stack spacing={3}>
          <FormControl>
            <FormLabel htmlFor="author">Author</FormLabel>
            <AuthorSearch
              authors={authors}
              onUpdate={setAuthorsToSearch}
              isInvalid={clicked}
              onFocus={() => setClicked(false)}
            />
            <FormHelperText id="author-helper-text">
              Enter as many authors as you like, or leave blank to search all
              authors.
            </FormHelperText>
          </FormControl>
          <FormControl mt={[1, 3]}>
            <FormLabel htmlFor="lemma">Lemma</FormLabel>
            <Input
              type="email"
              id="lemma"
              aria-describedby="lemma-helper-text"
              value={lemmaToSearch}
              onChange={e => setLemmaToSearch(e.target.value)}
              onFocus={() => setClicked(false)}
              isInvalid={clicked}
            />
            <FormHelperText id="lemma-helper-text">
              Search any lemma or form, or leave blank for intersection of
              authors.
            </FormHelperText>
          </FormControl>
          <FormControl mt={[1, 3]}>
            <FormLabel htmlFor="century">Century</FormLabel>
            <Slider value={timeSpan} setValue={setTimeSpan} />
            <FormHelperText id="century-helper-text" mt={0}>
              Search from {yearLabel(timeSpan[0])} until{" "}
              {yearLabel(timeSpan[1])}.
            </FormHelperText>
          </FormControl>
        </Stack>
        <Flex justify="center">
          {lemmaToSearch || authorsToSearch.length ? (
            <Link
              to="/results"
              state={{
                authors: authorsToSearch,
                search: lemmaToSearch,
                timeSpan,
              }}
              style={{ width: "100%" }}
            >
              <Button mt={[6, 8]} width="100%">
                Search
              </Button>
            </Link>
          ) : (
            <Button mt={[6, 8]} width="100%" onClick={() => setClicked(true)}>
              Search
            </Button>
          )}
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
