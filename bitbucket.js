module.exports = flow = {
	robot: null,
	express: null,
	pubsub: null,
	bitly: null,
    // On load, inject in all the modules we need
	init: function(robot,express,pubsub){
		this.robot = robot;
		this.express = express;
		this.pubsub = pubsub;
		this.setUpExpress();
		this.setUpHubot();
	},
    // Attach routes to catch data with.
	setUpExpress: function(){
		this.express.get('/bitbucket',function(req,res){
			res.send('POST this URL with the payload parameter from bitbucket here.');
		});

		this.express.post('/bitbucket',function(req,res){
			flow.pubsub.emit('bitbucket/newCommit',JSON.parse(req.body.payload));
			res.send('Received');
		});
	},
    // When Hubot hears anything, remove all listeners, then
    // re-add the listener to get it to send a message to the adapter.
	setUpHubot: function(){
		this.robot.hear('',function(msg){
			flow.pubsub.removeAllListeners('bitbucket/newCommit');
			flow.pubsub.on('bitbucket/newCommit',function(payload){
                // Remove newlines from the commit message.
				payload.commits[0].message = payload.commits[0].message.replace(/\n/gm,"");
				var url = null;
				var Bitly = require('bitly');
				var bitly = new Bitly('s0l1dsnak3123', 'R_36bd50ae52c1ad2de6eb92fe4ee3233d');
                // Bit.ly up the URL :)
				bitly.shorten('https://bitbucket.org' payload.repository.absolute_url 'changeset/' payload.commits[0].node,function(err,resp){
                    // If there's an error, bottle out.
					if(err) throw err;
					console.log(resp.data);
					url = resp.data['url'];
                    // Build the message based on the variables Bitbucket gave us.
					var response = '\00307[' payload.repository.name ']\003 \00304 ' payload.commits.length '\003 \00300' payload.commits[0].author '\003: "' payload.commits[0].message '" \00302'  url   '\003 \00304ChangeSet: \003 '   payload.commits[0].node;
                    // Send the message.
					msg.send(response);
				});
			});
		});
	}
}
