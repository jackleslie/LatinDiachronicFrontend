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
  Radio,
  RadioGroup,
  Tooltip,
  Icon,
  Collapse
} from "@chakra-ui/core"
import { Link, graphql, navigate } from "gatsby"

import { AuthorSearch, Slider, SEO } from "../components"
import { yearLabel } from "../utils"
import { Type, Advanced } from "../data"

function IndexPage({ data }) {
  const { authors } = data.latin
  const [authorsToSearch, setAuthorsToSearch] = useState([])
  const [wordToSearch, setWordToSearch] = useState("")
  const [clicked, setClicked] = useState(false)
  const [timeSpan, setTimeSpan] = useState([-500, 600])
  const [searchType, setSearchType] = useState(Type.LEMMA)
  const [epigraph, setEpigraph] = useState(Advanced.EXCLUDE)
  const [showAdvanced, setShowAdvanced] = useState(false)

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
      <Box p={8} maxWidth="500px" width="100%">
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
                clicked && isIntersection && authorsToSearch.length === 0
              }
              onFocus={() => setClicked(false)}
            />
            <FormHelperText id="author-helper-text">
              {isIntersection
                ? "Enter at least one author."
                : "Enter as many authors as you like, or leave blank to search all authors."}
            </FormHelperText>
            <Button p={3} mt={3} leftIcon={`triangle-${showAdvanced ? 'up' : 'down'}`} size="xs" onClick={() => setShowAdvanced(!showAdvanced)}>Advanced</Button>
            <Collapse mt={2} isOpen={showAdvanced}>
              <RadioGroup spacing={[0, 1]} onChange={e => setEpigraph(e.target.value)} value={epigraph}>
                <Radio 
                  size="sm" 
                  value={Advanced.EXCLUDE}
                >
                  Exclude epigraphs
                  <Tooltip label="Search by author(s) without results found in epigraphs.">
                    <Icon name="question-outline" ml="4px" />
                  </Tooltip>
                </Radio>
                <Radio 
                  size="sm" 
                  value={Advanced.INCLUDE}
                >
                  Include epigraphs
                  <Tooltip label="Search by author(s) and include results found in epigraphs.">
                    <Icon name="question-outline" ml="4px" />
                  </Tooltip>
                </Radio>
                <Radio 
                  size="sm" 
                  value={Advanced.ONLY}
                >
                  Epigraphs only
                  <Tooltip label="Only include results found in epigraphs.">
                    <Icon name="question-outline" ml="4px" />
                  </Tooltip>
                </Radio>
              </RadioGroup>
            </Collapse>
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
                  <Button
                    aria-current={isLemma}
                    onClick={() => {
                      setSearchType(Type.LEMMA)
                      setClicked(false)
                    }}
                    color={isLemma || "gray.400"}
                    variant="link"
                    fontWeight="500"
                  >
                    Lemma
                  </Button>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  <Button
                    aria-current={isForm}
                    onClick={() => {
                      setSearchType(Type.FORM)
                      setClicked(false)
                    }}
                    color={isForm || "gray.400"}
                    variant="link"
                    fontWeight="500"
                  >
                    Form
                  </Button>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  <Button
                    aria-current={isIntersection}
                    onClick={() => {
                      setSearchType(Type.INTERSECTION)
                      setClicked(false)
                    }}
                    color={isIntersection || "gray.400"}
                    variant="link"
                    fontWeight="500"
                  >
                    Intersection
                  </Button>
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
                : `Enter any ${isLemma ? "lemma" : "form"}.`}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Flex justify="center">
          <Button
            mt={[6, 8]}
            width="100%"
            onClick={() => {
              let authorsToSend;
              if (epigraph === Advanced.EXCLUDE) {
                authorsToSend = authorsToSearch
              } else if (epigraph === Advanced.INCLUDE) {
                authorsToSend = [...authorsToSearch, 'EPIGRAPHS']
              } else {
                authorsToSend = ['EPIGRAPHS']
              }
              if (canSearch) {
                navigate("/results/", {
                  state: {
                    authors: authorsToSend,
                    search: wordToSearch,
                    searchType,
                    timeSpan,
                    epigraph
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
