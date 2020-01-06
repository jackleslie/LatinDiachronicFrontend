import { useState } from "react"

export default function useSet() {
  const [state, setState] = useState(new Set())

  function setAdd(value) {
    setState(new Set([...state, value]))
  }

  function setDelete(value) {
    state.delete(value)
    setState(new Set([...state]))
  }

  function setClear() {
    setState(new Set())
  }

  return [state, setAdd, setDelete, setClear]
}
