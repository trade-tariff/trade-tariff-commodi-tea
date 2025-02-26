import * as fs from 'fs'
import * as path from 'path'
import YAML from 'yaml'

import { logger } from '../config/logging'
import { findCommodityCodes } from '../services/fpoSearchService'

interface SamplingConfig {
  name: string
  percentage: number
  range: [number, number]
}

interface SamplingConfiguration {
  score: SamplingConfig[]
}

export interface Description {
  request_description: string
  code?: string
  score?: number
  request_digits: number
}

export class DescriptionSampler {
  private static readonly SAMPLING_CONFIGURATION_FILE = path.join(__dirname, '../config/descriptionSampling.yaml')
  private static readonly DESCRIPTIONS_FILE = path.join(__dirname, '../data/descriptions.json')

  descriptions: Description[] = []

  sample (): Description {
    let description
    let attempts = 0
    const maxAttempts = 10

    do {
      description = this.descriptions[Math.floor(Math.random() * this.descriptions.length)]
      attempts++
    } while (description.code === undefined && attempts < maxAttempts)

    return description
  }

  async updateCodes (description: Description, digits: number = 8): Promise<Description> {
    const result = await findCommodityCodes(description.request_description, digits, 1)

    if (result.length > 0) {
      return {
        ...description,
        request_digits: digits,
        code: result[0].code,
        score: result[0].score
      }
    } else {
      return {
        request_description: description.request_description,
        request_digits: digits,
        code: undefined,
        score: undefined
      }
    }
  }

  static async build (): Promise<DescriptionSampler> {
    const descriptions = await DescriptionSampler.loadDescriptions()
    const configuration = await DescriptionSampler.loadConfiguration()
    const sampler = new DescriptionSampler()

    let allSampledDescriptions: Description[] = []

    configuration.score.forEach(config => {
      const scoreRangeStart = config.range[0]
      const scoreRangeEnd = config.range[1]
      const percentage = config.percentage

      let sampledDescriptions: Description[] = descriptions.filter(description => {
        const score = description.score

        return score !== undefined && score >= scoreRangeStart && score <= scoreRangeEnd
      })

      sampledDescriptions = sampledDescriptions.slice(
        0,
        Math.floor(
          descriptions.length * percentage / 100
        )
      )
      allSampledDescriptions = allSampledDescriptions.concat(sampledDescriptions)
    })

    sampler.descriptions = allSampledDescriptions

    return sampler
  }

  private static async loadConfiguration (): Promise<SamplingConfiguration> {
    try {
      const data = await fs.promises.readFile(DescriptionSampler.SAMPLING_CONFIGURATION_FILE, 'utf8')

      return YAML.parse(data)
    } catch (err) {
      logger.error('Failed to load configuration:', err)
      throw err
    }
  }

  // TODO: Eventually we can load these from the database
  private static async loadDescriptions (): Promise<Description[]> {
    try {
      const data = await fs.promises.readFile(DescriptionSampler.DESCRIPTIONS_FILE, 'utf8')
      return JSON.parse(data) as Description[]
    } catch (err) {
      logger.error('Failed to load descriptions:', err)
      throw err
    }
  }
}
