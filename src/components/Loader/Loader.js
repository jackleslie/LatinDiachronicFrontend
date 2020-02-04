import React from "react"
import { Stack, Spinner, Text } from "@chakra-ui/core"
import PropTypes from "prop-types"
import { timeSpanLabel } from "../../utils"

export default function Loader({ search, authors, timeSpan, ...props }) {
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
        {search ? (
          <Text as="span">
            Searching <Text as="b">{search} </Text>
          </Text>
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
          {timeSpanLabel(...timeSpan)}
        </Text>
      </Text>
    </Stack>
  )
}

Loader.propTypes = {
  search: PropTypes.string.isRequired,
  authors: PropTypes.arrayOf(PropTypes.string).isRequired,
  timeSpan: PropTypes.arrayOf(PropTypes.number).isRequired,
}
