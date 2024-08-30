import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { type Description } from '../utils/descriptionsSampler'
import { GoodsNomenclature } from '../models/goodsNomenclature'

export class GoodsNomenclatureClient {
  static URL = 'https://www.trade-tariff.service.gov.uk'
  static SEARCH_PATH = '/api/v2/search?q='

  client: AxiosInstance

  constructor (url: string) {
    this.client = axios.create({
      baseURL: url,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
  }

  async get (sampleDescription: Description): Promise<GoodsNomenclature> {
    const searchResponse = await this.getEndpoint(sampleDescription)

    if (searchResponse.data.type === 'exact_search') {
      return await this.getGoodsNomenclature(searchResponse, sampleDescription)
    } else {
      throw new Error('Not found 2')
    }
  }

  private async getEndpoint (sampleDescription: Description): Promise<any> {
    const isHeading = (sampleDescription.code.length === 6 && sampleDescription.code.endsWith('00')) ||
      (sampleDescription.code.length === 8 && sampleDescription.code.endsWith('0000'))
    let response: AxiosResponse
    let normalisedCode = isHeading ? sampleDescription.code.slice(0, 4) : sampleDescription.code
    console.debug(`Searching for ${normalisedCode}`)

    try {
      response = await this.client.get(`${GoodsNomenclatureClient.SEARCH_PATH}${normalisedCode}`)
    } catch (error: any) {
      console.debug(`Error: ${error.response.status}`)
      console.debug(error.response)
      if (error.response.status !== 200) {
        normalisedCode = sampleDescription.code.slice(0, 6)
        try {
          response = await this.client.get(`${GoodsNomenclatureClient.SEARCH_PATH}${normalisedCode}`)
        } catch (error: any) {
          console.debug(`Second error: ${error.response.status}`)
          console.debug(error.response)
          if (error.response.status !== 200) {
            throw new Error('Not found')
          }

          response = error.response
        }
      } else {
        console.debug('Failed to find endpoint')
        throw new Error('Not found')
      }
    }

    sampleDescription.normalised_code = normalisedCode
    return response.data
  }

  private async getGoodsNomenclature (searchResponse: any, sampleDescription: Description): Promise<any> {
    try {
      const endpoint: string = searchResponse.data.attributes.entry.endpoint
      const id: string = searchResponse.data.attributes.entry.id
      const response = await this.client.get(`/api/v2/${endpoint}/${id}`)
      console.debug(`Found goods nomenclature ${sampleDescription.normalised_code} search response `)
      if (sampleDescription.normalised_code !== sampleDescription.code) {
        console.debug(response)
      }

      return GoodsNomenclature.build(response.data, sampleDescription)
    } catch (error: any) {
      console.debug(sampleDescription)
      console.debug(`Failed to find goods nomenclature ${sampleDescription.normalised_code} search response `)
      console.debug(searchResponse)
      console.debug(`Error: ${error}`)
      throw new Error('Not found')
    }
  }

  static build (): GoodsNomenclatureClient {
    const client = new GoodsNomenclatureClient(GoodsNomenclatureClient.URL)

    return client
  }
}
