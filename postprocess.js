import { readJSON } from 'https://deno.land/x/flat@0.0.15/mod.ts' 

import flexsearch from 'npm:flexsearch'

const { Document } = flexsearch

const requests = await readJSON('requests.json')
const offers = await readJSON('offers.json')

const document = new Document({
  preset: 'match',
  document: {
    index: [
      'name',
    ],
    store: true,
  },
})

for (const offer of offers) {
  document.add(offer)
}

const matches = []
const misses = []

for (const request of requests) {
  const result = document.search(request.name, { enrich: true })
    .flatMap(({ result }) => result)
  if (result.length) {
    matches.push({
      ...request,
      matches: {
        passiton: result.map(({ doc }) => doc),
        carousell: [],
      },
    })
  } else {
    misses.push(request)
  }
}

Deno.writeTextFileSync(
  'matches.json',  
  JSON.stringify(matches, null, 2)
)
