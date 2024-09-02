import { type Description } from '../utils/descriptionsSampler'

export class GoodsNomenclature {
  constructor () {
    this.sampleDescription = null
    this.goodsNomenclatureItemId = ''
    this.description = ''
    this.formattedDescription = ''
    this.ancestorDescriptions = []
  }

  sampleDescription: Description | null
  goodsNomenclatureItemId: string
  description: string
  formattedDescription: string
  ancestorDescriptions: string[]

  static build (response: any, sampleDescription: Description): GoodsNomenclature {
    const goodsNomenclature = new GoodsNomenclature()
    const attributes = response.data.attributes
    const sectionDescription = GoodsNomenclature.getSectionDescription(response)
    const chapterDescription = GoodsNomenclature.getChapterDescription(response)
    const headingDescription = GoodsNomenclature.getHeadingDescription(response)
    const ancestorDescriptions = GoodsNomenclature.getAncestorDescriptions(response)

    let allAncestorDescriptions: string[] = [sectionDescription, chapterDescription]

    if (headingDescription !== null) { ancestorDescriptions.push(headingDescription) }

    allAncestorDescriptions = allAncestorDescriptions.concat(ancestorDescriptions)
    allAncestorDescriptions = allAncestorDescriptions.filter((description: string | null) => description !== null)

    goodsNomenclature.sampleDescription = sampleDescription
    goodsNomenclature.goodsNomenclatureItemId = attributes.goods_nomenclature_item_id
    goodsNomenclature.description = attributes.description
    goodsNomenclature.formattedDescription = attributes.formatted_description
    goodsNomenclature.ancestorDescriptions = allAncestorDescriptions

    return goodsNomenclature
  }

  static getSectionDescription (response: any): string {
    const relation = response.data.relationships.section.data
    const included = GoodsNomenclature.lookupIncluded(response, relation)

    return included.attributes.title
  }

  private static getChapterDescription (response: any): string {
    const relation = response.data.relationships.chapter.data
    const included = GoodsNomenclature.lookupIncluded(response, relation)

    return included.attributes.formatted_description
  }

  private static getHeadingDescription (response: any): string | null {
    const relation = response.data.relationships.heading

    if (relation === undefined) { return null }

    const included = GoodsNomenclature.lookupIncluded(response, relation.data)

    return included.attributes.formatted_description
  }

  static getAncestorDescriptions (response: any): string[] {
    const relation = response.data.relationships.ancestors

    if (relation === undefined) { return [] }

    return relation.data.map((relation: any) => {
      const ancestor = GoodsNomenclature.lookupIncluded(response, relation)
      return ancestor.attributes.formatted_description
    })
  }

  static lookupIncluded (response: any, relation: any): any {
    return response.included.find((item: any) => item.id === relation.id && item.type === relation.type)
  }
}
