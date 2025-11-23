# Oscar's kinch ranks API
A simple API providing global kinch rankings and scores of all countries.

# Documentation
- All data is stored in static JSON files.
- I don't want to pay for hosting, as doing so has the potential to cost a great deal of money.

The API provides three different types of JSON:

- `data/kinch.json`. The "godfather" file. All kinch data for all kinch countries is in this file. You can access it by navigating to [`https://raw.githubusercontent.com/owelton-rosie/kinch-api/main/data/kinch.json`](https://raw.githubusercontent.com/owelton-rosie/kinch-api/main/data/kinch.json).

- `data/countries/country.json`. Each country has its own JSON file. The names are pulled from the [ISO alpha-2 country codes](en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements). You can access any country's JSON file by navigating to `raw.githubusercontent.com/owelton-rosie/kinch-api/main/data/countries/ISO.json`. For example, to access the New Zealands's JSON, naviagte to [`raw.githubusercontent.com/owelton-rosie/kinch-api/main/data/countries/nz.json`](raw.githubusercontent.com/owelton-rosie/kinch-api/main/data/countries/nz.json). **Note that only countries with an NR in at least one event are captured in the API!**

- `data/topx.json`. There are JSON files that contain only the top x countries. The files are as of follows:
   - top 3 (`data/top3.json`)
   - top 5 (`data/top5.json`)
   - top 10 (`data/top10.json`)
   - top 20 (`data/top20.json`)
   - top 30 (`data/top30.json`)
   - top 40 (`data/top40.json`)
   - top 50 (`data/top50.json`)
   - top 100 (`data/top100.json`)

Note that all country codes are case-insensitive - `data/countries/NZ.json` will lead to `data/countries/nz.json`.

## What data does the API provide?
The API provides the following data:
- "rank": the country's global rank
- "country": the country's full name
- "code": the country's ISO alpha-2 code
- "flag": the country's Twemoji flag
- "overall": the country's overall score
- "scores": the country's scores in each event

## JSON exceprt
A country's JSON would look something like this:
```
{
  "rank": 9,
  "country": "New Zealand",
  "code": "nz",
  "flag": "https://twemoji.maxcdn.com/v/latest/72x72/1f1f3-1f1ff.png",
  "overall": 75.5,
  "scores": {
    "222": 68.75,
    "333": 65,
    "444": 80.12,
    "555": 76.88,
    "666": 76.21,
    "777": 74.66,
    "333bf": 68.17,
    "333fm": 88.09,
    "333oh": 91.15,
    "clock": 100,
    "minx": 90.6,
    "pyram": 82.14,
    "skewb": 60.62,
    "sq1": 81.95
  }
}
```

## Getting help
Most of the data is pretty self-explanatory, but if you encounter problems, feel free to [contact me](https://oweltonrosie.com/contact). Likewise, if you want to give feedback on the API, feel free to [contact me](https://oweltonrosie.com/contact).