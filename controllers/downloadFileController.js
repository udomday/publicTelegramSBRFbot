class downloadFileController {
    downloadLunch(id, title, href) {
        const https = require('https'); // or 'https' for https:// URLs
        const fs = require('fs');

        const file = fs.createWriteStream(`./content/file/${title}-${id}.pdf`);
        const request = https.get(href, function(response) {
            response.pipe(file);

            file.on("finish", () => {
            file.close();
            console.log("Download Completed");
            });
        });
    }
}

module.exports = new downloadFileController();