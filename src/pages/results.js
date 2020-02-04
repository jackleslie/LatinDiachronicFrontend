import React, { useState, useEffect } from "react"
import { Link as GatsbyLink } from "gatsby"
import {
  Flex,
  Box,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Stack,
  Text,
} from "@chakra-ui/core"
import { useQuery } from "@apollo/react-hooks"
import { SEO, Loader } from "../components"
import { Lemma, Intersection } from "../containers"
import { timeSpanLabel, generateGroup } from "../utils"
import {
  INTERSECTION_QUERY,
  LEMMA_QUERY,
  FORM_QUERY,
  WORD_TYPE_QUERY,
} from "../data"

function ResultsPage({ location }) {
  const {
    state: { authors = "", search = "", timeSpan = [-500, 600] } = {},
  } = location
  const [query, setQuery] = useState(WORD_TYPE_QUERY)
  const [result, setResult] = useState()
  const [reference, setReference] = useState()
  const [group, setGroup] = useState()
  const { loading, error, data } = useQuery(query, {
    variables: {
      search,
      authors,
      startYear: timeSpan[0],
      endYear: timeSpan[1],
      useAll: authors.length === 0,
    },
  })

  useEffect(() => {
    if (data) {
      if (data.wordType) {
        if (data.wordType === "LEMMA") {
          setQuery(LEMMA_QUERY)
        } else if (data.wordType === "FORM") {
          setQuery(FORM_QUERY)
        } else {
          setQuery(INTERSECTION_QUERY)
        }
      } else if (data.intersection) {
        if (data.intersection.length) {
          setResult({
            intersections: data.intersection,
            type: "Intersection",
          })
        } else {
          setResult({ type: "Empty" })
        }
      } else if (data.lemma) {
        if (data.lemma.count) {
          setResult({
            ...data.lemma,
            type: "Lemma",
          })
          const group = generateGroup(data.lemma)
          setGroup(group)
        } else {
          setResult({ type: "Empty" })
        }
      } else if (data.form) {
        if (data.form.count) {
          setResult({
            ...data.form,
            type: "Form",
          })
          const group = generateGroup(data.form)
          setGroup(group)
        } else {
          setResult({ type: "Empty" })
        }
      }
    }
  }, [data])

  async function handlePopoverOpen(line) {
    setReference(null)
    const data = await fetch(`/.netlify/functions/phi?line=${line}`, {
      method: "GET",
    }).then(x => x.json())
    setReference(data)
  }

  return (
    <Flex justify="center">
      <SEO title="Results" />
      <Box p={8} maxWidth="500px" width="500px">
        <Heading textAlign="center" fontSize={["24px", "36px"]}>
          <GatsbyLink to="/">Latin Diachronic Analysis</GatsbyLink>
        </Heading>

        {(loading || !result) && !error && (
          <Loader search={search} authors={authors} timeSpan={timeSpan} />
        )}
        {result &&
          result.type &&
          (result.type === "Lemma" || result.type === "Form") && (
            <Lemma
              search={search}
              result={result}
              group={group}
              timeSpan={timeSpan}
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
                  {search ? `${search} ` : "the intersection "}
                  <Text fontWeight="normal" as="span">
                    by{" "}
                  </Text>
                  {authors && authors.length
                    ? authors.join(", ")
                    : "all authors"}
                </Text>{" "}
                in{" "}
                <Text as="b" wordBreak="break-word">
                  {timeSpanLabel(...timeSpan)}
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
