module.exports = function(robot){
	var events = require('events').EventEmitter;
	var pubsub = new events();
	pubsub.setMaxListeners(1);
	var express = require('express');
	express = express.createServer(express.logger(),express.bodyParser());
	
	var github = require('./github.js').init(robot,express,pubsub),
	    skeleton = require('./skeletonhttpd.js').init(robot,express,pubsub);
	express.listen(1337);
};
