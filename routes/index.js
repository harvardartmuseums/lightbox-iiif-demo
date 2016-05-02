var request = require('request');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET lightbox page
router.get('/lightbox', function(req, res, next) {
  var objectID = req.query.object || '330590';

  // Get the object info
  var objectURL = 'http://api.harvardartmuseums.org/object/' + objectID + '?apikey=2898df20-7867-11e5-8bd0-3f3d7a19b916';
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

				console.log(imageInfo.width, imageInfo.height);

				var regionHeight = Math.round((imageInfo.height-44)/3);
				var regionWidth = Math.round(regionHeight/0.5625);

				console.log(regionWidth, regionHeight);

				var scaleFactor = (5804 - imageInfo.width)/3;
				var scaleWidth = 1920 +  Math.round(scaleFactor);

				// Top row of screens
				imageSections[0] = imageInfo['@id'] + '/0,0,1920,1080/full/0/native.jpg';
				imageSections[1] = imageInfo['@id'] + '/1942,0,1920,1080/full/0/native.jpg';
				imageSections[2] = '';

				// Top row of screens
				imageSections[3] = imageInfo['@id'] + '/0,1102,1920,1080/full/0/native.jpg';
				imageSections[4] = imageInfo['@id'] + '/1942,1102,1920,1080/full/0/native.jpg';
				imageSections[5] = '';

				// Top row of screens
				imageSections[6] = imageInfo['@id'] + '/0,2204,1920,1080/full/0/native.jpg';
				imageSections[7] = imageInfo['@id'] + '/1942,2204,1920,1080/full/0/native.jpg';
				imageSections[8] = '';

				res.render('lightbox', 
				{
				  image_part_1: imageSections[0],
				  image_part_2: imageSections[1],
				  image_part_3: imageSections[2],
				  image_part_4: imageSections[3],
				  image_part_5: imageSections[4],
				  image_part_6: imageSections[5],
				  image_part_7: imageSections[6],
				  image_part_8: imageSections[7],
				  image_part_9: imageSections[8]
				});
			});
		} else {
			res.render('error', {message: 'Bad image'});
		}
	} else {
		res.render('error', {message: 'Bad object ID'});
	}
  });
});

module.exports = router;