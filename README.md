Sharpey
=======

Playing around with creation of my own language and nodejs based transpiler. 
Language is starting out as a variant of C#, hence Sharpey.

The code uses [jison] (https://github.com/zaach/jison) a Bison/Yacc variant in JS, to create the parser code that is based off the specification in the .jison file. 

To run jison you'll need to do "npm install jison -g" to install jison using npm, the node package manager.

The CLI handling uses [commander](https://github.com/visionmedia/commander.js) by TJ Holowaychuk.

Sharpey.js is the main file, and you can run the application by doing something as follows:
node sharpey.js  --input TestSharp7.sharp

To recompile the parser after changes to the grammar, use compilit.bat or manually do as follows:
cd lib\Compiler\Sharpey
call Jison --lalr1 sharpey7.jison
cd ..\\..\\..

Note that the --lalr1 is needed based on the way the grammar is defined.

The current grammar is in [Sharpey7.jison] (https://github.com/CDHDeveloper/Sharpey/blob/master/lib/Compiler/Sharpey/Sharpey7.jison)
And the Abstract Syntax Tree code can be found in [AstNodes2.js](https://github.com/CDHDeveloper/Sharpey/blob/master/lib/Compiler/Sharpey/ASTNodes2.js)


