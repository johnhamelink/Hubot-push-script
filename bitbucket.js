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
		this.express.get('/bitbucket',function(req,res){
			res.send('POST this URL with the payload parameter from bitbucket here.');
		});

		this.express.post('/bitbucket',function(req,res){
			flow.pubsub.emit('bitbucket/newCommit',JSON.parse(req.body.payload));
			res.send('Received');
		});
	},
	setUpHubot: function(){
		this.robot.hear('',function(msg){
			flow.pubsub.removeAllListeners('bitbucket/newCommit');
			flow.pubsub.on('bitbucket/newCommit',function(payload){
				var response = '['+payload.repository.name+'] New commit by '+payload.commits[0].author+': "'+payload.commits[0].message+'" '+payload.repository.website+payload.repository.absolute_url.'changeset/'+payload.repository.commits[0].node;
				msg.send(response);
			});
		});
	}
}
