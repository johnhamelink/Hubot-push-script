module.exports = flow = {
	robot: null,
	express: null,
	pubsub: null,
	init: function(robot,express,pubsub){
		this.robot = robot;
		this.express = express;
		this.pubsub = express;
		this.setUpExpress();
		this.setUpHubot();
	},
	setUpExpress: function(){
		this.express.get('/github',function(req,res){
			res.send('POST this URL with the payload parameter from github here.');
		});

		this.express.post('/github',function(req,res){
			flow.pubsub.emit('github/newCommit',JSON.parse(req.body.payload));
			res.send('Received');
		});
	},
	setUpHubot: function(){
		this.robot.hear('',function(msg){
			flow.pubsub.removeAllListeners('github/newCommit');
			flow.pubsub.on('github/newCommit',function(payload){
				var response = '['+payload.repository.name+'] New commit by '+payload.commits[0].author.name+': "'+payload.commits[0].message+'" '+payload.commits[0].url;
				msg.send(response);
			});
		});
	}
}
