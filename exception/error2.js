const fs = require('fs');

setInterval(() => {
    fs.unlink('./abcedfg.js', (err) => {
        if (err) {
            console.error(err);
        }
    });
}, 1000);