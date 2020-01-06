import React from "react"
import { Tag, TagLabel, TagCloseButton } from "@chakra-ui/core"
import PropTypes from "prop-types"

export default function Author({ children, close, ...props }) {
  return (
    <Tag size="sm" mt={3} mr={2}>
      <TagLabel>{children}</TagLabel>
      <TagCloseButton onClick={close} />
    </Tag>
  )
}

Author.propTypes = {
  children: PropTypes.node.isRequired,
  close: PropTypes.func.isRequired,
}
