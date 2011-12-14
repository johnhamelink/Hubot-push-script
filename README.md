#Hubot Push Script
##Send custom messages to your Hubot using HTTP
---
This script uses express to expose a REST API with which you can send data.

Each service is exposed as a template, with which you can manipulate the data as you would with any other node.js application, then pass it back to the hubot.

The service can even wait for a certain message to be used before displaying the data, regardless of when the POST was sent.

Hubot push script comes with an example github service that allows you to send post-commit urls and output them through hubot.

###Installation Instructions
---  
To install, move the files in this directory into the /scripts directory in the root of the hubot install.

###Extending Hubot Push Script
---
An example "skeleton" file is provided which shows you how to interact with the push-script. In essence there are two things you must do:

1. copy the skelhttpd.js script into another file
2. Update the httpd.js file to include the other file.