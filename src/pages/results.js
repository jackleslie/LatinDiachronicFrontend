import React, { useState, useEffect } from "react"
import { Link as GatsbyLink } from "gatsby"
import {
  Flex,
  Box,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  Stack,
  Text,
  Link,
  Icon,
  FormControl,
  FormHelperText,
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
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/core"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { SEO } from "../components"
import { yearLabel, countAmbiguousOccurences } from "../utils"

function ResultsPage({ location }) {
  const authors = location && location.state && location.state.authors
  const search = location && location.state && location.state.search
  const timeSpan = location && location.state && location.state.timeSpan
  const AUTHOR_QUERY =
    authors && authors.length
      ? `, authors: { list: ${JSON.stringify(authors)}, useAll: false },`
      : ","
  const SPAN_QUERY =
    timeSpan && timeSpan.length
      ? `span: {useAll: false, span: {startYear: ${timeSpan[0]}, endYear: ${timeSpan[1]}}}`
      : ""
  const LEMMA_QUERY = gql`
  {
    lemma(lemma: "${search}"${AUTHOR_QUERY}${SPAN_QUERY}) {
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
  const [query, setQuery] = useState(LEMMA_QUERY)
  const [result, setResult] = useState()
  const [ambiguous, setAmbiguous] = useState()
  const [reference, setReference] = useState()
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
          form(form: "${search}"${AUTHOR_QUERY}${SPAN_QUERY}) {
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
        setQuery(FORM_QUERY)
      } else {
        setResult({
          ...data.lemma,
          type: "Lemma",
        })
        const group = generateGroup(data.lemma)
        setGroup(group)
        console.log(group)

        const ambiguousOccurences = countAmbiguousOccurences(data.lemma)
        setAmbiguous(ambiguousOccurences)
        console.log(ambiguousOccurences)
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

        const ambiguousOccurences = countAmbiguousOccurences(data.form)
        setAmbiguous(ambiguousOccurences)
        console.log(ambiguousOccurences)
      } else {
        setResult({ type: "Empty" })
      }
    }
  }, [data, search, AUTHOR_QUERY, SPAN_QUERY])

  function generateGroup(result) {
    return result.occurrences.reduce(
      (x, occurrence) => {
        const authorName = occurrence.source.author.name
        const sourceName = occurrence.source.name
        const start = occurrence.source.author.timeSpan.start
        const end = occurrence.source.author.timeSpan.end

        const authorsEntry = {
          line: occurrence.line,
          source: sourceName,
          ambiguous: occurrence.ambiguos,
        }

        // authors
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

        const sourceEntry = {
          line: occurrence.line,
          ambiguous: occurrence.ambiguos,
        }

        // sources
        if (x.sources[sourceName]) {
          x.sources[sourceName].occurrences.push(sourceEntry)
        } else {
          x.sources[sourceName] = {}
          x.sources[sourceName].occurrences = [sourceEntry]
          x.sources[sourceName].author = authorName
        }

        const centuriesEntry = {
          line: occurrence.line,
          source: sourceName,
          ambiguous: occurrence.ambiguos,
        }

        // centuries (start)
        if (x.centuries[start] && x.centuries[start][authorName]) {
          x.centuries[start][authorName].occurrences.push(centuriesEntry)
          if (!x.centuries[start][authorName].sources.includes(sourceName)) {
            x.centuries[start][authorName].sources.push(sourceName)
          }
        } else {
          x.centuries[start] = { ...x.centuries[start] }
          x.centuries[start][authorName] = {}
          x.centuries[start][authorName].occurrences = [centuriesEntry]
          x.centuries[start][authorName].sources = [sourceName]
        }

        // centuries (end)
        if (x.centuries[end] && x.centuries[end][authorName]) {
          x.centuries[end][authorName].occurrences.push(centuriesEntry)
          if (!x.centuries[end][authorName].sources.includes(sourceName)) {
            x.centuries[end][authorName].sources.push(sourceName)
          }
        } else {
          x.centuries[end] = { ...x.centuries[end] }
          x.centuries[end][authorName] = {}
          x.centuries[end][authorName].occurrences = [centuriesEntry]
          x.centuries[end][authorName].sources = [sourceName]
        }

        return x
      },
      { authors: {}, sources: {}, centuries: {} }
    )
  }

  const timeSpanLabel =
    timeSpan && timeSpan.length
      ? `${yearLabel(timeSpan[0])} - ${yearLabel(timeSpan[1])}`
      : ""

  return (
    <Flex justify="center">
      <SEO title="Results" />
      <Box p={8} maxWidth="500px" width="500px">
        <Heading textAlign="center" fontSize={["24px", "36px"]}>
          <GatsbyLink to="/">Latin Diachronic Analysis</GatsbyLink>
        </Heading>

        {(loading || !result) && !error && (
          <Stack align="center" mt={6} width="100%">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
            <Text mt={4} textAlign="center">
              Searching <Text as="b">{search} </Text>
              {authors && authors.length ? (
                <Text as="span">
                  by <Text as="b">{authors.join(", ")}</Text>
                </Text>
              ) : (
                <Text as="span">
                  by <Text as="b">all authors</Text>
                </Text>
              )}{" "}
              in{" "}
              <Text as="b" wordBreak="break-word">
                {timeSpanLabel}
              </Text>
            </Text>
          </Stack>
        )}
        {result && result.type !== "Empty" && (
          <Box>
            <Text textAlign="center" fontSize={["18px", "22px"]}>
              Results for <b>{search}</b>
            </Text>
            <Box mt={4}>
              <Flex flexWrap="wrap">
                <Stat mt={3} mb={2} pr={0} textAlign="center" flexBasis="33%">
                  <StatLabel>Type</StatLabel>
                  <StatNumber fontSize={["lg", "2xl"]}>
                    {result.type}
                  </StatNumber>
                </Stat>
                <Stat mt={3} mb={2} pr={0} textAlign="center" flexBasis="33%">
                  <StatLabel>Occurrences</StatLabel>
                  <StatNumber fontSize={["lg", "2xl"]}>
                    {result.count}
                  </StatNumber>
                </Stat>
                <Stat mt={3} mb={2} pr={0} textAlign="center" flexBasis="33%">
                  <StatLabel>
                    Ambiguous
                    <Tooltip label="'Ambiguous occurrences' provides the number of occurrences out of the total, that are potentially affected by the presence of homographic forms belonging to multiple lemmas.">
                      <Icon name="question-outline" ml="4px" />
                    </Tooltip>
                  </StatLabel>
                  <StatNumber fontSize={["lg", "2xl"]}>{ambiguous}</StatNumber>
                </Stat>
                {group && group.authors ? (
                  <Stat mt={3} mb={2} pr={0} textAlign="center" flexBasis="33%">
                    <StatLabel>Authors</StatLabel>
                    <StatNumber fontSize={["lg", "2xl"]}>
                      {Object.entries(group.authors).length}
                    </StatNumber>
                  </Stat>
                ) : null}
                {group && group.sources ? (
                  <Stat mt={3} mb={2} pr={0} textAlign="center" flexBasis="33%">
                    <StatLabel>Sources</StatLabel>
                    <StatNumber fontSize={["lg", "2xl"]}>
                      {Object.entries(group.sources).length}
                    </StatNumber>
                  </Stat>
                ) : null}
                {timeSpan && (
                  <Stat mt={3} mb={2} pr={0} textAlign="center" flexBasis="33%">
                    <StatLabel>Centuries</StatLabel>
                    <StatNumber fontSize={["lg", "2xl"]}>
                      {timeSpanLabel}
                    </StatNumber>
                  </Stat>
                )}
              </Flex>
              <FormControl mt={6}>
                <Tabs
                  isFitted
                  variant="soft-rounded"
                  variantColor="gray"
                  mt={1}
                >
                  <TabList>
                    <Tab fontSize={["sm", "md"]}>By author</Tab>
                    <Tab fontSize={["sm", "md"]}>By source</Tab>
                    <Tab fontSize={["sm", "md"]}>By century</Tab>
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
                        {Object.entries(group.authors)
                          .sort(([a], [b]) =>
                            a.toUpperCase() > b.toUpperCase() ? 1 : -1
                          )
                          .map(([key, value], index) => (
                            <AccordionItem key={index}>
                              <AccordionHeader>
                                <Box flex="1" textAlign="left">
                                  <Text>
                                    {key} ({value.occurrences.length})
                                  </Text>
                                  <FormHelperText mt={0}>
                                    in {value.sources.length} source
                                    {value.sources.length > 1 ? "s" : ""}
                                  </FormHelperText>
                                </Box>
                                <AccordionIcon />
                              </AccordionHeader>
                              <AccordionPanel pb={4}>
                                {value.occurrences.map(
                                  ({ line, source, ambiguous }, index) => (
                                    <Box mt={2} key={index}>
                                      <Popover
                                        onOpen={async () => {
                                          setReference(null)
                                          const data = await fetch(
                                            `/.netlify/functions/phi?line=${line}`,
                                            {
                                              method: "GET",
                                            }
                                          ).then(x => x.json())
                                          setReference(data)
                                          console.log(data)
                                        }}
                                        onClose={() => setReference(null)}
                                      >
                                        <PopoverTrigger>
                                          <Link fontSize="sm">
                                            {line}
                                            <Icon
                                              name="search"
                                              mx="3px"
                                              size="0.75em"
                                            />
                                          </Link>
                                        </PopoverTrigger>
                                        <PopoverContent zIndex={4}>
                                          <PopoverArrow />
                                          <PopoverCloseButton />
                                          {reference ? (
                                            <PopoverHeader>
                                              <Text as="cite">
                                                {reference.link}
                                              </Text>
                                            </PopoverHeader>
                                          ) : null}
                                          <PopoverBody>
                                            {reference ? (
                                              <Text fontSize="sm">
                                                {reference.extract}
                                              </Text>
                                            ) : (
                                              <Stack
                                                align="center"
                                                width="100%"
                                              >
                                                <Spinner
                                                  thickness="4px"
                                                  speed="0.65s"
                                                  emptyColor="gray.200"
                                                  color="blue.500"
                                                  size="xl"
                                                  mt={2}
                                                />
                                                <Text mt={1} textAlign="center">
                                                  Loading reference...
                                                </Text>
                                              </Stack>
                                            )}
                                          </PopoverBody>
                                        </PopoverContent>
                                      </Popover>
                                      <FormHelperText mt={0}>
                                        in {source}{" "}
                                        {ambiguous
                                          ? "(Ambiguous)"
                                          : "(Certain)"}
                                      </FormHelperText>
                                    </Box>
                                  )
                                )}
                              </AccordionPanel>
                            </AccordionItem>
                          ))}
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
                        {Object.entries(group.sources)
                          .sort(([a], [b]) =>
                            a.toUpperCase() > b.toUpperCase() ? 1 : -1
                          )
                          .map(([key, value], index) => (
                            <AccordionItem key={index}>
                              <AccordionHeader>
                                <Box flex="1" textAlign="left">
                                  <Text>
                                    {key} ({value.occurrences.length})
                                  </Text>
                                  <FormHelperText mt={0}>
                                    by {value.author}
                                  </FormHelperText>
                                </Box>
                                <AccordionIcon />
                              </AccordionHeader>
                              <AccordionPanel pb={4}>
                                {value.occurrences.map(
                                  ({ line, ambiguous }, index) => (
                                    <Box mt={2} key={index}>
                                      <Link
                                        fontSize="sm"
                                        isExternal
                                        href={`https://latin.packhum.org/search?q=${line}`}
                                      >
                                        {line}
                                        <Icon name="external-link" mx="3px" />
                                      </Link>
                                      <FormHelperText mt={0}>
                                        {ambiguous
                                          ? "(Ambiguous)"
                                          : "(Certain)"}
                                      </FormHelperText>
                                    </Box>
                                  )
                                )}
                              </AccordionPanel>
                            </AccordionItem>
                          ))}
                      </Accordion>
                    </TabPanel>
                    <TabPanel>
                      <Accordion allowMultiple mt={8}>
                        {Object.entries(group.centuries)
                          .sort(([a], [b]) =>
                            a.toUpperCase() > b.toUpperCase() ? 1 : -1
                          )
                          .map(([key, value], index) => (
                            <Box key={key}>
                              <Heading size="sm" m={2} mt={6}>
                                {yearLabel(key)}
                              </Heading>
                              {Object.entries(value).map(
                                ([key, value], index) => (
                                  <AccordionItem key={index}>
                                    <AccordionHeader>
                                      <Box flex="1" textAlign="left">
                                        <Text>
                                          {key} ({value.occurrences.length})
                                        </Text>
                                        <FormHelperText mt={0}>
                                          in {value.sources.length} source
                                          {value.sources.length > 1 ? "s" : ""}
                                        </FormHelperText>
                                      </Box>
                                      <AccordionIcon />
                                    </AccordionHeader>
                                    <AccordionPanel pb={4}>
                                      {value.occurrences.map(
                                        (
                                          { line, source, ambiguous },
                                          index
                                        ) => (
                                          <Box mt={2} key={index}>
                                            <Link
                                              fontSize="sm"
                                              isExternal
                                              href={`https://latin.packhum.org/search?q=${line}`}
                                            >
                                              {line}
                                              <Icon
                                                name="external-link"
                                                mx="3px"
                                              />
                                            </Link>
                                            <FormHelperText mt={0}>
                                              in {source}{" "}
                                              {ambiguous
                                                ? "(Ambiguous)"
                                                : "(Certain)"}
                                            </FormHelperText>
                                          </Box>
                                        )
                                      )}
                                    </AccordionPanel>
                                  </AccordionItem>
                                )
                              )}
                            </Box>
                          ))}
                      </Accordion>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </FormControl>
            </Box>
          </Box>
        )}
        {result && result.type && result.type === "Empty" && (
          <Stack>
            <Alert
              status="warning"
              variant="subtle"
              flexDirection="column"
              justifyContent="center"
              textAlign="center"
              height="200px"
              mt={6}
            >
              <AlertIcon size="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                No results
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                Your search for{" "}
                <Text as="b" wordBreak="break-word">
                  {search}{" "}
                  <Text fontWeight="normal" as="span">
                    by{" "}
                  </Text>
                  {authors && authors.length
                    ? authors.join(", ")
                    : "all authors"}
                </Text>{" "}
                in{" "}
                <Text as="b" wordBreak="break-word">
                  {timeSpanLabel}
                </Text>
                <Text as="span"> yielded no results in our database.</Text>
              </AlertDescription>
            </Alert>
            <GatsbyLink to="/" style={{ width: "100%" }}>
              <Button mt={[5, 6]} width="100%">
                Search again
              </Button>
            </GatsbyLink>
          </Stack>
        )}
        {error && (
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            justifyContent="center"
            textAlign="center"
            height="200px"
            mt={6}
          >
            <AlertIcon size="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Error
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              There was a problem submitting your query, please try again later.
            </AlertDescription>
          </Alert>
        )}
      </Box>
    </Flex>
  )
}

export default ResultsPage
