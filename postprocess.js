const fs = require('node:fs')

const model = 'crimbo'

function createPrompt({ requests, offers }) {
  return `requests: ${requests}
offers: ${offers}
`
}

async function go() {
  const { Ollama } = await import('ollama')

  const ollama = new Ollama()

  try {
    // Read the downloaded_filename JSON
    const requests = JSON.parse(fs.readFileSync('requests.json'))
    const offers = JSON.parse(fs.readFileSync('offers.json'))

    const offer = `[
      {
        "id": "130597",
        "name": "Hospital Bed",
        "description": "I have a hospital bed for donation. In general good working condition, except that the wire to the remote has been taped since the outer covering of the wire has worn off.",
        "location": "Pasir Ris, Simei, Tampines",
        "validTill": "07 Mar 2024",
        "ageInYears": 4,
        "dimensions": null,
        "deliveryCostsCoveredByDonor": true
      },
      {
        "id": "130967",
        "name": "Hospital Bed",
        "description": "Fully operational hospital bed with mattress and electric operated backrest",
        "location": "Harbourfront, Keppel, Sentosa, Telok Blangah",
        "validTill": "07 Mar 2024",
        "ageInYears": 3,
        "dimensions": null,
        "deliveryCostsCoveredByDonor": true
      },
      {
        "id": "131084",
        "name": "Foldable bed",
        "description": "Almost new foldable bed with built-in mattress",
        "location": "Pasir Ris, Simei, Tampines",
        "validTill": "29 Feb 2024",
        "ageInYears": 2,
        "dimensions": null,
        "deliveryCostsCoveredByDonor": true
      },
      {
        "id": "130972",
        "name": "Sofa and Dining Set",
        "description": "1) SOFA:\nLength 280cm X Width 90cm & 180cm X Height 80cm\n\n2) DINING TABLE:\nLength 140cm X Width 80cm X Height 75cm\n\nCollection of both items (Sofa & Dining set) on 20 March 2024",
        "location": "Jurong East",
        "validTill": "08 Mar 2024",
        "ageInYears": 4,
        "dimensions": "see below",
        "deliveryCostsCoveredByDonor": true
      }
    ]`

    const request = `[
      {
        "id": "131004",
        "category": "Home Furnishing",
        "name": "Daybed with mattress",
        "description": "Low income family with 5 children and 1 baby coming in March. Children are currently sleeping on foldable mattresses in the living room. Mother hopes to provide daybed with pull-out for children to sleep better.",
        "specifications": null,
        "contact": {
          "org": "Care Corner Family Service Centre - Queenstown",
          "name": "Fitrah Nabilah",
          "email": "fitrahnabilah@carecorner.org.sg",
          "phone": [
            "64761481"
          ]
        },
        "deliveryCostsCoveredByDonor": true,
        "date": "21 Feb 2024"
      },
      {
        "id": "131100",
        "category": "Home Furnishing",
        "name": "Sofa",
        "description": "Client (F/41) living in a public rental flat with 2 young children. Husband is trying to find work and family is on public assistance. Family looking for a sofa \n\nDonor to kindly cover transport arrangement and delivery cost please. Thank you!!",
        "specifications": null,
        "contact": {
          "org": "Allkin Family Service Centre @ Ang Mo Kio 230",
          "name": "Tasya Puspita Maulany",
          "email": "tasya@amkfsc.org.sg",
          "phone": [
            "64535349"
          ]
        },
        "deliveryCostsCoveredByDonor": true,
        "date": "24 Feb 2024"
      }
    ]`

    const prompt = createPrompt({ requests: request, offers: offer })
    const result = await ollama.generate({ model, prompt })
    console.log(result.response)

    // fs.writeFileSync(process.env.POSTPROCESS_FILENAME || 'matches.json',  JSON.stringify(matches, null, 2))
  } catch (e) {
    console.error(e)
  }
}

go()
  .then(() => 
    console.log('Done.')
  )
