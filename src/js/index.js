const mod = require('./mod');

// Confirm the correct import of the external js file
const elem = document.getElementById('contents');
elem.innerHTML = `Value: ${mod.value}`;

// Load images and set html content from JS
// const imgBig = require('../../public/img/tachikoma-pixel.png');
// const imgSmall = require('../../public/img/heart.png');

// const container = document.getElementById('jsGenerated');
// container.innerHTML = `<img src="${imgBig}"> <img src="${imgSmall}">`;
