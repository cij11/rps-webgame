RPS-Webgame

Installation:  
Developed for AWS Ubuntu EC2 instance

1. Start an Ubuntu EC2 instance in AWS
2. Clone project into Ubuntu EC2 instance
3. Navigate into ./server
4. Start server with ```node server.js```
5. Under 'EC2 Monitoring -> Security Groups' set inbound traffic rules to allow http connections from your IP address during development, or from all IP addresses once project published.
