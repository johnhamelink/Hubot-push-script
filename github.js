/*
 * Github Post-commit hook plugin for hubot.
 *
 * In Github, add a post-commit hook, and set it to POST.
 * In the "URL" field, set the url to http://<your-server-name>:<hubot web port>/github
 *
 * You can test you have the correct URL by GETting the same URL.
 */
module.exports = flow = {
	robot: null,
	express: null,
	pubsub: null,
    /*
     * - Import the robot object from hubot
     * - Import the express object from http plugin
     * - Include a listener for any kind of message,
     *   so we can get the "msg" object for sending.
     */
	init: function(robot,express,pubsub){
		this.robot = robot;
		this.express = express;
		this.pubsub = express;
		this.setUpExpress();
		this.setUpHubot();
	},

    /*
     * Add a test express route.
     */
	setUpExpress: function(){
		this.express.get('/github',function(req,res){
			res.send('POST this URL with the payload parameter from github here.');
		});

		this.express.post('/github',function(req,res){
			flow.pubsub.emit('github/newCommit',JSON.parse(req.body.payload));
			res.send('Received');
		});
	},

    /*
     * - Set up an event listener within hubot for any kind of message from
     *   the adapter (eg, IRC).
     * - Set up an internal listener which uses the msg object to send data
     *   back to the adapter.
     */
	setUpHubot: function(){
		this.robot.hear('',function(msg){
			flow.pubsub.removeAllListeners('github/newCommit');
			flow.pubsub.on('github/newCommit',function(payload){
				var response = '[' payload.repository.name '] New commit by ' payload.commits[0].author.name ': "' payload.commits[0].message '" ' payload.commits[0].url;
				msg.send(response);
			});
		});
	}
}
