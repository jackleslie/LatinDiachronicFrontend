export function yearLabel(value) {
  if (value < 0) {
    return `${Math.abs(value) / 100} BCE`
  }
  return `${Math.abs(value) / 100} CE`
}

export function countAmbiguousOccurences(result) {
  return result.occurrences.reduce((total, occ) => (total += occ.ambiguos), 0)
}
