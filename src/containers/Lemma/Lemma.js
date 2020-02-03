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
import { yearLabel, timeSpanLabel } from "../../utils"

export default function Lemma({
  search,
  result,
  group,
  timeSpan,
  reference,
  handlePopoverOpen,
  setReference,
  ...props
}) {
  return (
    <Box>
      <Text textAlign="center" fontSize={["18px", "22px"]}>
        Results for <b>{search}</b>
      </Text>
      <Box mt={4}>
        <Flex flexWrap="wrap">
          <Stat mt={3} mb={2} pr={0} textAlign="center" flexBasis="33%">
            <StatLabel>Type</StatLabel>
            <StatNumber fontSize={["lg", "2xl"]}>{result.type}</StatNumber>
          </Stat>
          <Stat mt={3} mb={2} pr={0} textAlign="center" flexBasis="33%">
            <StatLabel>Occurrences</StatLabel>
            <StatNumber fontSize={["lg", "2xl"]}>{result.count}</StatNumber>
          </Stat>
          <Stat mt={3} mb={2} pr={0} textAlign="center" flexBasis="33%">
            <StatLabel>
              Ambiguous
              <Tooltip label="'Ambiguous occurrences' provides the number of occurrences out of the total, that are potentially affected by the presence of homographic forms belonging to multiple lemmas.">
                <Icon name="question-outline" ml="4px" />
              </Tooltip>
            </StatLabel>
            <StatNumber fontSize={["lg", "2xl"]}>{group.ambiguous}</StatNumber>
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
                {timeSpanLabel(...timeSpan)}
              </StatNumber>
            </Stat>
          )}
        </Flex>
        <FormControl mt={6}>
          <Tabs isFitted variant="soft-rounded" variantColor="gray" mt={1}>
            <TabList>
              <Tab fontSize={["sm", "md"]}>By author</Tab>
              <Tab fontSize={["sm", "md"]}>By source</Tab>
              <Tab fontSize={["sm", "md"]}>By century</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
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
                                  onOpen={() => handlePopoverOpen(line)}
                                  onClose={() => setReference(null)}
                                >
                                  <PopoverTrigger>
                                    <Link
                                      fontSize="sm"
                                      title="Click to retrieve reference"
                                    >
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
                                          {reference.link ||
                                            "Reference unavailable"}
                                        </Text>
                                      </PopoverHeader>
                                    ) : null}
                                    <PopoverBody>
                                      {reference ? (
                                        <Text
                                          fontSize="sm"
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              reference.extract ||
                                              reference.msg,
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
                                  in {source}{" "}
                                  {ambiguous ? "(Ambiguous)" : "(Certain)"}
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
                                        <Text as="cite">{reference.link}</Text>
                                      </PopoverHeader>
                                    ) : null}
                                    <PopoverBody>
                                      {reference ? (
                                        <Text
                                          fontSize="sm"
                                          dangerouslySetInnerHTML={{
                                            __html: reference.extract,
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
                                  {ambiguous ? "(Ambiguous)" : "(Certain)"}
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
                        {Object.entries(value).map(([key, value], index) => (
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
                                      onOpen={() => handlePopoverOpen(line)}
                                      onClose={() => setReference(null)}
                                    >
                                      <PopoverTrigger>
                                        <Link
                                          fontSize="sm"
                                          title="Click to retrieve reference"
                                        >
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
                                            <Text
                                              fontSize="sm"
                                              dangerouslySetInnerHTML={{
                                                __html: reference.extract,
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
                                      in {source}{" "}
                                      {ambiguous ? "(Ambiguous)" : "(Certain)"}
                                    </FormHelperText>
                                  </Box>
                                )
                              )}
                            </AccordionPanel>
                          </AccordionItem>
                        ))}
                      </Box>
                    ))}
                </Accordion>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </FormControl>
      </Box>
    </Box>
  )
}
