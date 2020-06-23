import React from "react"
import { Stack, Spinner, Text } from "@chakra-ui/core"
import PropTypes from "prop-types"
import { timeSpanLabel } from "../../utils"

export default function Loader({ search, authors, timeSpan, ...props }) {
  const prefix = search ? (
    <Text as="span">
      Searching <Text as="b">{search}</Text>
    </Text>
  ) : (
    "Calculating intersection"
  )

  const withEpigraphs = authors.includes('EPIGRAPHS');
  const authorsFiltered = authors.filter(author => author !== "EPIGRAPHS")

  const authorsText =
    authors && authors.length ? (
      <Text as="span">
        {search ? "by" : "of"} <Text as="b">{withEpigraphs ? authorsFiltered.join(", ") : authors.join(", ")}</Text>
      </Text>
    ) : (
      <Text as="span">
        by <Text as="b">all authors</Text>
      </Text>
    )

  const spanText = (
    <Text as="b" wordBreak="break-word">
      {timeSpanLabel(...timeSpan)}
    </Text>
  )

  return (
    <Stack align="center" mt={6} width="100%">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <Text mt={4} textAlign="center">
        {prefix} {authorsText} in {spanText}
      </Text>
    </Stack>
  )
}

Loader.propTypes = {
  search: PropTypes.string.isRequired,
  authors: PropTypes.arrayOf(PropTypes.string).isRequired,
  timeSpan: PropTypes.arrayOf(PropTypes.number).isRequired,
}
