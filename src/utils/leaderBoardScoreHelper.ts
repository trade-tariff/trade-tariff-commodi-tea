import type Identification from '../models/identification'

export function computeScore (identifications: Identification[]): any[] {
  console.log('start => computeScore')
  console.log(identifications)
  const scoreMap = new Map<string, number>()
  identifications.forEach(d => {
    const answer = JSON.parse(d?.answer ?? '').answer
    let score = 0
    const fullName = d?.fullName ?? ''
    if (d?.state === 'completed' && answer === 'no') {
      score = 2 * (d?.score ?? 1)
    } else if ((d?.state === 'completed' && (answer === 'yes' || answer === 'maybe')) || (d?.state === 'pending' && answer === 'no')) {
      score = 1 * (d?.score ?? 1)
    }

    if (scoreMap.has(fullName)) {
      const oldScore = scoreMap.get(fullName)
      scoreMap.set(fullName, (oldScore ?? 0) + score)
    } else {
      scoreMap.set(fullName, score)
    }
  })
  const sortedScoreMap = new Map([...scoreMap.entries()].sort((a, b) => b[1] - a[1]))
  console.log('sorted scores')
  console.log(sortedScoreMap)
  const leaders: any[] = []
  sortedScoreMap.forEach((value, key) =>
    leaders.push({ fullName: key, score: value }))
  console.log('leaders')
  console.log(leaders)
  return leaders
}
