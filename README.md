node-capture
===

NodeJS remote screen-capture module which builds off [Banquo](https://github.com/ajam/banquo) which in turn builds off [Depict](https://github.com/kevinschaul/depict).

This project diverges from Banquo in that it:

- uses [node-phantom-simple](https://www.npmjs.com/package/node-phantom-simple) to avoid node-phantom's socket.io world 
- uses [phantomjs-webfonts](https://www.npmjs.com/package/phantomjs-webfonts) to allow rendering of webfonts
- drops 'scrape' option. imagery is all I'm concerned with here...

### Installation

To install as a dependency in your `package.json`.

````
npm install node-capture --save
````

### Usage

````js
var captor = require('node-capture');

var opts = {
    mode: 'base64',
    url: 'http://www.theonion.com/section/science-technology/',
    viewport_width: 1440,
    delay: 1000,
    selector: '#in-the-news'
};

captor.capture(opts, function(err, imageData){
    if (err) {
     console.log(err)
    }
    console.log(imageData);
});
````