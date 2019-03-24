'use strict';

var AWS = require('aws-sdk'),
    transcoder = new AWS.ElasticTranscoder({
        apiVersion: '2012-09-25',
        region: 'eu-west-1'
    });

exports.handler = (event, context, callback) => {
    let fileName = event.Records[0].s3.object.key;
    console.log('New video has been uploaded:', fileName);

    transcoder.createJob({
    	PipelineId: process.env.PIPELINE_ID,
    	Input: {
    		Key: fileName,
    		FrameRate: 'auto',
    		Resolution: 'auto',
    		AspectRatio: 'auto',
    		Interlaced: 'auto',
    		Container: 'auto'
    	},
    	Output: {
    		Key: getOutputName(fileName),
    		ThumbnailPattern: '{count}'+fileName,
    		PresetId: process.env.PRESET_ID,
    		Rotate: 'auto'
    	}
    }, function(err, data){
        if(err){
            console.log('Something went wrong:',err)
        }else{
            console.log('Converting is done');
        }
    	callback(err, data);
    });
};

function getOutputName(fileName){
	let withOutExtension = removeExtension(fileName);
	return withOutExtension + '.mp4';
}

function removeExtension(filename){
    let lastDotPosition = filename.lastIndexOf(".");
    if (lastDotPosition === -1) return filename;
    else return filename.substr(0, lastDotPosition);
}