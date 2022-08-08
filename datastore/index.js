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
  // I - id & callback function

  // call fs read file on file id
  let filePath = exports.dataDir + '/' + id + '.txt';
  // console.log(filePath);
  fs.readFile(filePath, 'utf8', (err, data)=>{
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback (null, {id: id, text: data});
    }
  });
};

exports.update = (id, text, callback) => {
  // I - id, text, callback

  let filePath = exports.dataDir + '/' + id + '.txt';
  // find the file with readFile
  fs.readFile(filePath, 'utf8', (err, data)=> {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      // call write File to overwrite
      fs.writeFile(filePath, text, (err, data)=>{
        if (err) {
          callback(new Error(`Overwrite at ${id} failed`));
        } else {
          callback(null, {id: id, text: text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // I - id, callback

  // find file path
  let filePath = exports.dataDir + '/' + id + '.txt';
  fs.unlink(filePath, (err)=>{
    if (err) {
      // report an error if item not found
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback (null, console.log('Delete successful'));
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
