const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // I - text, callback
  // O -

  counter.getNextUniqueId((err, idStr)=>{
    if (err) {
      callback(null, 0);
    } else {
      // use fs to write text to new file
      let filePath = exports.dataDir + '/' + idStr + '.txt';
      fs.writeFile(filePath, text, (err, data)=>{
        if (err) {
          callback(null, 0);
        } else {
          callback(null, {id: idStr, text: text});
        }
      });
    }

  });
};

exports.readAll = (callback) => {
  // I - callback function
  // O - return array objects {id:, text:}

  // Read dataDir
  let filePath = exports.dataDir + '/';
  var data = _.map(fs.readdir(filePath, (err, files) => {
    if (err) {
      callback (null, 0);
    } else {
      for (let file of files) {
        let val = file.substring(0, file.indexOf('.'));
        file = {id: val, text: val};
        data.push(file);
      }
      callback(null, data);
    }
  }));
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
