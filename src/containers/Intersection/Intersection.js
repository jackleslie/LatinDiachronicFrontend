import React from "react"
import {
  Flex,
  Box,
  Heading,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
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
import { yearLabel, countAmbiguousOccurences } from "../../utils"

export default function Intersection({
  search,
  result,
  group,
  timeSpan,
  timeSpanLabel,
  reference,
  handlePopoverOpen,
  setReference,
  authors,
  ...props
}) {
  const sumReducer = (accumulator, currentValue) => accumulator + currentValue
  const ambiguous = result.intersections
    .map(intersection => countAmbiguousOccurences(intersection.occurrences))
    .reduce(sumReducer)
  const totalOccurrences = result.intersections
    .map(intersection => intersection.count)
    .reduce(sumReducer)
  return (
    <Box>
      <Box mt={4}>
        <Flex flexWrap="wrap">
          <Stat mt={3} mb={2} pr={0} textAlign="center" flexBasis="33%">
            <StatLabel>Type</StatLabel>
            <StatNumber fontSize={["lg", "2xl"]}>{result.type}</StatNumber>
          </Stat>
          <Stat mt={3} mb={2} pr={0} textAlign="center" flexBasis="33%">
            <StatLabel>Intersections</StatLabel>
            <StatNumber fontSize={["lg", "2xl"]}>
              {result.intersections.length}
            </StatNumber>
          </Stat>
          <Stat mt={3} mb={2} pr={0} textAlign="center" flexBasis="33%">
            <StatLabel>Occurrences</StatLabel>
            <StatNumber fontSize={["lg", "2xl"]}>{totalOccurrences}</StatNumber>
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
          <Stat mt={3} mb={2} pr={0} textAlign="center" flexBasis="33%">
            <StatLabel>Authors</StatLabel>
            <StatNumber fontSize={["lg", "2xl"]}>{authors.length}</StatNumber>
          </Stat>
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
              <StatNumber fontSize={["lg", "2xl"]}>{timeSpanLabel}</StatNumber>
            </Stat>
          )}
        </Flex>
        <Accordion allowMultiple mt={8}>
          {result.intersections
            .sort((a, b) =>
              a.lemma.toUpperCase() > b.lemma.toUpperCase() ? 1 : -1
            )
            .map(({ occurrences, lemma, count }, index) => (
              <AccordionItem key={index}>
                <AccordionHeader>
                  <Box flex="1" textAlign="left">
                    <Text>
                      {lemma} ({count})
                    </Text>
                    {/*
                    <FormHelperText mt={0}>
                      with {forms.length} form
                      {forms.length > 1 ? "s" : ""}
                    </FormHelperText>
                    */}
                  </Box>
                  <AccordionIcon />
                </AccordionHeader>
                <AccordionPanel pb={4}>
                  {occurrences.map(({ line, source, ambiguos }, index) => (
                    <Box mt={2} key={index}>
                      <Popover
                        onOpen={() => handlePopoverOpen(line)}
                        onClose={() => setReference(null)}
                      >
                        <PopoverTrigger>
                          <Link
                            fontSize="sm"
                            title="Click to retrieve reference"
                          >
                            {line}
                            <Icon name="search" mx="3px" size="0.75em" />
                          </Link>
                        </PopoverTrigger>
                        <PopoverContent zIndex={4}>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          {reference ? (
                            <PopoverHeader>
                              <Text as="cite">
                                {reference.link || "Reference unavailable"}
                              </Text>
                            </PopoverHeader>
                          ) : null}
                          <PopoverBody>
                            {reference ? (
                              <Text
                                fontSize="sm"
                                dangerouslySetInnerHTML={{
                                  __html: reference.extract || reference.msg,
                                }}
                              />
                            ) : (
                              <Stack align="center" width="100%">
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
                        in {source.name} by {source.author.name}{" "}
                        {ambiguos ? "(Ambiguous)" : "(Certain)"}
                      </FormHelperText>
                    </Box>
                  ))}
                </AccordionPanel>
              </AccordionItem>
            ))}
        </Accordion>
      </Box>
    </Box>
  )
}
