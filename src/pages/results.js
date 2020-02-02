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
  Button,
  Stack,
  Text,
} from "@chakra-ui/core"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { SEO } from "../components"
import { Lemma, Intersection } from "../containers"
import { yearLabel, countAmbiguousOccurences } from "../utils"

function ResultsPage({ location }) {
  const authors = location && location.state && location.state.authors
  const search = location && location.state && location.state.search
  const timeSpan = location && location.state && location.state.timeSpan
  const INTERSECTION_QUERY = gql`
    {
      intersectionHist(
        authors: { useAll: false, list: ${JSON.stringify(authors)} }
      ) {
        occurrences {
          ambiguos
          line
          source {
            name
            author {
              name
            }
          }
        }
        lemma
        count
        #forms {
        #  count
        #  form
        #}
      }
    }
  `
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
  // if there's no lemma entered then there must be authors to intersect
  const initialQuery = search ? LEMMA_QUERY : INTERSECTION_QUERY
  const [query, setQuery] = useState(initialQuery)
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
    if (data && data.intersectionHist) {
      if (data.intersectionHist.length) {
        setResult({
          intersections: data.intersectionHist,
          type: "Intersection",
        })
        console.log(data)
      } else {
        setResult({ type: "Empty" })
      }
    } else if (data && data.lemma) {
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

        const ambiguousOccurences = countAmbiguousOccurences(
          data.lemma.occurrences
        )
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

        const ambiguousOccurences = countAmbiguousOccurences(
          data.form.occurrences
        )
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

  async function handlePopoverOpen(line) {
    setReference(null)
    const data = await fetch(`/.netlify/functions/phi?line=${line}`, {
      method: "GET",
    }).then(x => x.json())
    setReference(data)
    console.log(data)
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
              {search ? (
                <Box>
                  Searching <Text as="b">{search} </Text>
                </Box>
              ) : (
                "Calculating intersection "
              )}
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
        {result &&
          result.type &&
          (result.type === "Lemma" || result.type === "Form") && (
            <Lemma
              search={search}
              result={result}
              ambiguous={ambiguous}
              group={group}
              timeSpan={timeSpan}
              timeSpanLabel={timeSpanLabel}
              reference={reference}
              handlePopoverOpen={handlePopoverOpen}
              setReference={setReference}
            />
          )}
        {result && result.type && result.type === "Intersection" && (
          <Intersection
            search={search}
            authors={authors}
            result={result}
            timeSpan={timeSpan}
            timeSpanLabel={timeSpanLabel}
            reference={reference}
            handlePopoverOpen={handlePopoverOpen}
            setReference={setReference}
          />
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
