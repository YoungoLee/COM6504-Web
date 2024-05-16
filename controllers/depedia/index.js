const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dbpedia
 *   description: Dbpedia management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Dbpedia:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the dbpedia
 *         label:
 *           type: string
 *           description: The label of the dbpedia
 *         description:
 *           type: string
 *           description: The description of the dbpedia
 *         photo:
 *           type: string
 *           description: The photo of the dbpedia
 *         uri:
 *           type: string
 *           description: The uri of the dbpedia
 */

/**
 * @swagger
 * /dbpedia/all:
 *   get:
 *     summary: Get all Dbpedia
 *     tags: [Dbpedia]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: true
 *         description: search of the plant
 *         example: Common_sunflower
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dbpedia'
 *       500:
 *         description: Internal server error
 */
router.get('/all', async function (req, res, next) {
    if (req.query.search) {
        try {
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
      FILTER regex(?name, ".*${req.query.search}", "i")
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
                    // The results are in the 'data' object
                    res.status(200).json({
                        list: data.results.bindings.map(i => ({
                            name: i.name && i.name.value ? i.name.value : '-',
                            label: i.label && i.label.value ? i.label.value : '-',
                            description: i.abstract && i.abstract.value ? i.abstract.value : '-',
                            photo: i.depiction && i.depiction.value ? i.depiction.value : '-',
                            uri: `https://dbpedia.org/page/${req.query.search}`,
                        }))
                    });
                }).catch(error => {
                    res.status(500).json({ error })
                });
        } catch (error) {
            console.log('error', error)
            res.status(500).json({ error })
        }
    }
})

module.exports = router;