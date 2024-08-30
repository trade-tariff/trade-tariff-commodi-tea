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

    try {
      response = await this.client.get(`${GoodsNomenclatureClient.SEARCH_PATH}${normalisedCode}`)
    } catch (error: any) {
      if (error.response.status !== 200) {
        normalisedCode = sampleDescription.code.slice(0, 6)
        try {
          response = await this.client.get(`${GoodsNomenclatureClient.SEARCH_PATH}${normalisedCode}`)
        } catch (error: any) {
          if (error.response.status !== 200) {
            throw new Error('Not found')
          }

          response = error.response
        }
      } else {
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

      return GoodsNomenclature.build(response.data, sampleDescription)
    } catch (error: any) {
      throw new Error('Not found')
    }
  }

  static build (): GoodsNomenclatureClient {
    const client = new GoodsNomenclatureClient(GoodsNomenclatureClient.URL)

    return client
  }
}
