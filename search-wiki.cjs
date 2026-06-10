const https = require('https');
const images = [
    'File:Roti canai susu.jpg',
    'File:Char kway teow.JPG'
];

const fetchImages = () => {
    images.forEach(image => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(image)}&prop=imageinfo&iiprop=url&format=json`;
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const json = JSON.parse(data);
                const page = Object.values(json.query.pages)[0];
                if (page.imageinfo && page.imageinfo.length > 0) {
                    console.log(`${image} -> ${page.imageinfo[0].url}`);
                }
            });
        });
    });
};
fetchImages();
