class scrapController {
    connHTTP(urlHTTP){
        const request = require('request');
        const cheerio = require('cheerio');
        
        var result = [];

        request(urlHTTP, async function (err, res, body) {
        if (err) throw err;
        const $ = cheerio.load(res.body)
        const parsItem = $('.pdf>a')
        for (let i = 0; i < parsItem.contents().length; i++) { 
            if(parsItem.contents()[i].data.trim().slice(0,4) === "Меню"){ 
                result.push({
                    id: i+1,
                    title: parsItem.contents()[i].data.trim(),
                    href: `https://kst.mskobr.ru${parsItem[i].attribs.href}`
                });
            }
        }
        require('fs').writeFile(

            'content/data/lunchData.json',
        
            JSON.stringify(result),
        
            function (err) {
                if (err) {
                    console.error(err);
                } else { console.log('good parse')}
            },
        );
        });
    }
}

module.exports = new scrapController();