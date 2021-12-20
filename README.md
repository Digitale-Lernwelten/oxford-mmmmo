# MMMMO
**Mechthild's Medieval Mystical Manuscripts Online**

Hosted via GitHub Pages.

Website available at: https://digitale-lernwelten.github.io/oxford-mmmmo/

## About

The aim of this project is to create an interactive map that shows manuscript transmissions of the *Liber specialis gratiae* by Mechtilde of Hackeborn in the Middle Ages. The map displays manuscripts, including their relocations and dependencies among each other, as well as the libraries in which they are located today.

The data can be filtered by year, monastic orders and language of the handwritings (Upper, Middle and Lower German, Latin, other languages). More information can be found on the website itself.

## Technology

This website uses [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) to implement the map view and display map data. It also uses the [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/) to implement a search function to allow searching for specific manuscripts and libraries.

All manuscripts are stored in a Google Sheet, so data can easily be acccessed, added and edited. The data is imported using [PapaParse](https://www.papaparse.com/) and formatted to valid geojson sources, which can be added to the map. Data is imported and formatted when loading the site, so changes to the Google Sheet will be instantly visible without recompiling. Description and background texts that are available in the sidebar are also stored in the Google Sheet, so they are easily editable and no additional CMS is required.

Everything else is HTML, CSS and JS only. No additional frameworks, bundlers or packages are used to reduce maintenance and allow for an easy deployment process as a static site via GitHub Pages.

## Acknowledgements

Project funded by the British Academy.

Project and content management: Dr. Linus Ubl (University of Oxford)

Technical design and implementation: Lauritz Brinkmann (Digitale Lernwelten)

Source of historical map data: https://github.com/aourednik/historical-basemaps (GPL-3.0)
