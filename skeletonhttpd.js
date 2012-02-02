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
		this.express.get('/skel',function(req,res){
			res.send('POST this URL with the parameters and hubot will print out a JSON array to your adapter.');
		});

		this.express.post('/skel',function(req,res){
			flow.pubsub.emit('skeleton',req.body);
			res.send('Received');
		});
	},
	setUpHubot: function(){
		this.robot.hear('',function(msg){
			flow.pubsub.removeAllListeners('skeleton');
			flow.pubsub.on('skeleton',function(payload){
				msg.send(JSON.stringify(payload));
			});
		});
	}
}
