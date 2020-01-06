import React from "react"
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

function IndexPage() {
  return (
    <Flex justify="center">
      <Box p={8}>
        <Heading mb={4} textAlign="center">
          Latin Diachronic Frontend
        </Heading>
        <Stack spacing={3}>
          <FormControl>
            <FormLabel htmlFor="author">Author</FormLabel>
            <Input
              type="author"
              id="author"
              aria-describedby="author-helper-text"
            />
            <FormHelperText id="author-helper-text">
              Enter as many authors as you'd like, or leave blank to search all
              authors.
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="lemma">Lemma</FormLabel>
            <Input
              type="lemma"
              id="lemma"
              aria-describedby="lemma-helper-text"
            />
            <FormHelperText id="lemma-helper-text">
              Enter a lemma or a wordform.
            </FormHelperText>
          </FormControl>
        </Stack>
        <Flex justify="center">
          <Button mt={6} width={["80%", "50%"]}>
            Search
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}

export default IndexPage
