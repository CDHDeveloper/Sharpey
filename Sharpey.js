
(function() {
    var fs = require('fs');
	var util = require('util');
	var program = {};
	// load our submodules
	var config = require('./lib/config.js');			// our repository of confguration info.
	var parser =  require('./lib/Compiler/Sharpey/Sharpey7.js').parser;
	
	var AST =  require('./lib/Compiler/Sharpey/ASTNodes2.js');
	
	parser.yy = AST;
	
	var printLine = function(line) {
		return process.stdout.write(line + '\n');
	};
	
	program.Config = config;
	
	// Setup some basic info
	exports.VERSION = '0.0.0';
	
	program.run = function() {
		if (program.Config.Options.input != 'undefined')
		{
			printLine('Version: ' + exports.VERSION);
			printLine('Input is: ' + program.Config.Options.input);
			printLine('showTree is ' + program.Config.Options.showTree);
			
            if (program.Config.Options.output == undefined) {
                program.Config.Options.output  = program.Config.Options.input + '.js';
			}
			printLine('Output is ' + program.Config.Options.output + '\n\n');
            program.compile(program.Config.Options.input)
		}
	};
	
	program.hasClass = function (namespaceObj) {
		for (var i = 0; i < namespaceObj.elements.elements.length; i++) {
			if (namespaceObj.elements.elements[i].type === "ClassNode") {
				return namespaceObj.elements.elements[i];
			}
			else if (namespaceObj.elements.elements[i].type === "NameSpaceElementsNode") {
				var innerElements = namespaceObj.elements.elements[i];
				for (var q = 0; q < innerElements.elements.length; q++) {
					if (innerElements.elements[q].type === "ClassNode") {
						return innerElements.elements[q];
					}
				}
			}
		}
	};
	
	program.output = function(ast) {
		var myNamespaceName = ast.value.name;
		var myFileName = myNamespaceName + ".index.js";
		var myClass = program.hasClass(ast.value);
		if (myClass !== null) {
			myFileName = myClass.name + ".js";
		}
		var myOutput = ast.Compile();
		fs.writeFile(myFileName , myOutput, function (err) {
			if (err) {
				throw err;
			}
		});	
	};
	
	program.walk = function(ast) {
		// console.log("doing the ast walk");
		// console.log("Program contains: " );
	}
	
    program.compile = function (src) {
		
        fs.readFile(src, 'utf8', function (err, str) {
            if (err) {
                console.log("error reading source file (" + src + "): " + err);
            } else {
                var ast = parser.parse(str);
				console.log("Compiling...\n");
				program.output(ast);
				program.walk(ast);
				console.log(util.inspect(ast, {depth:null}));
				//console.log(str);
				
            }
        });
    };
	
    config.load(process.argv);
    program.run();
}).call(this);