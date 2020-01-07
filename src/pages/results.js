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
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
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
  const [filter, setFilter] = useState("")
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
        const group = data.lemma.occurrences.reduce(
          (x, occurrence) => {
            const authorName = occurrence.source.author.name
            const sourceName = occurrence.source.name

            const authorsEntry = {
              line: occurrence.line,
              source: sourceName,
            }

            if (x.authors[authorName]) {
              x.authors[authorName].push(authorsEntry)
            } else {
              x.authors[authorName] = [authorsEntry]
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
        console.log(group)
        setGroup(group)
      }
    } else if (data && data.form) {
      if (data.form.count) {
        setResult({
          ...data.form,
          type: "Form",
        })
        const group = data.form.occurrences.reduce(
          (x, occurrence) => {
            const authorName = occurrence.source.author.name
            const sourceName = occurrence.source.name

            const authorsEntry = {
              line: occurrence.line,
              source: sourceName,
            }

            if (x.authors[authorName]) {
              x.authors[authorName].push(authorsEntry)
            } else {
              x.authors[authorName] = [authorsEntry]
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
        console.log(group)
        setGroup(group)
      } else {
        setResult({ type: "Empty" })
      }
    }
  }, [data, search, AUTHOR_QUERY])
  return (
    <Flex justify="center">
      <Box p={8} maxWidth="400px" width="400px">
        <Heading mb={6} textAlign="center" fontSize={["24px", "27px"]}>
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
              {authors.length ? `for ${authors.toString()}` : "for all authors"}
            </Text>
          </Stack>
        )}
        {result && result.type !== "Empty" && (
          <Box>
            <Flex>
              <Stat>
                <StatLabel>Type</StatLabel>
                <StatNumber>{result.type}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Occurrences</StatLabel>
                <StatNumber>{result.count}</StatNumber>
              </Stat>
              {group && group.authors ? (
                <Stat>
                  <StatLabel>Authors</StatLabel>
                  <StatNumber>
                    {Object.entries(group.authors).length}
                  </StatNumber>
                </Stat>
              ) : null}
              {group && group.sources ? (
                <Stat>
                  <StatLabel>Sources</StatLabel>
                  <StatNumber>
                    {Object.entries(group.sources).length}
                  </StatNumber>
                </Stat>
              ) : null}
            </Flex>
            <FormControl mt={6}>
              <FormLabel htmlFor="filter">Filter</FormLabel>
              <Input
                type="filter"
                id="filter"
                aria-describedby="filter-helper-text"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
              <FormHelperText id="filter-helper-text">
                Filter by source name.
              </FormHelperText>
            </FormControl>
            <FormControl mt={6}>
              <FormLabel>Results</FormLabel>
              <Tabs isFitted>
                <TabList>
                  <Tab>All</Tab>
                  <Tab>By author</Tab>
                  <Tab>By source</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Stack mt={6}>
                      {result.occurrences
                        .filter(({ source }) =>
                          source.name
                            .toLowerCase()
                            .includes(filter.toLowerCase())
                        )
                        .map(({ line, source }, index) => (
                          <Flex align="center" key={index} mt={1}>
                            <Box>
                              <Text fontWeight="bold">{source.name}</Text>
                              <Text fontSize="sm">{line}</Text>
                              <FormHelperText mt={1}>
                                by {source.author.name}
                              </FormHelperText>
                            </Box>
                          </Flex>
                        ))}
                    </Stack>
                  </TabPanel>
                  <TabPanel>
                    <Stack mt={6}>
                      {Object.entries(group.authors).map(
                        ([key, value], index) => (
                          <Flex align="center" key={key} mt={1}>
                            <Box>
                              <Text fontWeight="bold">{key}</Text>
                              {value.map(({ line, source }) => (
                                <Box mt={2}>
                                  <Text fontSize="sm">{line}</Text>
                                  <FormHelperText mt={0}>
                                    in {source}
                                  </FormHelperText>
                                </Box>
                              ))}
                            </Box>
                          </Flex>
                        )
                      )}
                    </Stack>
                  </TabPanel>
                  <TabPanel>
                    <Stack mt={6}>
                      {Object.entries(group.sources).map(
                        ([key, value], index) => (
                          <Flex align="center" key={key} mt={1}>
                            <Box>
                              <Text fontWeight="bold">{key}</Text>
                              <FormHelperText mt={0}>
                                by {value.author}
                              </FormHelperText>
                              {value.occurrences.map(line => (
                                <Box mt={2}>
                                  <Text fontSize="sm">{line}</Text>
                                </Box>
                              ))}
                            </Box>
                          </Flex>
                        )
                      )}
                    </Stack>
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
