//this file is used by browserify to create the nlp.js file
//the nlp.js file is used to add nlp as a global variable

var nlp = require("compromise/builds/compromise");
global.window.nlp = nlp; 