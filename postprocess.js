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

const matchesPio = []
const misses = []

for (const request of requests) {
  const result = document.search(request.name, { enrich: true })
    .flatMap(({ result }) => result)
  if (result.length) {
    matchesPio.push({
      ...request,
      matches: result.map(({ doc }) => doc),
    })
  } else {
    misses.push(request)
  }
}

Deno.writeTextFileSync(
  'matches.pio.json',  
  JSON.stringify(matchesPio, null, 2)
)
