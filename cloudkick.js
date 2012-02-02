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
		this.express.get('/cloudkick',function(req,res){
			res.send('POST this URL with the payload parameter from bitbucket here.');
		});

		this.express.post('/cloudkick',function(req,res){
			console.log(res);
			flow.pubsub.emit('cloudkick/hook',(req.body));
			res.send('Received');
		});
	},
	setUpHubot: function(){
		this.robot.hear('',function(msg){
			flow.pubsub.removeAllListeners('cloudkick/hook');
			flow.pubsub.on('cloudkick/hook',function(payload){
				var response = payload;
				//var response = '\00307[' payload.state_change.current.status ']\003 \00300' payload.state_change.current.status_details '\003 \00304'   payload.state_change.current.time;
				msg.send(response);
			});
		});
	}
}
