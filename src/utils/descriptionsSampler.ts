import * as fs from 'fs'
import * as path from 'path'
import YAML from 'yaml'

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
  code: string
  score: string
  request_digits: '6' | '8'
  normalised_code?: string
}

export class DescriptionSampler {
  private static readonly SAMPLING_CONFIGURATION_FILE = path.join(__dirname, '../config/descriptionSampling.yaml')
  private static readonly DESCRIPTIONS_FILE = path.join(__dirname, '../data/descriptions.json')

  descriptions: Description[] = []

  sample (): Description {
    const description = this.descriptions[Math.floor(Math.random() * this.descriptions.length)]

    return description
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
        const score = parseFloat(description.score)

        return score >= scoreRangeStart && score <= scoreRangeEnd
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
      console.error('Failed to load configuration:', err)
      throw err
    }
  }

  // TODO: Eventually we can load these from the database
  private static async loadDescriptions (): Promise<Description[]> {
    try {
      const data = await fs.promises.readFile(DescriptionSampler.DESCRIPTIONS_FILE, 'utf8')
      return JSON.parse(data) as Description[]
    } catch (err) {
      console.error('Failed to load descriptions:', err)
      throw err
    }
  }
}
