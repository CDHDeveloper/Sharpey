(function() {
	// External Declarations
	// var _ = require('underscore');
	var util = require('util');

	var isDebug = exports.isDebug = isDebug = false;
	var currDepth = 0;
	var usesEnum = false;
	var usesLinq = false;
	var klasses = [];
	var namespaces = [];
	
	/*********** Helper functions ***************/
	/*Ptr = function(input){
		return input;
	}*/
	__extends = function(child, parent) { 
		for (var key in parent) { 
			if (__hasProp.call(parent, key)) 
				child[key] = parent[key]; 
		} 
		function ctor() { 
			this.constructor = child; 
		} 
		ctor.prototype = parent.prototype; 
		child.prototype = new ctor(); 
		child.__super__ = parent.prototype; return child; 
	};
	__indexOf = [].indexOf || function(item) { 
		for (var i = 0, l = this.length; i < l; i++) { 
			if (i in this && this[i] === item) 
			return i; 
		} 
		return -1; 
	};

	 inspect = exports.inspect = function(obj) {
		return util.inspect(obj);
	 }

	 extend = exports.extend = function(object, properties) {
		var key, val;
		for (key in properties) {
		  val = properties[key];
		  object[key] = val;
		}
		return object;
	  };
	  
	var debug = [];
	exports.debug = debug;
	  
	 var ShowDebug = function() {
		for (var i = 0; i < debug.length; i++) {
			console.log(debug[i] + "\n");
		}
	 }
	 exports.ShowDebug = ShowDebug;
	 
	/*var AstConfig = exports.AstConfig = AstConfig = (function() {
	})();
		AstConfig.prototype.Config = {};
		AstConfig.prototype.setConfig = function(config) {
			this.Config = config;
		}
		AstConfig.prototype.setDebug = function(onOff) {
			this.isDebug = onOff;
		}
		AstConfig.prototype.setEnums = function(onOff) {
			this.usesEnum = onOff;
		}
		AstConfig.prototype.setLinq = function(onOff) {
			this.usesLinq = onOff;
		}
*/
	
	// Base class for ASTNode
	var ASTNode = exports.ASTNode = ASTNode = (function() {
		// Constructor
		function ASTNode() {}
		
		ASTNode.prototype.Type = "unknown";
		
		ASTNode.prototype.Compile = function(obj, lvl) {
			obj = extend({}, obj);
			if (lvl) {
				o.level = lvl;
			}
			node = this.unfoldSoak(o) || this;
			node.tab = o.indent;

			if (o.level === LEVEL_TOP || !node.isStatement(o)) {
				return node.compileNode(o); // ASTNode
			} else {
				return node.compileClosure(o);
		  }	
		};
		
		ASTNode.prototype.unfoldSoak = function() {
			return false;
		};
		
		ASTNode.prototype.compileClosure = function() {
			if (this.jumps()) {
				throw SyntaxError('cannot use a pure statement in an expression.');
			}
			o.sharedScope = true;
			return Closure.wrap(this).compileNode(o);	// ASTNode
		};
		
		ASTNode.prototype.compileNode = function() {
		};
		
		ASTNode.prototype.children = [];

		ASTNode.prototype.isStatement = function() {
			return false;
		};

		ASTNode.prototype.jumps = function() {
			return false;
		};

		ASTNode.prototype.isComplex = function() {
			return true;
		};

		ASTNode.prototype.isChainable = function() {
			return false;
		};

		ASTNode.prototype.isAssignable = function() {
			return false;
		};

		ASTNode.prototype.unwrap = this;
	})();

	  
	var TypeNode = exports.TypeNode = TypeNode = (function() {

		function TypeNode(value) {
			this.type = "TypeNode";
			this.value = value;
		}

		return TypeNode;

	  })();

	var AssignExpressionNode = exports.AssignExpressionNode = AssignExpressionNode = (function() {

		function AssignExpressionNode(value) {
			this.type = "AssignExpressionNode";
			this.value = value;
		}
		AssignExpressionNode.prototype.children = ['value'];
		
		AssignExpressionNode.prototype.CompileNode  = function(caller) {
			logDebug("In AssignExpressionNode CompileNode. Called From " + caller.type);
			var output = "";
			try {
				if (isString(this.value)) {
					output += " = " +  this.value;
				} else {
					
					output = ( " = " + this.value.CompileNode(this));
				}
			}
			catch(e) {
				logError("Error compiling AssignExpressionNode\n" + "Error: " + e);
				logError("Value = "  + util.inspect(this.value, true, null));
				if (util.isArray(this.value)) {
					logError("AssignExpressionNode is an array.\n");
				}
			}
			return output;
		}
		
		return AssignExpressionNode;

	  })();

	  var ConstructorDeclNode = exports.ConstructorDeclNode = ConstructorDeclNode = (function() {

		function ConstructorDeclNode(value) {
			this.type = "ConstructorDeclNode";
		  this.value = value;
		}

		return ConstructorDeclNode;

	  })();


	  var ParameterNode = exports.ParameterNode = ParameterNode = (function() {

		function ParameterNode(value, parm2, parm3) {
			this.type = "ParameterNode";
			this.value = value;
		}
		
		ParameterNode.prototype.CompileNode  = function(caller) {
			logDebug("In ParameterNode CompileNode. Called From " + caller.type);
			if (isString(this.value)) {
				return this.value;
			}
			else {
				return this.value.CompileNode(this);
			}
		}
		return ParameterNode;

	  })();

	  /**********************************************************************
	   **** PROGRAM - The Root AST Node                                  ****
	   **********************************************************************/
	  var ProgramNode = exports.ProgramNode = ProgramNode = (function() {

		function ProgramNode(value) {
			this.type = "ProgramNode";
			this.value = value;
		};
		ProgramNode.prototype.children = ['value'];
		
		ProgramNode.prototype.Compile  = function() {
			var numKids = this.children.length;
			return this.value.CompileNode(this);
		}
		return ProgramNode;

	  })();
	  
	  /*****************************************************************************
	   **** NAMESPACES 
	   ******************************************************************************/
	  var NameSpaceNode = exports.NameSpaceNode = NameSpaceNode = (function() {

		function NameSpaceNode(name, elements) {
			this.type = "NameSpaceNode";
			this.name = name;
			this.elements = elements;
		};
		NameSpaceNode.prototype.children = ['name', 'elements'];
		
		NameSpaceNode.prototype.CompileNode  = function(caller) {
			logDebug("In NameSpaceNode CompileNode. Called From " + caller.type);
			var output = "";
			output = "// Generated by Sharpey 0.0.1\n";
			output += "// Namespace ";
			if (isString(this.name)) {
				output += this.name;
			}
			else {
				output += this.name.CompileNode(this);
			}
			output += "\n";
			output += "(function() {\n";
			currDepth++;
			if (util.isArray(this.elements)) {
				var elLen = this.elements.length;
				for (i = 0; i < elLen; i++) {
					output += this.elements[i].CompileNode(this);
				}
			}
			else if (util.isArray(this.elements.elements)) {
				var elLen = this.elements.elements.length;
				for (i = 0; i < elLen; i++) {
					output += this.elements.elements[i].CompileNode(this);
				}
			}

			output += "\n});";
			return output;
		}
		return NameSpaceNode;

	  })();

		var NamespaceElementsNode = exports.NamespaceElementsNode = NamespaceElementsNode = (function() {

		NamespaceElementsNode.prototype.elements = [];
		function NamespaceElementsNode(firstElement, otherElements) {
			this.type = "NameSpaceElementsNode";
			this.elements = [ firstElement ];
			if (otherElements !== undefined) {
				this.elements.push(otherElements);
			}
		}

		NamespaceElementsNode.prototype.children = ['elements'];

		NamespaceElementsNode.prototype.CompileNode  = function(caller) {
			logDebug("In NamespaceElementsNode CompileNode. Called From " + caller.type);
			var output = "";
			if (util.isArray(this.elements)) {
				var elLen = this.elements.length;
				for (var i = 0; i < this.elements.length; i++) {
					try {
						if (isString(this.elements[i])) {
							output += this.elements[i];
						}
						else {
							output += this.elements[i].CompileNode(this);
						}
					}
					catch (e) {
						logError("Error compiling NamespaceElementsNode[" +  i + "]\n" + "Error: " + e);
						logError("Typeof: " + typeof this.elements[i]);
						logError(util.inspect(this.elements[i]));
						if (util.isArray(this.elements[i])) {
							logError("NamespaceElementsNode[" +  i + "] is an array.\n");
						}
					}
				}
			}
			else {
				output += (this.elements.CompileNode(this));
			}
			return output;
		}
		
		return NamespaceElementsNode;
	  })();

	  /******************************************************************
	   **** IMPORTING
	   ******************************************************************/
	  var ImportNode = exports.ImportNode = ImportNode = (function() {

		function ImportNode(knownModule, varName, modSpec) {
			this.type = "ImportNode";
			this.knownModule = knownModule;
			this.varName = varName;
			this.modSpec = modSpec;
		}

		ImportNode.prototype.children = ['knownModule', 'varName', 'modSpec'];
		
		ImportNode.prototype.CompileNode  = function(caller) {
			logDebug("In ImportNode CompileNode. Called From " + caller.type);
			var output = tabIt() + "var ";
			if (isString(this.varName)) {
				output += this.varName;
			}
			else {
				output += this.varName.CompileNode(this);
			}
			if (this.knownModule) { 
				output += " = require('";
				if (isString(this.knownModule)) {
					output += this.knownModule;
				}
				else {
					output += this.knownModule.CompileNode(this);
				}
				output +=  "');\n";
			}
			else { 
				output += " = require('" + this.modSpec + "');\n";
			}
			return output;
		}
		return ImportNode;

	  })();
	  
	  /************************************************************************
	   **** CLASSES
	   *************************************************************************/
	  var ClassNode = exports.ClassNode = ClassNode = (function() {

		function ClassNode(name, body, scope, parent) {
			this.type = "ClassNode";
			this.name = name;
			this.parent = parent;
			this.body = body != null ? body : new BlockNode;
			this.boundFuncs = [];
			this.body.classBody = true;
			this.scope = scope;
			this.isAbstract = false;
			console.log(util.inspect(this));
		}

		ClassNode.prototype.children = ['name', 'parent', 'body', 'scope'];
		
		ClassNode.prototype.CompileNode  = function(caller) {
			logDebug("In ClassNode CompileNode. Called From " + caller.type);
			var isPublic = this.scope === "PUBLIC";
			var output = "";
			output += "\n" + tabIt() +  "//" + this.scope.toLowerCase() + " class " + this.name + "\n";
			var extensions = (this.parent === null) ? "" : " : " + this.parent;
			if (isPublic) {
				output += tabIt() + "var " + this.name + " = exports." + this.name + " = " + this.name + " = (function() {\n";
			}
			else {
				output += "  " + this.name + " = (function() {\n";
			}
			currDepth++;

			if (util.isArray(this.body)) {
				var elLen = this.body.length;
				for (var i = 0; i < elLen; i++) {
					try {
						if ((typeof this.body[i]) !== undefined)
						{ 
							output += this.body[i].CompileNode(this);
						}
						else {
							console.log("body part " + i + " is undefined.");
						}
					}
					catch (e) {
						logError("error compiling body part " + i + " Error: " + "\n" + e + "\n");
						logError("body[" + i + "] ");
						logError(util.inspect(this.body[i]));
					}
				}
			}
			else if (util.isArray(this.body.elements)) {
				var elLen = this.body.elements.length;
				for (var i = 0; i < elLen; i++) {
					try {
						if (this.body.elements[i] !== undefined)
						{ 
							output += this.body.elements[i].CompileNode(this);
						}
						else {
							console.log("body part " + i + " is undefined.");
						}
					}
					catch (e) {
						logError("error compiling body part " + i + " Error: " + "\n" + e + "\n");
						logError("body[" + i + "] ");
						logError(util.inspect(this.body[i]));
					}
				}
			}
			output += tabIt() + "\n}\n";
			currDepth--;
			return output;
		}
		formatBody = function(body) {
			
		}
		return ClassNode;

	  })();
	  
	  	var ClassElementsNode = exports.ClassElementsNode = ClassElementsNode = (function() {

		ClassElementsNode.prototype.elements = [];
		function ClassElementsNode(firstElement, otherElements,yylineno) {
			this.type = "ClassElementsNode2";
			console.log(this.type + " " + yylineno);
			try {
				this.elements = lr(firstElement, otherElements);
			}
			catch (e) {
				logError("error calling lr() for ClassElementsNode");
			}
		}

		ClassElementsNode.prototype.children = ['elements'];
		
		return ClassElementsNode;

	  })();

	  
	  
	  
	var FuncDeclNode = exports.FuncDeclNode = FuncDeclNode = (function() {

		function FuncDeclNode(name, parms, body, scope) {
			console.log("FuncDeclNode");
			this.type = "FuncDeclNode";
			this.name = name;
			this.parms = parms;
			console.log("FuncDeclNode: " + body);
			this.body = body;
			
			this.scope = scope;
		}

		FuncDeclNode.prototype.children = ['name', 'parms', 'body', 'scope'];
		
		FuncDeclNode.prototype.CompileNode  = function(caller) {
			logDebug("In FuncDeclNode CompileNode. Called From " + caller.type + " Function name: "  + this.name);
			var isPublic = (this.scope != null && this.scope == "PUBLIC");
			var myParms = (this.parms === null) ? "" : this.parms.CompileNode(this);
			var output = "\n";
			var funcHeader = "";
			if (isPublic) {
				output += tabIt() + caller.name + ".prototype." + this.name + " = function(" + myParms + ")" + " {\n";
			}
			else { 
				output += tabIt() + "function " + this.name + "(" + myParms + ")" + " {\n";
			}
			currDepth++;
			if (util.isArray(this.body)) {
				var elLen = this.body.length;
				for (i = 0; i < elLen; i++) {
					output += this.body[i].CompileNode(this);
				}
			}
			else {
				output += this.body.CompileNode(this);
			}
			currDepth--;
			output += "\n";
			output += tabIt() + "}\n";
			return output;
		}
		
		return FuncDeclNode;

	  })();

	var FunctionBodyNode = exports.FunctionBodyNode = FunctionBodyNode = (function() {

		function FunctionBodyNode(value) {
			console.log("FunctionBodyNode");		
			console.log("FunctionBodyNode value: " + value);		
			this.type = "FunctionBodyNode";
			this.value = value;
			console.log("FunctionBodyNode value: " + value);
		}

		FunctionBodyNode.prototype.children = ['value'];
		
		FunctionBodyNode.prototype.CompileNode  = function(caller) {
			logDebug("In FunctionBodyNode CompileNode. Called From " + caller.type);
			var output = "";
			try {
				console.log("VALUE: " + this.value);
				if (this.value !== undefined) {
					output =  this.value.CompileNode(this);
				}
				else {
					output =  "";
				}
			}
			catch (e) {
				logError("Error calling CompileNode in FunctionBodyNode "  +  e);
			}
			return output;
		}
		
		return FunctionBodyNode;

	  })();

	  var FunctionCallNode = exports.FunctionCallNode = FunctionCallNode = (function() {

		FunctionCallNode.prototype.elements = [];
		function FunctionCallNode(func, args) {
			this.type = "FunctionCallNode";
			this.func = func;
			this.args = args;
		}

		FunctionCallNode.prototype.children = ['func', 'args'];
		
		FunctionCallNode.prototype.CompileNode  = function(caller) {
			logDebug("In FunctionCallNode CompileNode. Called From " + caller.type);
			var argsStr = "";
			var output = "";
			try {
				argsStr = (this.args == null) ? "" : this.args.CompileNode(this);
				
			}
			catch(e) {
				logError("Error calling compileNode on args in FunctionCallNode "  + e);
			}
			if (argsStr[argsStr.length-1] == ',') {
				argsStr = argsStr.substring(0, argsStr.length-1);
			}
			if (isString(this.func)) {
				output += (this.func + "(" + argsStr + ")");
			}
			else {
				var output = "";
				logDebug("Calling CompileNode on this.func in FunctionCallNode");
				output += this.func.CompileNode(this);
				output +=  "(" + argsStr + ")";
			}
			return output;
		}
		return FunctionCallNode;
	  })();
	  
	  var BlockNode = exports.BlockNode = BlockNode = (function() {

		function BlockNode(expressions) {
			this.type = "BlockNode";
			this.expressions = expressions;
		}

		BlockNode.prototype.children = ['expressions'];
		
		BlockNode.prototype.CompileNode  = function(caller) {
			logDebug("In BlockNode.prototype.CompileNode. Called From " + caller.type);
			return (this.expressions.CompileNode(this));
		}

		return BlockNode;

	  })();

	/*********************************************************************************
	 ****** VARIABLES 
	 **********************************************************************************/
	var VarStatementNode = exports.VarStatementNode = VarStatementNode = (function() {

		function VarStatementNode(varList, scope) {
			this.type = "VarStatementNode";
			this.scope = scope;
			this.varList  = varList;
		}

		VarStatementNode.prototype.children = ['varList', 'scope'];
		
		VarStatementNode.prototype.CompileNode  = function(caller) {
			logDebug("In VarStatementNode CompileNode. Called From " + caller.type);
			var myScope = (this.scope === null) ? "" : this.scope;
			var output = tabIt() + "var ";
			if (util.isArray(this.varList)) {
				var elLen = this.varList.length;
				for (i = 0; i < elLen; i++) {
					output += this.varList[i].CompileNode(this);
				}
			}
			else {
				output += this.varList.CompileNode(this);
			}
			if (myScope === "PUBLIC") {
				output += "\n" + "exports." + this.varlist + " = " + this.varlist;
			}
			return output + ";\n";
		}
		
		return VarStatementNode;

	  })();

	  var VarDeclListNode = exports.VarDeclListNode = VarDeclListNode = (function() {

		VarDeclListNode.prototype.elements = [];
		
		function VarDeclListNode(firstElement, otherElements) {
			this.type = "VarDeclListNode";
			this.elements = [ firstElement ];
			if (otherElements !== undefined) {
				this.elements.push(otherElements);
			}
		}

		VarDeclListNode.prototype.children = ['elements'];
		
		VarDeclListNode.prototype.CompileNode  = function(caller) {
			logDebug("In VarDeclListNode CompileNode. Called From " + caller.type);
			var output = "";
			if (util.isArray(this.elements)) {
				var elLen = this.elements.length;
				for (i = 0; i < elLen; i++) {
					try {
						if (isString(this.elements[i])) {
							output +=  ( this.elements[i]);
						}
						else {
							output += (this.elements[i].CompileNode(this));
						}
					}
					catch (e) {
						logError("Error compiling VarDeclListNode[" +  i + "]\n" + "Error: " + e);
						logError("Elements " + i + " = " + util.inspect(this.elements[i]));
						logError("Elements = "  + util.inspect(this.elements, true, null));
						if (util.isArray(this.elements[i])) {
							logError("VarDeclListNode[" +  i + "] is an array.\n");
						}
					}
				}
			}
			else {
				output +=  (this.elements.CompileNode(this));
			}
			return output;
		}
		return VarDeclListNode;
	  })();
	  
	/*************************************************************************************
	 ***** LITERALS
	 *************************************************************************************/
	var StringLiteralNode = exports.StringLiteralNode = StringLiteralNode = (function() {

		function StringLiteralNode(value) {
			this.type = "StringLiteralNode";
			this.value = value;
		}

		StringLiteralNode.prototype.children = ['value'];
		
		StringLiteralNode.prototype.CompileNode  = function(caller) {
			logDebug("In StringLiteralNode CompileNode. Called From " + caller.type);
			return (this.value);
		}
		return StringLiteralNode;
	  })();

	var NumberLiteralNode = exports.NumberLiteralNode = NumberLiteralNode = (function() {

		function NumberLiteralNode(value) {
			this.type = "NumberLiteralNode";
			this.value = value;
		}

		NumberLiteralNode.prototype.children = ['value'];
		
		NumberLiteralNode.prototype.CompileNode  = function(caller) {
			logDebug("In NumberLiteralNode CompileNode. Called From " + caller.type);
			return (this.value);
		}
		return NumberLiteralNode;
	  })();

/*************************************************************************************************
  *** Flow Control Constructs
  ************************************************************************************************/

    /*********************************************************************************************
     ***** IF
	**********************************************************************************************/
	var IfNode = exports.IfNode = IfNode = (function() {

		IfNode.prototype.elements = [];
		function IfNode(expr, stmt, stmt2) {
			this.type = "IfNode";
			this.expr = expr;
			this.trueStmt = stmt;
			this.falseStmt = stmt2;
		}

		IfNode.prototype.children = ['expr', 'trueStmt', 'falseStmt'];
		
		IfNode.prototype.CompileNode  = function(caller) {
			logDebug("In IfNode CompileNode. Called from " + caller.type);
			var output = tabIt();
			try {
				output += "if (";
				if (isString(this.expr)) {
					output += this.expr;
				}
				else {
					output += this.expr.CompileNode(this);
				}
				output += ") {\n";
				currDepth++;
			}
			catch(e) {
				logError("Error compiling IfNode expr "+ e);
			}
			output += (this.trueStmt.CompileNode(this));
			currDepth--;
			
			output += ("\n" + tabIt() + "}\n");
			if (this.falseStmt != null) {
				output += "else {\n ";
				currDepth++;
				output += this.falseStmt.CompileNode(this);
				currDepth--;
				output += "";
				output += tabIt() + " \n}\n";
			}
			return output;
		}
		return IfNode;
	  })();

	/*******************************************************************************
	 ***** FOR
	 *******************************************************************************/
	var ForNode = exports.ForNode = ForNode = (function() {

		ForNode.prototype.elements = [];
		function ForNode(expr1, expr2, expr3, body, expr1IsVar) {
			this.type = "ForNode";
			this.expr1 = expr1;
			this.expr2 = expr2;
			this.expr3 = expr3;
			this.body = body;
			this.expr1IsVar = expr1IsVar;
		}

		ForNode.prototype.children = ['expr1', 'expr2', 'expr3', 'body'];
		
		ForNode.prototype.CompileNode  = function(caller) {
			logDebug("In ForNode CompileNode. Called from " + caller.type + " " + this.expr1IsVar );
			var output = tabIt();
			try {
				var expr1Out = "";
				if (isString(this.expr1)) {
					if (this.expr1IsVar === true) {
						expr1Out = "var ";
					}
					expr1Out += this.expr1;
				}
				else {
					if (this.expr1IsVar === true) {
						expr1Out = "var ";
					}
					expr1Out += this.expr1.CompileNode(this);
				}
				var expr2Out = (isString(this.expr2)) ? this.expr2 : this.expr2.CompileNode(this);
				var expr3Out = (isString(this.expr3)) ? this.expr3 : this.expr3.CompileNode(this);
				output += "for (" + expr1Out + "; " + expr2Out + "; " + expr3Out + ") {\n";
				currDepth++;
				output += (this.body.CompileNode(this));
			}
			catch (e) {
				logError("Error compiling ForNode\n" + "Error: " + e);
			}
			output += ("}\n");
			currDepth--;
			return output;
		}
		return ForNode;
	  })();
	  
	/****************************************************************************
	 ***** FOREACH
	 ****************************************************************************/
	var ForEachNode = exports.ForEachNode = ForEachNode = (function() {

		ForEachNode.prototype.elements = [];
		function ForEachNode(expr1, expr2, body, expr1IsVar) {
			this.type = "ForEachNode";
			this.expr1 = expr1;
			this.expr2 = expr2;
			// this.expr3 = expr3;
			this.body = body;
			this.expr1IsVar = expr1IsVar;
		}

		ForEachNode.prototype.children = ['expr1', 'expr2', 'expr3', 'body'];
		
		ForEachNode.prototype.CompileNode  = function(caller) {
			logDebug("In ForEachNode CompileNode. Called from " + caller.type + " " + this.expr1IsVar );
			var output = tabIt();
			try {
				var expr1Out = "";
				if (isString(this.expr1)) {
					if (this.expr1IsVar === true) {
						expr1Out = "var ";
					}
					expr1Out += this.expr1;
				}
				else {
					if (this.expr1IsVar === true) {
						expr1Out = "var ";
					}
					expr1Out += this.expr1.CompileNode(this);
				}
				var expr2Out = (isString(this.expr2)) ? this.expr2 : this.expr2.CompileNode(this);
				// var expr3Out = (isString(this.expr3)) ? this.expr3 : this.expr3.CompileNode(this);
				output += "for (" + expr1Out + " in " + expr2Out + "; " + ") {\n";
				currDepth++;
				output += (this.body.CompileNode(this));
			}
			catch (e) {
				logError("Error compiling ForEachNode\n" + "Error: " + e);
			}
			currDepth--;
			output += tabIt() + ("}\n");
			return output;
		}
		return ForEachNode;
	  })();
	  
	var Accessor1Node = exports.Accessor1Node = Accessor1Node = (function() {

		function Accessor1Node(accessed, index) {
			this.type = "Accessor1Node";
			this.accessed = accessed;
			this.index = index;
		}

		Accessor1Node.prototype.children = ['value'];
		
		Accessor1Node.prototype.CompileNode  = function(caller) {
			 logDebug("In Accessor1Node CompileNode. Called From " + caller.type);
			var output = this.accessed + "[";
			
			if (util.isArray(this.index)) {
				var elLen = this.index.length;
				for (var i = 0; i < this.index.length; i++) {
					try {
						if (isString(this.index[i])) {
							output += this.index[i];
						}
						else {
							output += this.index[i].CompileNode(this);
						}
					}
					catch (e) {
						logError("Error compiling Accessor1Node[" +  i + "]\n" + "Error: " + e);
						logError(util.inspect(this.index[i]));
						if (util.isArray(this.index[i])) {
							logError("Accessor1Node[" +  i + "] is an array.\n");
						}
					}
				}
			}
			else {
				output += (this.index.CompileNode(this));
			}
			output += "]";
			return output;
		}
		return Accessor1Node;
	  })();
	  
	var Accessor2Node = exports.Accessor2Node = Accessor2Node = (function() {

		// Accessor2Node.prototype.elements = [];
		function Accessor2Node(firstElement, otherElements) {
			this.type = "Accessor2Node";
			try {
				this.elements = lr(firstElement, otherElements);
			}
			catch (e) {
				logError("error calling lr() for Accessor2Node: " + e);
			}
		}

		Accessor2Node.prototype.children = ['value'];
		
		Accessor2Node.prototype.CompileNode  = function(caller) {
			logDebug("In Accessor2Node CompileNode. Called From " + caller.type);
			var output = "";
			if (util.isArray(this.elements)) {
				var elLen = this.elements.length;
				for (var i = 0; i < this.elements.length; i++) {
					try {
						if (isString(this.elements[i])) {
							output += ((i == 0) ? "" : ".") + this.elements[i];
						}
						else {
							output += this.elements[i].CompileNode(this);
						}
					}
					catch (e) {
						logError("Error compiling Accessor2Node[" +  i + "]\n" + "Error: " + e);
						logError(util.inspect(this.elements[i]));
						if (util.isArray(this.elements[i])) {
							logError("Accessor2Node[" +  i + "] is an array.\n");
						}
					}
				}
			}
			else {
				output += (this.elements.CompileNode(this));
			}
			return  output;
		}
		return Accessor2Node;
	  })();
	  
	var ArgumentListNode = exports.ArgumentListNode = ArgumentListNode = (function() {

		function ArgumentListNode(firstElement, otherElements) {
			this.type = "ArgumentListNode";
			this.elements = [ firstElement ];
			if (otherElements !== undefined) {
				this.elements.push(otherElements);
			}
		}

		ArgumentListNode.prototype.children = ['value'];
		
		ArgumentListNode.prototype.CompileNode  = function(caller) {
			 logDebug("In ArgumentListNode CompileNode. Called From " + caller.type);
			var output = "";
			if (util.isArray(this.elements)) {
				var elLen = this.elements.length;
				for (var i = 0; i < this.elements.length; i++) {
					try {
						var separator = (this.elements[i].type === 'ArgumentListNode') ? "" : ",";
						output += ((isString(this.elements[i]))) ? this.elements[i] : this.elements[i].CompileNode(this);
						output +=  separator;
					}
					catch (e) {
						logError("Error compiling ArgumentListNode[" +  i + "]\n" + "Error: " + e);
						logError("Typeof: " + typeof this.elements[i]);
						logError(util.inspect(this.elements[i]));
						if (util.isArray(this.elements[i])) {
							logError("ArgumentListNode[" +  i + "] is an array.\n");
						}
					}
				}
			}
			else {
				output += (this.elements.CompileNode(this));
			}
			return output;
		}
		return ArgumentListNode;
	  })();
	  

	  var SourceElementsNode = exports.SourceElementsNode = SourceElementsNode = (function() {

		SourceElementsNode.prototype.elements = [];
		function SourceElementsNode(firstElement, otherElements) {
			this.type = "SourceElementsNode";
			try {
				this.elements = lr(firstElement, otherElements);
			}
			catch (e) {
				logError("error calling lr() for SourceElementsNode");
			}
		}

		SourceElementsNode.prototype.children = ['elements'];

		SourceElementsNode.prototype.CompileNode  = function(caller) {
			logDebug("In SourceElementsNode CompileNode. Called From " + caller.type);
			var output = "";
			if (util.isArray(this.elements)) {
				var elLen = this.elements.length;
				for (var i = 0; i < this.elements.length; i++) {
					try {
						if (isString(this.elements[i])) {
							output += this.elements[i];
						}
						else {
							output += this.elements[i].CompileNode(this);
						}
					}
					catch (e) {
						logError("Error compiling SourceElementsNode[" +  i + "]\n" + "Error: " + e);
						logError("Typeof: " + typeof this.elements[i]);
						logError(util.inspect(this.elements[i]));
						if (util.isArray(this.elements[i])) {
							logError("SourceElementsNode[" +  i + "] is an array.\n");
						}
					}
				}
			}
			else {
				output += (this.elements.CompileNode(this));
			}
			return output;
		}
		
		return SourceElementsNode;
	  })();

		
	  var AssignNode = exports.AssignNode = AssignNode = (function() {

		function AssignNode(left, op, right) {
			this.type = "AssignNode";
			this.left = left;
			this.right = right;
			this.op = op;
		}

		AssignNode.prototype.children = ['left', 'op', 'right'];
		AssignNode.prototype.CompileNode  = function(caller) {
			logDebug("In AssignNode CompileNode. Called From " + caller.type);
			var output =  "";
			if (isString(this.left)) {
				output += this.left;
			}
			else {
				output +=  this.left.CompileNode(this);
			}
			output +=  " " + this.op  + " ";
			if (isString(this.right)) {
				output += this.right;
			}
			else {
				output +=  this.right.CompileNode(this);
			}
			return output;
		}
		
		return AssignNode;
	  })();
	  
	var EqualNode = exports.EqualNode = EqualNode = (function() {

		EqualNode.prototype.elements = [];
		function EqualNode(left, op,right, isNoIn) {
			this.type = "EqualNode";
			this.left = left;
			this.right = right;
			this.op = op;
		}

		EqualNode.prototype.children = ['left', 'op', 'right'];
		
		EqualNode.prototype.CompileNode  = function(caller) {
			logDebug("In EqualNode CompileNode. Called From " + caller.type);
			var output = "" ;
			if (isString(this.left)) {
				output += this.left;
			}
			else {
				output += this.left.CompileNode(this);
			}
			output += " " + this.op + " ";
			if (isString(this.right)) {
				output += this.right;
			}
			else {
				output += this.right.CompileNode(this);
			}
			
			return output;
		}
		return EqualNode;
	  })();
	  
	var ArgumentsNode = exports.ArgumentsNode = ArgumentsNode = (function() {

		ArgumentsNode.prototype.elements = [];
		function ArgumentsNode(el1) {
			this.type = "ArgumentsNode";
			this.el1 = el1;
		}

		ArgumentsNode.prototype.children = ['elements'];
		
		ArgumentsNode.prototype.CompileNode  = function() {
			if (this.el1 === null) {
				return "";
			}
			else {
				return this.el1.CompileNode(this);
			}
		}
		
		return ArgumentsNode;
	  })();

	  
	  var ExprStatementNode = exports.ExprStatementNode = ExprStatementNode = (function() {

		ExprStatementNode.prototype.elements = [];
		function ExprStatementNode(expr) {
			this.type = "ExprStatementNode";
			this.expr = expr;
		}

		ExprStatementNode.prototype.children = ['expr'];
		
		ExprStatementNode.prototype.CompileNode  = function(caller) {
			logDebug("In ExprStatementNode CompileNode. Called From " + caller.type);
			var output = tabIt();
			if (isString(this.expr)) {
				output +=  this.expr;
			} else {
				output += (this.expr.CompileNode(this));
			}
			output += ";\n";
			return output;
		}
		return ExprStatementNode;
	  })();


	  
	  var NewExpressionNode = exports.NewExpressionNode = NewExpressionNode = (function() {

		function NewExpressionNode(value, args) {
			this.type = "NewExpressionNode";
			this.value = value;
			this.args = args;
		}

		NewExpressionNode.prototype.children = ['value', 'args'];
		
		NewExpressionNode.prototype.CompileNode  = function(caller) {
			logDebug("In NewExpressionNode CompileNode. Called From " + caller.type);
			var output = ""
			try {
				output += " new "
				if (isString(this.value)) {
					output +=  this.value;
				}
				else {
					output += this.value.CompileNode(this);
				}
				if (isString(this.args)) {
					output +=  this.args;
				}
				else {
					output += "(" + this.args.CompileNode(this) + ")"
				}
			} catch(e) {
				logError("Error compiling NewExpressionNode " + e);
			}
			return output;
		}
		
		return NewExpressionNode;
	  })();
	  
	  
	  var ReturnNode = exports.ReturnNode = ReturnNode = (function() {

		function ReturnNode(expression) {
			this.type = "ReturnNode";
			this.expression = expression;
		}

		ReturnNode.prototype.children = ['expressions'];
		
		ReturnNode.prototype.CompileNode  = function(caller) {
			logDebug("In ReturnNode.CompileNode. Called From " + caller.type);
			var output = tabIt() + "return ";
			try {
				if (this.expression === null) {
					output += ";\n";
				}
				else {
					if (isString(this.expression)) {
						output += this.expression;
					}
					else {
						output += this.expression.CompileNode(this);
					}
					output += ";\n";
				}
			}
			catch (e) {
				logError("error compiling ReturnNode: " + e);
			}
			return output;
		}

		return ReturnNode;

	  })();

	  var RelationalNode = exports.RelationalNode = RelationalNode = (function() {

		function RelationalNode(left, op, right) {
			this.type = "RelationalNode";
			this.left = left;
			this.right = right;
			this.op = op;
		}

		RelationalNode.prototype.children = ['left', 'op', 'right'];
		
		RelationalNode.prototype.CompileNode  = function(caller) {
			logDebug("In RelationalNode CompileNode. Called From " + caller.type);
			var leftOut = (isString(this.left)) ? this.left : this.left.CompileNode(this);
			var rightOut = (isString(this.right)) ? this.right : this.right.CompileNode(this);
			
			return (leftOut +  " " + this.op  + " " + rightOut);
		}
		return RelationalNode;
	  })();

	  var PrefixNode = exports.PrefixNode = PrefixNode = (function() {

		function PrefixNode(op, expr) {
			this.type = "PrefixNode";
			this.expr = expr;
			this.op = op;
		}

		PrefixNode.prototype.children = ['expr', 'op'];
		PrefixNode.prototype.CompileNode  = function(caller) {
			logDebug("In PrefixNode CompileNode. Called From " + caller.type);
			return (this.expr + this.op);
		}
		return PrefixNode;
	  })();
	  
	  var PostfixNode = exports.PostfixNode = PostfixNode = (function() {

		function PostfixNode(expr, op) {
			this.type = "PostfixNode";
			this.expr = expr;
			this.op = op;
		}

		PostfixNode.prototype.children = ['expr', 'op'];
		
		PostfixNode.prototype.CompileNode  = function(caller) {
			logDebug("In PostfixNode CompileNode. Called From " + caller.type);
			if (isString(this)) {
				return (this.expr + this.op);
			}
			else {
				return (this.expr.CompileNode(this) +  this.op);
			}
		}
		return PostfixNode;
	  })();
	  
	  var AddNode = exports.AddNode = AddNode = (function() {

		function AddNode(left, right, op) {
			this.type = "AddNode";
			this.left = left;
			this.right = right;
			this.op = op;
		}

		AddNode.prototype.children = ['left', 'right', 'op'];
		
		AddNode.prototype.CompileNode  = function(caller) {
			logDebug("In AddNode CompileNode. Called From " + caller.type);
			var output = "";
			if (isString(this.left)) {
				output += this.left;
			}
			else {
				output += this.left.CompileNode(this) +  " " + this.op   + " ";
			}
			if (isString(this.right)) {
				output += this.right;
			}
			else {
				output += this.right.CompileNode(this) +  " " + this.op   + " ";
			}
			return output;
		}
		return AddNode;
	  })();
	  
	  var EnumItemNode = exports.EnumItemNode = EnumItemNode = (function() {

		EnumItemNode.prototype.elements = [];
		function EnumItemNode(firstElement, otherElements) {
			this.type = "EnumItemNode";
			this.usesEnum = true;
			try {
				this.elements = lr(firstElement, otherElements);
			}
			catch (e) {
				logError("error calling lr() for EnumItemNode");
			}
		}

		EnumItemNode.prototype.children = ['name'];
		EnumItemNode.prototype.CompileNode  = function(caller) {
			logDebug("In EnumItemNode CompileNode. Called From " + caller.type);
			return (this.name.CompileNode(this) +  " " + this.op   + " " + this.right.CompileNode(this));
		}
		return EnumItemNode;
	  })();
	  
	  var EnumeratorsNode = exports.EnumeratorsNode = EnumeratorsNode = (function() {
		function EnumeratorsNode(value) {
			this.type = "EnumeratorsNode";
			this.usesEnum = true;
			this.value = value == null ? ({}) : value;
		}
		
		EnumeratorsNode.prototype.CompileNode  = function(caller) {
			logDebug("In EnumeratorsNode CompileNode. Called From " + caller.type);
			var output = "";
			if (util.isArray(this.value)) {
				for (var i = 0; i < this.value.length;  i++) {
					output += this.value[i].CompileNode(this);
				}
			}
			else if (util.isArray(this.value.elements)) { 
				for (var i = 0; i < this.value.elements.length;  i++) {
					if (!isString(this.value.elements[i])) {
						output += this.value.elements[i].CompileNode(this);
					}
					else {
						if (i != 0 && i < this.value.elements.length) {
							output += ", ";
						}
						output += this.value.elements[i];
					}
				}
				
			}
			return  output;
		}
		
		return EnumeratorsNode;
	  })();
	  
	  var EnumDefNode = exports.EnumDefNode = EnumDefNode = (function() {
	
		function EnumDefNode(name, elements, scope) {
			this.type = "EnumDefNode";
			this.usesEnum = true;
			this.name = name;
			this.elements = elements;
			this.scope = scope;
		}

		EnumDefNode.prototype.children = ['name', 'elements', 'scope'];
		
		EnumDefNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In EnumDefNode CompileNode. Called From " + caller.type);
				var output = "";
				output += "enum " + this.name + " { " + this.elements.CompileNode(this) + " };";
				return output;
			}
			catch (e) {
				logError("Problem in enumDefNode.CompileNode. Error: " + e);
			}
		}
		
		return EnumDefNode;
	  })();
	  
	  
	  var BoolLiteralNode = exports.BoolLiteralNode = BoolLiteralNode = (function() {
	
		function BoolLiteralNode(value) {
			this.type = "BoolLiteralNode";
			this.value = value;
		}

		BoolLiteralNode.prototype.children = ['value'];
		
		BoolLiteralNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In BoolLiteralNode CompileNode. Called From " + caller.type);
				var output = "";
				output += this.value; 
				return output;
			}
			catch (e) {
				logError("Problem in BoolLiteralNode.CompileNode. Error: " + e);
			}
		}
		
		return BoolLiteralNode;
	  })();
	  
	  var NullNode = exports.NullNode = NullNode = (function() {
	
		function NullNode() {
			this.type = "NullNode";
		}

		NullNode.prototype.children = [];
		
		NullNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In NullNode CompileNode. Called From " + caller.type);
				var output = "";
				try {
					output += "null"; 
				}
				catch (e) {
					logError("NullNode error: " + e);
				}
				return output;
			}
			catch (e) {
				logError("Problem in NullNode.CompileNode. Error: " + e);
			}
		}
		
		return NullNode;
	  })();
	  
	  var LogicalNotNode = exports.LogicalNotNode = LogicalNotNode = (function() {
	
		function LogicalNotNode(value) {
			this.type = "LogicalNotNode";
			this.value = value;
		}

		LogicalNotNode.prototype.children = ['value'];
		
		LogicalNotNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In LogicalNotNode CompileNode. Called From " + caller.type);
				var output = "!";
				if (isString(this.value)) {
					output += this.value;
				}
				else {
					output += this.value.CompileNode(this);
				}
				return output;
			}
			catch (e) {
				logError("Problem in LogicalNotNode.CompileNode. Error: " + e);
			}
		}
		
		return LogicalNotNode;
	  })();
	  
	  
	  var BinaryLogicalNode = exports.BinaryLogicalNode = BinaryLogicalNode = (function() {
	
		function BinaryLogicalNode(left, op, right) {
			this.type = "BinaryLogicalNode";
			 this.left = left; 
			 this.op = op; 
			 this.right = right; 
			 /*if (w) 
				this.NoIn = w;*/
		}

		BinaryLogicalNode.prototype.children = ['left', 'op', 'right'];
		
		BinaryLogicalNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In BinaryLogicalNode CompileNode. Called From " + caller.type);
				var output = "";
				if (isString(this.left)) {
					output += this.left; 
				}
				else {
					output +=  this.left.CompileNode(this);
				}
				output += " " +  this.op + " ";
				if (isString(this.right)) {
					output += this.right; 
				}
				else {
					output +=  this.right.CompileNode(this);
				}
				return output;
			}
			catch (e) {
				logError("Problem in BinaryLogicalNode.CompileNode. Error: " + e);
			}
		}
		
		return BinaryLogicalNode;
	  })();
	  
	  
	  var GroupNode = exports.GroupNode = GroupNode = (function() {
	
		function GroupNode(value) {
			this.type = "GroupNode";
			this.value = value;
		}

		GroupNode.prototype.children = ['value'];
		
		GroupNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In GroupNode CompileNode. Called From " + caller.type);
				var output = "";
				output += "(";
				if (isString(this.value)) {
					output += this.value;
				}
				else {
					output += this.value.CompileNode(this);
				}
				output += ")";
				return output;
			}
			catch (e) {
				logError("Problem in GroupNode.CompileNode. Error: " + e);
			}
		}
		
		return GroupNode;
	  })();
	  
	  
	  var SwitchNode = exports.SwitchNode = SwitchNode = (function() {
	
		function SwitchNode(expr, body) {
			this.type = "SwitchNode";
			this.expr = expr;
			this.body = body;
		}

		SwitchNode.prototype.children = ['expr', 'body'];
		
		SwitchNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In SwitchNode CompileNode. Called From " + caller.type);
				var output = tabIt() + "switch (";
				if (isString(this.expr)) {
					output += this.expr;
				}
				else {
					output += this.expr.CompileNode(this);
				}
				output += ")";
				output +=  this.body.CompileNode(this);
				return output;
			}
			catch (e) {
				logError("Problem in SwitchNode.CompileNode. Error: " + e);
			}
		}
		
		return SwitchNode;
	  })();
	  
	  var CaseBlockNode = exports.CaseBlockNode = CaseBlockNode = (function() {
	
		function CaseBlockNode(firstBlock, defaultBlock, otherBlocks) {
			this.type = "CaseBlockNode";
			this.firstBlock = firstBlock;
			this.defaultBlock = defaultBlock;
			this.otherBlocks = otherBlocks;
		}

		CaseBlockNode.prototype.children = ['firstBlock', 'defaultBlock', 'otherBlocks'];
		
		CaseBlockNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In CaseBlockNode CompileNode. Called From " + caller.type);
				var output = tabIt() + "\n";
				output += tabIt() + "{\n";
				currDepth++;
				output += this.firstBlock.CompileNode(this);
				output +=  "\n";
				currDepth--;
				output += tabIt() + "}\n";
				return output;
			}
			catch (e) {
				logError("Problem in CaseBlockNode.CompileNode. Error: " + e);
			}
		}
		
		return CaseBlockNode;
	  })();
	  
	  var CaseClauseNode = exports.CaseClauseNode = CaseClauseNode = (function() {
	
		function CaseClauseNode(expr, body) {
			this.type = "CaseClauseNode";
			this.expr = expr;
			this.body = body;
		}

		CaseClauseNode.prototype.children = ['expr', 'value'];
		
		CaseClauseNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In CaseClauseNode CompileNode. Called From " + caller.type);
				var output = tabIt() + "case ";
				if (isString(this.expr)) {
					output += this.expr;
				}
				else {
					output += this.expr.CompileNode(this);
				}
				output += ":\n";
				currDepth++;
				if (!this.body != null) {
					output += this.body.CompileNode(this);
				}
				currDepth--;
				return output;
			}
			catch (e) {
				logError("Problem in CaseClauseNode.CompileNode. Error: " + e);
			}
		}
		
		return CaseClauseNode;
	  })();
	  
	  
	  var ClauseListNode = exports.ClauseListNode = ClauseListNode = (function() {
	
		ClauseListNode.prototype.elements = [];
		function ClauseListNode(firstElement, otherElements) {
			this.type = "ClauseListNode";
			try {
				this.elements = lr(firstElement, otherElements);
			}
			catch (e) {
				logError("error calling lr() for ClauseListNode"  + e);
			}
		}

		ClauseListNode.prototype.children = ['elements'];
		
		ClauseListNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In ClauseListNode CompileNode. Called From " + caller.type);
				var output = "";
				if (util.isArray(this.elements)) {
					var len = this.elements.length;
					for (var i = 0; i < len; i++) {
						try {
							output += this.elements[i].CompileNode(this);
						}
						catch (e) {
							logError("Error calling compileNode on ClauseListNode->this.elements[" + i + "]");
						}
					}
				}
				else {
					console.log("ClauseListNode->this.elements does not seem to be an array");
				}
				return output;
			}
			catch (e) {
				logError("Problem in ClauseListNode.CompileNode. Error: " + e);
			}
		}
		
		return ClauseListNode;
	  })();
	  
	  
	  var BreakNode = exports.BreakNode = BreakNode = (function() {
	
		function BreakNode(value) {
			this.type = "BreakNode";
			this.value = value;
		}

		BreakNode.prototype.children = ['value'];
		
		BreakNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In BreakNode CompileNode. Called From " + caller.type);
				var output = tabIt();
				output += "break;\n"; 
				return output;
			}
			catch (e) {
				logError("Problem in BreakNode.CompileNode. Error: " + e);
			}
		}
		
		return BreakNode;
	  })();
	  
	  
	  var TryNode = exports.TryNode = TryNode = (function() {
	
		function TryNode(block, katch) {
			this.type = "TryNode";
			this.block = block;
			this.katch = katch;
		}

		TryNode.prototype.children = ['value'];
		
		TryNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In TryNode CompileNode. Called From " + caller.type);
				var output = "";
				output += tabIt() + "try {\n";
				currDepth++;
				output += this.block.CompileNode(this);
				currDepth--;
				output += tabIt() + "}\n";
				if (this.katch != null) {
					output += this.katch.CompileNode(this);
				}
				return output;
			}
			catch (e) {
				logError("Problem in TryNode.CompileNode. Error: " + e);
			}
		}
		
		return TryNode;
	  })();
	  
	  var CatchNode = exports.CatchNode = CatchNode = (function() {
	
		function CatchNode(parm, block) {
			this.type = "CatchNode";
			this.parm = parm;
			this.block = block;
		}

		CatchNode.prototype.children = ['value'];
		
		CatchNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In CatchNode CompileNode. Called From " + caller.type);
				var output = "";
				output += tabIt() + "catch(" + this.parm + ") {";
				currDepth++;
				var blockStr = (this.block.expressions == null) ? "" :  this.block.CompileNode(this);
				output += blockStr;
				currDepth--;
				output += tabIt() + "}\n";
				return output;
			}
			catch (e) {
				logError("Problem in CatchNode.CompileNode. Error: " + e);
			}
		}
		
		return CatchNode;
	  })();
	  
	  var ConditionalNode = exports.ConditionalNode = ConditionalNode = (function() {
	
		function ConditionalNode(cond, exprTrue, exprFalse) {
			this.type = "ConditionalNode";
			this.cond = cond;
			this.exprTrue = exprTrue;
			this.exprFalse = exprFalse;
		}

		ConditionalNode.prototype.children = ['value'];
		
		ConditionalNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In ConditionalNode CompileNode. Called From " + caller.type);
				var output = "";
				if (isString(this.cond)) {
					output += this.cond;
				}
				else {
					output += this.cond.CompileNode(this);
				}
				output += " ? ";
				if (isString(this.exprTrue)) {
					output += this.exprTrue;
				}
				else {
					output += this.exprTrue.CompileNode(this);
				}
				output += " : ";
				if (isString(this.exprFalse)) {
					output += this.exprFalse;
				}
				else {
					output += this.exprFalse.CompileNode(this);
				}
				return output;
			}
			catch (e) {
				logError("Problem in ConditionalNode.CompileNode. Error: " + e);
			}
		}
		
		return ConditionalNode;
	  })();
	  
	  var TypeOfNode = exports.TypeOfNode = TypeOfNode = (function() {
	
		function TypeOfNode(value) {
			this.type = "TypeOfNode";
			this.value = value;
		}

		TypeOfNode.prototype.children = ['value'];
		
		TypeOfNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In TypeOfNode CompileNode. Called From " + caller.type);
				var output = "";
				output += "typeof ";
				if (isString(this.value)) {
					output += this.value;
				}
				else {
					output += this.value.CompileNode(this);
				}
				return output;
			}
			catch (e) {
				logError("Problem in TypeOfNode.CompileNode. Error: " + e);
			}
		}
		
		return TypeOfNode;
	  })();
	  
	  var NegateNode = exports.NegateNode = NegateNode = (function() {
	
		function NegateNode(value) {
			this.type = "NegateNode";
			this.value = value;
		}

		NegateNode.prototype.children = ['value'];
		
		NegateNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In NegateNode CompileNode. Called From " + caller.type);
				var output = "";
				output += "-";
				if (isString(this.value)) {
					output += this.value;
				}
				else {
					output += this.value.CompileNode(this);
				}
				return output;
			}
			catch (e) {
				logError("Problem in NegateNode.CompileNode. Error: " + e);
			}
		}
		
		return NegateNode;
	  })();
	  
	  var WhileNode = exports.WhileNode = WhileNode = (function() {
	
		function WhileNode(cond, body) {
			this.type = "WhileNode";
			this.cond = cond;
			this.body = body;
		}

		WhileNode.prototype.children = ['value'];
		
		WhileNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In WhileNode CompileNode. Called From " + caller.type);
				var output = "";
				if (isString(this.cond)) {
					output += this.cond;
				}
				else {
					output += this.cond.CompileNode(this);
				}
				if (isString(this.body)) {
					output += this.body;
				}
				else {
					output += this.body.CompileNode(this);
				}
				return output;
			}
			catch (e) {
				logError("Problem in WhileNode.CompileNode. Error: " + e);
			}
		}
		
		return WhileNode;
	  })();
	  
	  var ThrowNode = exports.ThrowNode = ThrowNode = (function() {
	
		function ThrowNode(value) {
			this.type = "ThrowNode";
			this.value = value;
		}

		ThrowNode.prototype.children = ['value'];
		
		ThrowNode.prototype.CompileNode  = function(caller) {
			try {
				logDebug("In ThrowNode CompileNode. Called From " + caller.type);
				var output = "";
				output += tabIt() + "throw ";
				if (isString(this.value)) {
					ouput += this.value;
				}
				else {
					output += this.value.CompileNode(this);
				}
				output += ";\n";
				return output;
			}
			catch (e) {
				logError("Problem in ThrowNode.CompileNode. Error: " + e);
			}
		}
		
		return ThrowNode;
	  })();
	  ///////////////////////////////////////////////////////////////////////////////////////////////
	var OpAnd = "&&";
	exports.OpAnd = OpAnd;
	var OpAndEq = "&=";
	var OpBitAnd = "^&";
	var opBitOr = "^|";
	var opBitXOr = "^|";
	var opDivEq = "/=";
	var OpEqEq = "==";
	exports.OpEqEq = OpEqEq;
	var OpEqual = "="; 
	exports.OpEqual = OpEqual;
	var OpGreater = ">";
	exports.OpGreater = OpGreater;
	var opGreaterEq = ">=";
	var opIn  = "In";
	var opInstanceOf  = "instanceof";
	var opLShift  = "<<";
	var OpLess = "<";
	exports.OpLess = OpLess;
	var opLessEq  = "<=";
	var opMinusEq = "-=";
	var OpMinusMinus = "--";
	exports.OpMinusMinus = OpMinusMinus;
	var opModEq  = "%=";
	var opMultEq  = "*=";
	var opNotEq  = "!=";
	exports.opNotEq = opNotEq;
	var opOr  = "||";
	exports.opOr = opOr;
	var opOrEq  = "|=";
	var opPlusEq  = "+=";
	var OpPlusPlus = "++";
	exports.OpPlusPlus = OpPlusPlus;
	var opRShift = "<<";
	var OpStrEq = "===";
	exports.OpStrEq = OpStrEq;
	var opStrNEq = "!==";
	exports.opStrNEq = opStrNEq;
	var opURShift = "dunno";
	var opXOrEq = "dunno 2";

	////////////////////////////////////////////////////////////////////////////////
	function isString(toCheck) {
		if (typeof toCheck === 'string') {
			return true;
		}
		return false;
	}

	function logDebug(msg) {
		if (isDebug)
			console.log(msg);
	}
	
	function logError(msg) {
		console.log(msg);
	}
	
	function lr(l, r) { 
		var value = []; 
		if (r === undefined || r === null) {
			value = [ l ]; 
		} else { 
			try {
			    if (l.elements === undefined) {
					value = [l];
				}
				else {
					value = l.elements; 
				}
				value.push(r); 
			}
			catch (e) {
				logError("lr() - Error (value) " + util.inspect(value));
				logError("lr() - Error (l) " + util.inspect(l));
				throw e;
			}
		} 
		return value; 
	}
	
	function tabIt() {
		if (currDepth <= 0)
			return "";
		var tabs = "";
		for (var i = 0; i < currDepth; i++) {
			tabs += "\t";
		}
		return tabs;
	}
	
}).call(this);