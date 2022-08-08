const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  // I - callback function that takes in params err & id
  // O - returns uniqueId as a zero padded string

  // read counter.txt file
  // I - callback function that takes in err & data of file text
  // if no file, set err to null & counter starts at 0, else set counter to number in data file
  // call the callback function to set error to null, and set id equal to param counter to a zeroPaddedNumber
  readCounter((err, counter)=> {
    if (err) {
      callback (null, 0);
    } else {
      // test: should update the counter file with the next value
      // call writeCounter
      // I - integer count, callback function
      // pass in counter + 1 for count, define callback function
      // if err, callback err = null and id response = 0
      // else, callback function set err = null, id = numStr which is a zeroPaddedNumber of the incremented counter

      writeCounter(counter + 1, (err, numStr)=>{
        if (err) {
          callback(null, 0);
        } else {
          callback(null, numStr);
        }
      });
    }
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
