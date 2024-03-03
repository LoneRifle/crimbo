import { cheerio } from "https://deno.land/x/cheerio@1.0.7/mod.ts";
import flexsearch from 'npm:flexsearch'

const { Document } = flexsearch

const ENTRIES_PER_QUERY = 9

const makeFreeItemsRequest = (query) => ({
  bestMatchEnabled: true,
  canChangeKeyword: false,
  count: ENTRIES_PER_QUERY,
  countryCode: 'SG',
  countryId: '1880251',
  filters: [
    {
      enforce: false,
      fieldName: 'collections',
      idsOrKeywords: { value: [ '1898' ] }
    },
    {
      enforce: false,
      fieldName: 'condition_v2',
      idsOrKeywords: { value: [ 'USED' ] }
    },
  ],
  includeBpEducationBanner: true,
  includeSuggestions: false,
  isCertifiedSpotlightEnabled: true,
  locale: 'en',
  prefill: { prefill_sort_by: '3' },
  query,
})

export class CarousellSession {
  csrfToken = ''
  csrfCookie = ''
  document = new Document({
    preset: 'match',
    document: {
      index: [
        'title',
      ],
      store: true,
    },
  })

  async init() {
    const response = await fetch('https://www.carousell.sg')
    const body = await response.text()
      
    const $ = cheerio.load(body)
    const { Application: { csrfToken } } = JSON.parse(
      [...$('script[type=application/json]')]
        .slice(-1)
        .flatMap(d => d.children[0].data)[0]
    )
    this.csrfTokenHeader = csrfToken
    const [csrfCookie] = response.headers
      .getSetCookie()
      .find(c => c.startsWith('_csrf'))
      .split(';')[0]
    this.csrfCookie = csrfCookie
  }

  async searchFreeItems(query) {
    // Try searching within our local index first
    const localSearchResult = this.document.search(query, { enrich: true })
    if (localSearchResult.length) {
      return localSearchResult.map(({ doc }) => doc)
    }
    const response = await fetch(
      'https://www.carousell.sg/ds/filter/cf/4.0/search/?_path=%2Fcf%2F4.0%2Fsearch%2F', 
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          cookie: '_csrf=xEA0uDNF6d_vokC-wTOwNttA; ',
          'csrf-token': 'XgaGtYGr-XJQ-0MgfIgEJkCBopgZ35YSGD9g'
        },
        body: JSON.stringify(makeFreeItemsRequest(query)),
        
      }
    )
    const { data } = await response.json()
    const matches = data.results
      .filter(({ listingCard }) => listingCard)
      .map(({ listingCard }) => listingCard)
      .filter(({ price }) => price === 'S$0')
    for (const match of matches) {
      this.document.add(match)
    }
    return matches
  }
}