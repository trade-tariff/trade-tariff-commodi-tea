import { type Description } from '../utils/descriptionsSampler'

export class GoodsNomenclature {
  constructor () {
    this.sampleDescription = null
    this.goods_nomenclature_item_id = ''
    this.productline_suffix = ''
    this.description = ''
    this.formatted_description = ''
    this.ancestor_descriptions = []
  }

  sampleDescription: Description | null
  goods_nomenclature_item_id: string
  productline_suffix: string
  description: string
  formatted_description: string
  ancestor_descriptions: string[]

  static build (response: any, sampleDescription: Description): GoodsNomenclature {
    const lookupIncluded = (relation: any): any => {
      return response.included.find((item: any) => item.id === relation.id && item.type === relation.type)
    }

    const goodsNomenclature = new GoodsNomenclature()
    const attributes = response.data.attributes
    const chapter = lookupIncluded(response.data.relationships.chapter.data)
    const heading = lookupIncluded(response.data.relationships.heading.data)
    const ancestors = response.data.relationships.ancestors.data
    const ancestorDescriptions: string[] = [
      chapter.attributes.formatted_description,
      heading.attributes.formatted_description
    ]
    goodsNomenclature.sampleDescription = sampleDescription
    goodsNomenclature.goods_nomenclature_item_id = attributes.goods_nomenclature_item_id
    goodsNomenclature.productline_suffix = attributes.producline_suffix
    goodsNomenclature.description = attributes.description
    goodsNomenclature.formatted_description = attributes.formatted_description

    ancestors.forEach((ancestor: any) => {
      const included = lookupIncluded(ancestor) ?? null

      if (included != null) {
        ancestorDescriptions.push(included.attributes.formatted_description as string)
      }
    })

    goodsNomenclature.ancestor_descriptions = ancestorDescriptions
    console.log(goodsNomenclature)

    return goodsNomenclature
  }
}
