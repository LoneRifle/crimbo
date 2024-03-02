const fs = require('node:fs')

const { Document } = require('flexsearch')

const requests = JSON.parse(fs.readFileSync('requests.json'))
const offers = JSON.parse(fs.readFileSync('offers.json'))

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

for (const request of requests) {
  const result = document.search(request.name, { enrich: true })
    .flatMap(({ result }) => result)
  if (result.length) {
    matches.push({
      ...request,
      matches: result,
    })
  }
}

fs.writeFileSync(
  process.env.POSTPROCESS_FILENAME || 'matches.json',  
  JSON.stringify(matches, null, 2)
)
