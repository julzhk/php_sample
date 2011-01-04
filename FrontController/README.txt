Julian Harley
julian.harley@gmail.com

*** Overview ***
This is a coding sample showing the architecture of a project. It's code in development, so it's not textbook perfect; but a snapshot of code being worked upon. 

It was a collaborative effort: I was responsible for most of the backend architecture; database format, and so on. I can't take credit for the clever frontend javascript interface coding: ie the javascript data cache; the jquery interface animation etc.

*** Architecture ***
The application follows a MVC pattern, with the models are defined using the doctrine php ORM system. 
The controllers are all classes/methods in the 'commands' folder, usually accepting and returning JSON data to the views - defined in the 'content' folder.

*** Web-facing files ***
The only directly accessible files are in the 'content' folder. The index.html file there uses javascript to kick build a UI, and query the database for login credentials etc via content/api.php.

*** The JSON API approach ***
The front-end interface uses jquery/ajax to interact with the back-end through JSON routed through the content/api.php script. 
This api.php script follows the 'front controller' pattern with two main arguments: the first argument defining the command to use; the second specifying which method to invoke. With each 'command' having a class defined for it in the 'commands' folder. 
This approach allowed functionity to be developed in modules and let the commucation with the backend be treated effectively as through an API. This made testing much easier.

*** Commands Folder ***
Each class in the commands folder defines a broad range of related functions (for instance: all of the administration functions, reports, logging in, etc.) Each of these classes is has an abstract parent class to centralize security and other common functions.
(Note: there are 8 command classes; some have been omitted for clarity.)

*** Data Objects ***
The dataobjects folder defines the database structure using the php-doctrine ORM framework: each of these classes maps to a database table.

In theory the ORM implements it's own query language called DQL, but due to memory issues, DQL was found to be unreliable and has been mostly replaced with MySql. An example of DQL: $thisblob = $blobobjecttable->find($object_id): as you can see it's similar to django's ORM.

(Note: there are 37 command classes; some omitted for clarity.)

*** 3rd party libraries ***
3rd party software is in the 'classes' folder covering functions for: image thumbnailing; email handling; intruder detection; UI language translation; and a request singleton object (request.php).

*** Unittests ***
Tests were used to prove the development both in terms of test-driven development and to avoid regression bugs creeping in.Some selenium UI tests were used but these weren't as useful as unit tests.
(Note: there are 28 test files; some omitted for clarity.)

*** Development Practices ***
The project was managed used the assembla.com application but then transferred to using the tool itself.
The coding used the Netbeans IDE, and version control used subversion.
Pair programming was utilized regularly to good effect as were informal scrums.
Firebug, and firephp were invaluable, and were used extensively.
Doc comments were used to create documentation with phpDocumentor.

# END #