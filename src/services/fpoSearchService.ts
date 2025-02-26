import config from '../config/configs'
import { logger } from '../config/logging'

interface FpoSearchFindCommodityCodeResult {
  code: string
  score: number
}

interface FpoSearchFindCommodityCodesResponse {
  results: FpoSearchFindCommodityCodeResult[]
}

export async function findCommodityCodes (description: string, digits: number = 8, limit: number = 5): Promise<FpoSearchFindCommodityCodeResult[]> {
  const request = {
    description,
    digits,
    limit
  }

  logger.debug(`Fpo search on ${config.fpoSearch.baseUrl} with key ${config.fpoSearch.apiKey}`)

  try {
    const response = await fetch(config.fpoSearch.baseUrl, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': config.fpoSearch.apiKey
      }
    })

    const result = await response.json() as FpoSearchFindCommodityCodesResponse

    logger.debug('Result : ', result)
    return result.results
  } catch (e) {
    throw new Error('Error getting commodity codes', { cause: e })
  }
}
