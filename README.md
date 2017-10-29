#Nano
Project Nano

-- How to use

Please use Tomcat or whatever else that support php to serve as file server.
Use nodejs as game serve.
If you don't want to install nodejs, then only php server will be OK.

HOWTO:
1. Change server-php.bat, replace path with your own JAVA_HOME, PHP_HOME, etc.
 Or You can use other web server such as WAMPServer, etc 
 to serve this folder as resource.
 
2. Change server.bat, replace NODEJs path with your own NODEJs path.
 Can only use nodejs to serve as script server.
 
3. Change the following code in index.php
Client.connect("127.0.0.1",9005);
 to your own script server and port.
 
4. That's all done. Use the following to browse the Game if you
 set resource folde as /, and server as 127.0.0.1 and port at 8080
http://127.0.0.1:8080/index.php
 the script server and port(in index.php) could be different from your resource server.