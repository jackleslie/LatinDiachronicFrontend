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
  Icon,
  Stack,
  Text,
  FormControl,
  FormHelperText,
  FormLabel,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/core"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"

function ResultsPage({ location }) {
  const authors = location && location.state && location.state.authors
  const search = location && location.state && location.state.search
  const AUTHOR_QUERY =
    authors && authors.length
      ? `, authors: { list: "${authors.toString()}", useAll: false }`
      : ""
  const LEMMA_QUERY = gql`
  {
    lemma(lemma: "${search}"${AUTHOR_QUERY}) {
      count
      occurrences {
        line
        source {
          name
          author {
            name
          }
        }
      }
    }
  }
  `
  const [query, setQuery] = useState(LEMMA_QUERY)
  const [result, setResult] = useState()
  /*
  const [authorFilter, setAuthorFilter] = useState("")
  const [sourceFilter, setSourceFilter] = useState("")
  */
  const [group, setGroup] = useState()
  const { loading, error, data } = useQuery(query)

  useEffect(() => {
    if (data && data.lemma) {
      if (!data.lemma.count) {
        const FORM_QUERY = gql`
        {
          form(form: "${search}"${AUTHOR_QUERY}) {
            count
            occurrences {
              line
              source {
                name
                author {
                  name
                }
              }
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
        const group = generateGroup(data.lemma)
        setGroup(group)
        console.log(group)
      }
    } else if (data && data.form) {
      if (data.form.count) {
        setResult({
          ...data.form,
          type: "Form",
        })
        const group = generateGroup(data.form)
        setGroup(group)
        console.log(group)
      } else {
        setResult({ type: "Empty" })
      }
    }
  }, [data, search, AUTHOR_QUERY])

  function generateGroup(result) {
    return result.occurrences.reduce(
      (x, occurrence) => {
        const authorName = occurrence.source.author.name
        const sourceName = occurrence.source.name

        const authorsEntry = {
          line: occurrence.line,
          source: sourceName,
        }

        if (x.authors[authorName]) {
          x.authors[authorName].occurrences.push(authorsEntry)
          if (!x.authors[authorName].sources.includes(sourceName)) {
            x.authors[authorName].sources.push(sourceName)
          }
        } else {
          x.authors[authorName] = {}
          x.authors[authorName].occurrences = [authorsEntry]
          x.authors[authorName].sources = [sourceName]
        }

        if (x.sources[sourceName]) {
          x.sources[sourceName].occurrences.push(occurrence.line)
        } else {
          x.sources[sourceName] = {}
          x.sources[sourceName].occurrences = [occurrence.line]
          x.sources[sourceName].author = authorName
        }

        return x
      },
      { authors: {}, sources: {} }
    )
  }

  return (
    <Flex justify="center">
      <Box p={8} maxWidth="400px" width="400px">
        <Heading mb={3} textAlign="center" fontSize={["24px", "27px"]}>
          <Link to="/">Latin Diachronic Analysis</Link>
        </Heading>

        {(loading || !result) && (
          <Stack align="center">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
            <Text mt={3}>
              Finding "{search}"{" "}
              {authors && authors.length
                ? `for ${authors.toString()}`
                : "for all authors"}
            </Text>
          </Stack>
        )}
        {result && result.type !== "Empty" && (
          <Box>
            <Flex flexWrap="wrap">
              <Stat mt={3}>
                <StatLabel>Type</StatLabel>
                <StatNumber fontSize={["lg", "2xl"]}>{result.type}</StatNumber>
              </Stat>
              <Stat mt={3}>
                <StatLabel>Occurrences</StatLabel>
                <StatNumber fontSize={["lg", "2xl"]}>{result.count}</StatNumber>
              </Stat>
              {group && group.authors ? (
                <Stat mt={3}>
                  <StatLabel>Authors</StatLabel>
                  <StatNumber fontSize={["lg", "2xl"]}>
                    {Object.entries(group.authors).length}
                  </StatNumber>
                </Stat>
              ) : null}
              {group && group.sources ? (
                <Stat mt={3}>
                  <StatLabel>Sources</StatLabel>
                  <StatNumber fontSize={["lg", "2xl"]}>
                    {Object.entries(group.sources).length}
                  </StatNumber>
                </Stat>
              ) : null}
            </Flex>
            <FormControl mt={6}>
              <FormLabel>Results for "{search}"</FormLabel>
              <Tabs isFitted variant="soft-rounded" variantColor="gray" mt={1}>
                <TabList>
                  <Tab>By author</Tab>
                  <Tab>By source</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    {/*
                    <FormControl mt={4}>
                      <FormLabel htmlFor="author-filter">Filter</FormLabel>
                      <Input
                        type="author-filter"
                        id="author-filter"
                        aria-describedby="author-filter-helper-text"
                        value={authorFilter}
                        onChange={e => setAuthorFilter(e.target.value)}
                        size="sm"
                      />
                      <FormHelperText id="author-filter-helper-text">
                        Filter by author name.
                      </FormHelperText>
                    </FormControl>
                    */}
                    <Accordion allowMultiple mt={8}>
                      {Object.entries(group.authors).map(
                        ([key, value], index) => (
                          <AccordionItem key={index}>
                            <AccordionHeader>
                              <Box flex="1" textAlign="left">
                                <Text>{key}</Text>
                                <FormHelperText mt={0}>
                                  in {value.sources.length} source
                                  {value.sources.length > 1 ? "s" : ""}
                                </FormHelperText>
                              </Box>
                              <AccordionIcon />
                            </AccordionHeader>
                            <AccordionPanel pb={4}>
                              {value.occurrences.map(
                                ({ line, source }, index) => (
                                  <Box mt={2} key={index}>
                                    <Text fontSize="sm">{line}</Text>
                                    <FormHelperText mt={0}>
                                      in {source}
                                    </FormHelperText>
                                  </Box>
                                )
                              )}
                            </AccordionPanel>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  </TabPanel>
                  <TabPanel>
                    {/*
                    <FormControl mt={4}>
                      <FormLabel htmlFor="source-filter">Filter</FormLabel>
                      <Input
                        type="source-filter"
                        id="source-filter"
                        aria-describedby="source-filter-helper-text"
                        value={sourceFilter}
                        onChange={e => setSourceFilter(e.target.value)}
                        size="sm"
                      />
                      <FormHelperText id="source-filter-helper-text">
                        Filter by source name.
                      </FormHelperText>
                    </FormControl>
                    */}
                    <Accordion allowMultiple mt={8}>
                      {Object.entries(group.sources).map(
                        ([key, value], index) => (
                          <AccordionItem key={index}>
                            <AccordionHeader>
                              <Box flex="1" textAlign="left">
                                <Text>{key}</Text>
                                <FormHelperText mt={0}>
                                  by {value.author}
                                </FormHelperText>
                              </Box>
                              <AccordionIcon />
                            </AccordionHeader>
                            <AccordionPanel pb={4}>
                              {value.occurrences.map((line, index) => (
                                <Box mt={2} key={index}>
                                  <Text fontSize="sm">{line}</Text>
                                </Box>
                              ))}
                            </AccordionPanel>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </FormControl>
          </Box>
        )}
        {result && result.type && result.type === "Empty" && (
          <Alert status="warning">
            <AlertIcon />
            Search yielded no results in our database, please try again.
            <Link to="/">
              <Icon name="repeat" size="1.5em" />
            </Link>
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
