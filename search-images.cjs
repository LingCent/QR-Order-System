const https = require('https');
const queries = ['nasi lemak', 'char kway teow', 'chicken satay', 'laksa', 'roti prata', 'asian shaved ice dessert'];

const fetchImages = () => {
  queries.forEach(query => {
    https.get(`https://unsplash.com/napi/search/photos?query=${encodeURI(query)}&per_page=1`, {
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.results && json.results.length > 0) {
            console.log(`${query} -> ${json.results[0].urls.regular}`);
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
