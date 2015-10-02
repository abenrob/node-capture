node-capture
===

NodeJS remote screen-capture module which is influenced by [Banquo](https://github.com/ajam/banquo) which in turn builds off [Depict](https://github.com/kevinschaul/depict).

This project diverges from Banquo in that it:

- uses [node-phantom-simple](https://www.npmjs.com/package/node-phantom-simple) to avoid node-phantom's socket.io world 
- drops 'scrape' option. imagery is all I'm concerned with here...
- is substantially rewritten

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
    url: 'http://www.theonion.com',
    viewport_width: 1440,
    delay: 1000,
    selector: '#in-the-news'
};

captor.capture(opts)
    .then(function(results){
        console.log(results.base64); // this is the image
    },function(err){
        console.error(err);
    })
````