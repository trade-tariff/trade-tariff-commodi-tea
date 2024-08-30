import { type Description } from '../utils/descriptionsSampler'

export class GoodsNomenclature {
  constructor () {
    this.sampleDescription = null
    this.goods_nomenclature_item_id = ''
    this.description = ''
    this.formattedDescription = ''
    this.ancestorDescriptions = []
  }

  sampleDescription: Description | null
  goods_nomenclature_item_id: string
  description: string
  formattedDescription: string
  ancestorDescriptions: string[]

  static build (response: any, sampleDescription: Description): GoodsNomenclature {
    const goodsNomenclature = new GoodsNomenclature()
    const attributes = response.data.attributes
    console.debug('Fetching section description')
    const sectionDescription = GoodsNomenclature.getSectionDescription(response)
    console.debug('Fetching chapter description')
    const chapterDescription = GoodsNomenclature.getChapterDescription(response)
    console.debug('Fetching heading description')
    const headingDescription = GoodsNomenclature.getHeadingDescription(response)
    console.debug('Fetching ancestor descriptions')
    const ancestorDescriptions = GoodsNomenclature.getAncestorDescriptions(response)

    let allAncestorDescriptions: string[] = [sectionDescription, chapterDescription]

    if (headingDescription !== null) { ancestorDescriptions.push(headingDescription) }

    allAncestorDescriptions = allAncestorDescriptions.concat(ancestorDescriptions)
    allAncestorDescriptions = allAncestorDescriptions.filter((description: string | null) => description !== null)

    goodsNomenclature.sampleDescription = sampleDescription
    goodsNomenclature.goods_nomenclature_item_id = attributes.goods_nomenclature_item_id
    goodsNomenclature.description = attributes.description
    goodsNomenclature.formattedDescription = attributes.formatted_description
    goodsNomenclature.ancestorDescriptions = allAncestorDescriptions
    console.debug('Goods Nomenclature')

    return goodsNomenclature
  }

  static getSectionDescription (response: any): string {
    const relation = response.data.relationships.section.data
    const included = GoodsNomenclature.lookupIncluded(response, relation)

    console.debug('Section')
    console.debug(included)

    return included.attributes.title
  }

  private static getChapterDescription (response: any): string {
    const relation = response.data.relationships.chapter.data
    const included = GoodsNomenclature.lookupIncluded(response, relation)
    console.debug('Chapter')
    console.debug(included)

    return included.attributes.formatted_description
  }

  private static getHeadingDescription (response: any): string | null {
    const relation = response.data.relationships.heading

    if (relation === undefined) { return null }

    const included = GoodsNomenclature.lookupIncluded(response, relation.data)

    console.debug(included)

    return included.attributes.formatted_description
  }

  static getAncestorDescriptions (response: any): string[] {
    console.debug('Ancestors')
    const relation = response.data.relationships.ancestors
    console.debug(relation)

    if (relation === undefined) { return [] }

    return relation.data.map((relation: any) => {
      const ancestor = GoodsNomenclature.lookupIncluded(response, relation)
      console.debug(ancestor)
      return ancestor.attributes.formatted_description
    })
  }

  static lookupIncluded (response: any, relation: any): any {
    return response.included.find((item: any) => item.id === relation.id && item.type === relation.type)
  }
}
