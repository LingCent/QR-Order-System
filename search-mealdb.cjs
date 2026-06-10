const https = require('https');
const queries = ['Nasi', 'Laksa', 'Satay', 'Canai', 'Teow', 'Dessert'];

const fetchImages = () => {
  queries.forEach(query => {
    https.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURI(query)}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.meals && json.meals.length > 0) {
            console.log(`${query} -> ${json.meals[0].strMealThumb}`);
          } else {
            console.log(`${query} -> NOT FOUND`);
          }
        } catch(e) {
          console.log(`${query} -> PARSE ERROR`);
        }
      });
    });
  });
};
fetchImages();
