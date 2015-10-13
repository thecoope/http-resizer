'use strict';

const util = require('util');

const express = require('express');
const extname = require('path').extname;
const sharp = require('sharp');
const superagent = require('superagent');
const urlParse = require('url').parse;

const IMAGE_TYPES = ['jpg', 'png', 'webp', 'gif', 'tiff'];

let app = express();

app.get('/resize/:width/:height/:url', (req, res) => {
  let width = Number(req.params['width']);
  let height = Number(req.params['height']);
  if (isNaN(width) || isNaN(height)) {
    res.status(400).send('width & height must be numbers');
    return;
  }

  let url = req.params['url'];
  let path = urlParse(url).path;
  let ext = extname(path).slice(1).toLowerCase();
  if (ext === 'jpeg') {
    ext = 'jpg';
  }
  if (IMAGE_TYPES.indexOf(ext) < 0) {
    res.status(400).send('Image type must be one of: ' + IMAGE_TYPES.join(', '));
    return;
  }

  getImageBuffer(url, (err, imgBuffer) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error');
      return;
    }
    sharp(imgBuffer).resize(width, height).toBuffer((err, buf) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error');
        return;
      }
      res.type(ext).send(buf);
    });
  });
});

let PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('Listening on port %d', PORT);
});

let imageCache = {};
function getImageBuffer (url, callback) {
  if (imageCache[url]) {
    return callback(null, imageCache[url]);
  }
  superagent.get(url).end((err, res) => {
    if (err) {
      return callback(err);
    }
    imageCache[url] = res.body;
    return callback(null, res.body);
  })
}

