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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/core"
import { Link, graphql, navigate } from "gatsby"

import { AuthorSearch, Slider, SEO } from "../components"
import { yearLabel } from "../utils"
import { Type } from "../data"

function IndexPage({ data }) {
  const { authors } = data.latin
  const [authorsToSearch, setAuthorsToSearch] = useState([])
  const [wordToSearch, setWordToSearch] = useState("")
  const [clicked, setClicked] = useState(false)
  const [timeSpan, setTimeSpan] = useState([-500, 600])
  const [searchType, setSearchType] = useState(Type.LEMMA)

  const isLemma = searchType === Type.LEMMA
  const isForm = searchType === Type.FORM
  const isIntersection = searchType === Type.INTERSECTION

  const canSearch =
    (isIntersection && authorsToSearch.length > 0) ||
    ((isLemma || isForm) && wordToSearch)

  const inputId = searchType.toLowerCase()

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
              isInvalid={
                clicked &&
                ((!isIntersection && authorsToSearch.length === 0) ||
                  (isIntersection && authorsToSearch.length === 0))
              }
              onFocus={() => setClicked(false)}
            />
            <FormHelperText id="author-helper-text">
              {isIntersection
                ? "Enter at least one author."
                : "Enter as many authors as you like, or leave blank to search all authors."}
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
          <FormControl mt={[1, 3]}>
            <FormLabel htmlFor={inputId}>
              <Breadcrumb>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    isCurrentPage={isLemma}
                    onClick={() => setSearchType(Type.LEMMA)}
                    color={isLemma || "gray.500"}
                  >
                    Lemma
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  <BreadcrumbLink
                    isCurrentPage={isForm}
                    onClick={() => setSearchType(Type.FORM)}
                    color={isForm || "gray.500"}
                  >
                    Form
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  <BreadcrumbLink
                    isCurrentPage={isIntersection}
                    onClick={() => setSearchType(Type.INTERSECTION)}
                    color={isIntersection || "gray.500"}
                  >
                    Intersection
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </FormLabel>
            <Input
              type="email"
              id={inputId}
              aria-describedby={`${inputId}-helper-text`}
              value={wordToSearch}
              onChange={e => setWordToSearch(e.target.value)}
              onFocus={() => setClicked(false)}
              isInvalid={clicked && !isIntersection}
              isDisabled={isIntersection}
            />
            <FormHelperText id={`${inputId}-helper-text`}>
              {isIntersection
                ? "Search the intersection of authors."
                : `Search any ${isLemma ? "lemma" : "form"}.`}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Flex justify="center">
          <Button
            mt={[6, 8]}
            width="100%"
            onClick={() => {
              if (canSearch) {
                navigate("/results/", {
                  state: {
                    authors: authorsToSearch,
                    search: wordToSearch,
                    searchType,
                    timeSpan,
                  },
                })
              } else {
                setClicked(true)
              }
            }}
          >
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
