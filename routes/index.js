var request = require('request');
var express = require('express');
var router = express.Router();

var apikey = process.env.APIKEY;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'IIIF Split Image Demo | Harvard Art Museums' });
});

// GET courtyard page
router.get('/courtyard/:screen_number', function(req, res, next) {
  var imagePart;
  var bezelSize = 10;
  var screenGapSize = 100;
  var screenNumber = req.params.screen_number || 1;
  var objectID = req.query.object || '330590';

  // Get the object info
  var objectURL = 'http://api.harvardartmuseums.org/object/' + objectID + '?apikey=' + apikey;
  request(objectURL, function(error, response, body) {
  	var o = JSON.parse(body);
  	
  	if (!o.error) {
		if (o.images.length > 0) {
		  	// Get the image info
		  	var imageInfoURL = o.images[0].iiifbaseuri + '/info.json';
		    request(imageInfoURL, function(error, response, body) {
				var imageInfo = JSON.parse(body);

				var imageXOffset = (1080*(screenNumber-1)) + (bezelSize*(screenNumber-1)) + (screenGapSize*(screenNumber-1));

				imagePart = imageInfo['@id'] + '/' + imageXOffset + ',0,1080,1920/full/0/native.jpg';

				res.render('courtyard', {
					title: 'Courtyard Signs | IIIF Split Image Demo | Harvard Art Museums',
					image_part: imagePart
				});
			}); 
		} else {
			res.render('error', {
				title: 'Error | Harvard Art Museums',
				message: 'Bad image'
			});
		}
	} else {
		res.render('error', {
			title: 'Error | Harvard Art Museums',
			message: 'Bad object ID'
		});
	}
  });				
});

// GET lightbox page
router.get('/lightbox', function(req, res, next) {
  var objectID = req.query.object || '330590';

  // Get the object info
  var objectURL = 'http://api.harvardartmuseums.org/object/' + objectID + '?apikey=' + apikey;	
  request(objectURL, function(error, response, body) {
  	var o = JSON.parse(body);
  	
  	if (!o.error) {
		if (o.images.length > 0) {
		  	// Get the image info
		  	var imageInfoURL = o.images[0].iiifbaseuri + '/info.json';
		    request(imageInfoURL, function(error, response, body) {
				var imageInfo = JSON.parse(body);

				// Sreen info
				var bezelSize = 11;

				// Split the image across the screens
				var imageSections = new Array(9);
				var standardImageSections = new Array(9);

				console.log(imageInfo.width, imageInfo.height);

				var regionHeight = Math.round((imageInfo.height-44)/3);
				var regionWidth = Math.round(regionHeight/0.5625);

				console.log(regionWidth, regionHeight);

				var scaleFactor = (5804 - imageInfo.width)/3;
				var scaleWidth = 1920 +  Math.round(scaleFactor);

				// Top row of screens
				imageSections[0] = imageInfo['@id'] + '/0,0,1920,1080/full/0/native.jpg';
				imageSections[1] = imageInfo['@id'] + '/1942,0,1920,1080/full/0/native.jpg';
				imageSections[2] = imageInfo['@id'] + '/3884,0,1920,1080/full/0/native.jpg';

				standardImageSections[0] = imageInfo['@id'] + '/0,0,1920,1080/full/0/native.jpg';
				standardImageSections[1] = imageInfo['@id'] + '/1920,0,1920,1080/full/0/native.jpg';
				standardImageSections[2] = imageInfo['@id'] + '/3840,0,1920,1080/full/0/native.jpg';

				// Top row of screens
				imageSections[3] = imageInfo['@id'] + '/0,1102,1920,1080/full/0/native.jpg';
				imageSections[4] = imageInfo['@id'] + '/1942,1102,1920,1080/full/0/native.jpg';
				imageSections[5] = imageInfo['@id'] + '/3884,1102,1920,1080/full/0/native.jpg';

				standardImageSections[3] = imageInfo['@id'] + '/0,1080,1920,1080/full/0/native.jpg';
				standardImageSections[4] = imageInfo['@id'] + '/1920,1080,1920,1080/full/0/native.jpg';
				standardImageSections[5] = imageInfo['@id'] + '/3840,1080,1920,1080/full/0/native.jpg';

				// Top row of screens
				imageSections[6] = imageInfo['@id'] + '/0,2204,1920,1080/full/0/native.jpg';
				imageSections[7] = imageInfo['@id'] + '/1942,2204,1920,1080/full/0/native.jpg';
				imageSections[8] = imageInfo['@id'] + '/3884,2204,1920,1080/full/0/native.jpg';

				standardImageSections[6] = imageInfo['@id'] + '/0,2160,1920,1080/full/0/native.jpg';
				standardImageSections[7] = imageInfo['@id'] + '/1920,2160,1920,1080/full/0/native.jpg';
				standardImageSections[8] = imageInfo['@id'] + '/3840,2160,1920,1080/full/0/native.jpg';

				res.render('lightbox', 
				{
				  title: 'Lightbox Video Wall | IIIF Split Image Demo | Harvard Art Museums',					
				  image_part_1: imageSections[0],
				  image_part_2: imageSections[1],
				  image_part_3: imageSections[2],
				  image_part_4: imageSections[3],
				  image_part_5: imageSections[4],
				  image_part_6: imageSections[5],
				  image_part_7: imageSections[6],
				  image_part_8: imageSections[7],
				  image_part_9: imageSections[8],
				  standard_image_part_1: standardImageSections[0],
				  standard_image_part_2: standardImageSections[1],
				  standard_image_part_3: standardImageSections[2],
				  standard_image_part_4: standardImageSections[3],
				  standard_image_part_5: standardImageSections[4],
				  standard_image_part_6: standardImageSections[5],
				  standard_image_part_7: standardImageSections[6],
				  standard_image_part_8: standardImageSections[7],
				  standard_image_part_9: standardImageSections[8]
				});
			});
		} else {
			res.render('error', {
				title: 'Error | Harvard Art Museums',
				message: 'Bad image'
			});
		}
	} else {
		res.render('error', {
			title: 'Error | Harvard Art Museums',
			message: 'Bad object ID'
		});
	}
  });
});

module.exports = router;
