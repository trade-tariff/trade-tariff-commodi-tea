import type Identification from '../models/identification'
import { logger } from '../config/logging'

export function computeScore (identifications: Identification[]): any[] {
  logger.debug('start => computeScore')
  logger.debug(identifications)
  const scoreMap = new Map<string, number>()
  identifications.forEach(d => {
    const answer = d?.answer as any
    const actualAnswer = answer?.answer
    let score = 0
    const fullName = d?.fullName ?? ''
    if (d?.state === 'completed' && actualAnswer === 'no') {
      score = 2 * (d?.score ?? 1)
    } else if ((d?.state === 'completed' && (actualAnswer === 'yes' || actualAnswer === 'maybe')) || (d?.state === 'pending' && actualAnswer === 'no')) {
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
  logger.debug('sorted scores')
  logger.debug(sortedScoreMap)
  const leaders: any[] = []
  sortedScoreMap.forEach((value, key) =>
    leaders.push({ fullName: key, score: value }))
  logger.debug('leaders')
  logger.debug(leaders)
  return leaders
}
