export function yearLabel(value) {
  if (value < 0) {
    return `${Math.abs(value) / 100} BCE`
  }
  return `${Math.abs(value) / 100} CE`
}

export function timeSpanLabel(startYear, endYear) {
  return `${yearLabel(startYear)} - ${yearLabel(endYear)}`
}

export function countAmbiguousOccurences(occurrences) {
  return occurrences.reduce((total, occ) => (total += occ.ambiguos), 0)
}

export function generateGroup(result) {
  return result.occurrences.reduce(
    (x, occurrence) => {
      const authorName = occurrence.source.author.name
      const sourceName = occurrence.source.name
      const start = occurrence.source.author.timeSpan.start
      const end = occurrence.source.author.timeSpan.end

      const authorsEntry = {
        line: occurrence.line,
        source: sourceName,
        ambiguous: occurrence.ambiguos,
      }

      // authors
      if (x.authors[authorName]) {
        x.authors[authorName].occurrences.push(authorsEntry)
        if (!x.authors[authorName].sources.includes(sourceName)) {
          x.authors[authorName].sources.push(sourceName)
        }
      } else {
        x.authors[authorName] = {}
        x.authors[authorName].occurrences = [authorsEntry]
        x.authors[authorName].sources = [sourceName]
      }

      const sourceEntry = {
        line: occurrence.line,
        ambiguous: occurrence.ambiguos,
      }

      // sources
      if (x.sources[sourceName]) {
        x.sources[sourceName].occurrences.push(sourceEntry)
      } else {
        x.sources[sourceName] = {}
        x.sources[sourceName].occurrences = [sourceEntry]
        x.sources[sourceName].author = authorName
      }

      const centuriesEntry = {
        line: occurrence.line,
        source: sourceName,
        ambiguous: occurrence.ambiguos,
      }

      // centuries (start)
      if (x.centuries[start] && x.centuries[start][authorName]) {
        x.centuries[start][authorName].occurrences.push(centuriesEntry)
        if (!x.centuries[start][authorName].sources.includes(sourceName)) {
          x.centuries[start][authorName].sources.push(sourceName)
        }
      } else {
        x.centuries[start] = { ...x.centuries[start] }
        x.centuries[start][authorName] = {}
        x.centuries[start][authorName].occurrences = [centuriesEntry]
        x.centuries[start][authorName].sources = [sourceName]
      }

      // centuries (end)
      if (x.centuries[end] && x.centuries[end][authorName]) {
        x.centuries[end][authorName].occurrences.push(centuriesEntry)
        if (!x.centuries[end][authorName].sources.includes(sourceName)) {
          x.centuries[end][authorName].sources.push(sourceName)
        }
      } else {
        x.centuries[end] = { ...x.centuries[end] }
        x.centuries[end][authorName] = {}
        x.centuries[end][authorName].occurrences = [centuriesEntry]
        x.centuries[end][authorName].sources = [sourceName]
      }

      return x
    },
    {
      authors: {},
      sources: {},
      centuries: {},
      ambiguous: countAmbiguousOccurences(result.occurrences),
    }
  )
}

export function prettifyAuthors(authors) {
  return authors.map(author => {
    if (author === "EPIGRAPHS") {
      return "Epigraph authors"
    }
    return author
  }).join(", ")
}