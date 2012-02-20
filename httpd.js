module.exports = function(robot){
	var events  = require('events').EventEmitter;
	var pubsub  = new events();
	var express = require('express');
	express     = express.createServer(express.logger(),express.bodyParser());

    var github  = require('./github.js').init(robot,express,pubsub),
    bitbucket   = require('./bitbucket.js').init(robot,express,pubsub),
    skeleton    = require('./skeletonhttpd.js').init(robot,express,pubsub),
    cloudkick   = require('./cloudkick.js').init(robot,express,pubsub);

	pubsub.setMaxListeners(1);
    express.listen(1337);
};
