const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/chat', function (req, res, next) {
  res.render('chat');
});

router.get('/detail', function (req, res, next) {
  res.render('detail');
});
router.get('/dbpedia', function (req, res, next) {
  res.render('dbpedia');
});

router.get('/dbpedia/data', function (req, res, next) {
  if (req.query.search) {
    // The DBpedia SPARQL endpoint URL
    const endpointUrl = 'https://dbpedia.org/sparql';
    // The DBpedia resource to retrieve data from
    const resource = `http://dbpedia.org/resource/${req.query.search}`;

    // The SPARQL query to retrieve data for the given resource
    const sparqlQuery = ` 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    
    SELECT ?label ?name ?abstract ?alt ?caption ?comment ?url ?depiction
    WHERE {
      <${resource}> rdfs:label ?label .
      OPTIONAL {<${resource}> dbp:name ?name .}
      OPTIONAL {<${resource}> dbo:abstract ?abstract .}
      OPTIONAL {<${resource}> dbo:alt ?alt .}
      OPTIONAL {<${resource}> dbo:caption ?caption .}
      OPTIONAL {<${resource}> foaf:depiction  ?depiction.}
      OPTIONAL {<${resource}> dbp:url ?url .}
      FILTER (langMatches(lang(?label), "en")) .
      FILTER (!bound(?name) || langMatches(lang(?name), "en")) .
      FILTER (!bound(?abstract) || langMatches(lang(?abstract), "en")) .
      FILTER (!bound(?alt) || langMatches(lang(?alt), "en")) .
      FILTER (!bound(?caption) || langMatches(lang(?caption), "en")) .
    }`;
    // Encode the query as a URL parameter
    const encodedQuery = encodeURIComponent(sparqlQuery);
    // Build the URL for the SPARQL query
    const url = `${endpointUrl}?query=${encodedQuery}&format=json`;
    // Use fetch to retrieve the data
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('resource', JSON.stringify(data));
        // The results are in the 'data' object
        res.status(200).json({ list: data.results.bindings });
      }).catch(err => {
        console.log(err)
      });
  }
});

module.exports = router;
