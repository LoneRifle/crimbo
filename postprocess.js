const fs = require('node:fs')

async function go() {
  // Read the downloaded_filename JSON
  const requests = JSON.parse(fs.readFileSync('requests.json'))
  const offers = JSON.parse(fs.readFileSync('offers.json'))


  // fs.writeFileSync(process.env.POSTPROCESS_FILENAME || 'matches.json',  JSON.stringify(matches, null, 2))
}

go()
  .then(() => 
    console.log('Done.')
  )
