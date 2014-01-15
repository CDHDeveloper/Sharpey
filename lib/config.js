// Config

/**
 * Module dependencies.
 */
 var Options = require('./commander.js');

exports = module.exports = new Config;

/**
 * Expose `Config`.
 */

exports.Config = Config; 
 /*Config.prototype.printLine = function(line) {
		return process.stdout.write(line + '\n');
};*/

function Config() {
	// input
	Options.option('--input <inSpec>', 'specify the input dir or path');
	// ouput
	Options.option('--output <outSpec>', 'specify the output dir or path');
	// display AST
	Options.option('--showTree', 'write the syntax tree to the output stream', true);
    // display Lexical Analysis
    Options.option('--showLex', 'write the tree to the output stream', true);
    // write out the AST
	Options.option('--writeTree <treeSpec>', 'write the tree to the specified file');
}

Config.prototype.load = function (argV) {
    Options.parse(argV);
};

exports.Options = Options;
exports.load = Config.prototype.load;