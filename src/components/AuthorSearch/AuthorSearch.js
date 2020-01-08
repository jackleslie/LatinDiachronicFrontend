import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import Autosuggest from "react-autosuggest"
import { Input, Box, Text } from "@chakra-ui/core"

import "./react-autosuggest.css"
// import styles from "./authorSearch.module.css"
import { Author } from "../"
import { useSet } from "../../hooks"

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function getSuggestions(data, value) {
  const escapedValue = escapeRegexCharacters(value.trim()).toLowerCase()

  if (escapedValue === "") {
    return []
  }

  return data
    .map(section => {
      return {
        title: section.title,
        data: section.data
          .filter(element => element.name.toLowerCase().includes(escapedValue))
          .slice(0, 10),
      }
    })
    .filter(section => section.data.length > 0)
}

function getSuggestionValue(suggestion) {
  return suggestion.name
}

function renderSuggestion(suggestion) {
  return <Text>{suggestion.name}</Text>
}

function renderSuggestionsContainer({ containerProps, children, query }) {
  return <Box {...containerProps}>{children}</Box>
}

function renderSectionTitle(section) {
  return null
}

function renderInputComponent(inputProps) {
  return (
    <Input
      type="author"
      id="author"
      aria-describedby="author-helper-text"
      {...inputProps}
    />
  )
}

function getSectionSuggestions(section) {
  return section.data
}

const AuthorSearch = ({ authors, onUpdate }) => {
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [chosen, chosenAdd, chosenDelete] = useSet()

  useEffect(() => {
    onUpdate(Array.from(chosen))
  }, [chosen, onUpdate])

  let data = [
    {
      title: "Authors",
      data: authors,
    },
  ]

  const onChange = (event, { newValue }) => {
    setValue(newValue)
  }

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(data, value))
  }

  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  }

  function onSuggestionSelected(event, { suggestionValue }) {
    chosenAdd(suggestionValue)
    setValue("")
  }

  const inputProps = {
    value,
    onChange,
  }

  return (
    <Box>
      <Autosuggest
        multiSection={true}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSuggestionsContainer={renderSuggestionsContainer}
        renderSectionTitle={renderSectionTitle}
        getSectionSuggestions={getSectionSuggestions}
        inputProps={inputProps}
        renderInputComponent={renderInputComponent}
      />
      {chosen.size > 0 && (
        <Box>
          {[...chosen].map(author => (
            <Author key={author} close={() => chosenDelete(author)}>
              {author}
            </Author>
          ))}
        </Box>
      )}
    </Box>
  )
}

AuthorSearch.propTypes = {
  authors: PropTypes.arrayOf(PropTypes.object),
  onUpdate: PropTypes.func.isRequired,
}

AuthorSearch.defaultProps = {
  authors: [],
}

export default AuthorSearch
