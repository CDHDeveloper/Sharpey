%lex
%%



"//"[^\n]*                       /* skip SingleLineComment */
"/*"(.|\n|\r)*?"*/"              /* skip MultiLineComment */
\"("\\\\"|'\"'|[^"\n\r])*\"         return 'STRINGLITERAL'
"'"("\\\\"|"\'"|[^'\n\r])*"'"       return 'STRINGLITERAL'
(("0"|[1-9][0-9]*)("."[0-9]*)?|"."[0-9]+)([eE][+-]?[0-9]+)?|[0][xX][0-9a-fA-F]+  return 'NUMBER'
"/"([^\n\r*\\\/\[]|"\\"[^\n\r]|"["([^\n\r]|"\\]"|"\\"[^\n\r])*"]")([^\n\r\\\/\[]|"\\"[^\n\r]|"["([^\n\r]|"\\]"|"\\"[^\n\r])*"]")*"/"[a-zA-Z0-9]*  return 'REGEXP'
">>>="                return 'URSHIFTEQUAL'
"!=="                 return 'STRNEQ'
"==="                 return 'STREQ'
">>>"                 return 'URSHIFT'
"<<="                 return 'LSHIFTEQUAL'
">>="                 return 'RSHIFTEQUAL'
"%="                  return 'MODEQUAL'
"&&"                  return 'AND'
"&="                  return 'ANDEQUAL'
"*="                  return 'MULTEQUAL'
"++"                  return 'PLUSPLUS'
"+="                  return 'PLUSEQUAL'
"--"                  return 'MINUSMINUS'
"-="                  return 'MINUSEQUAL'
"/="                  return 'DIVEQUAL'
"<<"                  return 'LSHIFT'
"<="                  return 'LE'
">="                  return 'GE'
"=="                  return 'EQEQ'
">>"                  return 'RSHIFT'
"^="                  return 'XOREQUAL'
"|="                  return 'OREQUAL'
"||"                  return 'OR'
"&"                   return "&"
"%"                   return "%"
"!="                  return 'NE'
"("                   return '('
")"                   return ')'
"+"                   return '+'
"*"                   return 'ASTERISK'
","                   return ','
"-"                   return '-'
"!"                   return '!'
"/"                   return '/'
":"                   return ':'
";"                   return ';'
"<"                   return '<'
"="                   return 'EQUALS'
">"                   return '>'
"?"                   return '?'
"{"					  return '{'
"}"					  return '}'
"["                   return '['
"]"                   return ']'
"^"                   return '^'
"|"                   return '|'
"~"                   return '~'
"&"                   return '&'
"."					  return 'DOT'
"break"               return 'BREAK'
"case"                return 'CASE'
"catch"               return 'CATCH'
"continue"            return 'CONTINUE'
"default"             return 'DEFAULT'
"delete"              return 'DELETE'
"do"                  return 'DO'
"else"                return 'ELSE'
"false"               return 'FALSETOKEN'
"finally"             return 'FINALLY'
"for"                 return 'FOR'
"function"            return 'FUNCTION'
"get"                 return 'GET'
"if"                  return 'IF'
"in"                  return 'INTOKEN'
"instanceof"          return 'INSTANCEOF'
"new"                 return 'NEW'
"null"                return 'NULLTOKEN'
"return"              return 'RETURN'
"set"                 return 'SET'
"switch"              return 'SWITCH'
"this"                return 'THIS'
"throw"               return 'THROW'
"true"                return 'TRUETOKEN'
"try"                 return 'TRY'
"typeof"              return 'TYPEOF'
"var"                 return 'VAR'
"const"               return 'CONST'
"void"                return 'VOID'
"while"               return 'WHILE'
"whith"               return 'WITH'
"string"			  return 'STRINGTYPE'
"object"			  return 'OBJECTTYPE'
"int"			  	  return 'INTTYPE'
"float"			  	  return 'FLOATTYPE'
"void" 				  return 'VOIDTYPE'
"bool"			  	  return 'BOOLTYPE'
"foreach"			  return 'FOREACH'
"namespace"			  return 'NAMESPACE'
"private"			  return 'PRIVATE'
"public"			  return 'PUBLIC'
"class"				  return 'CLASS'
"import"			  return 'IMPORT'
"enum"				  return 'ENUM'
"As"				  return 'AS'
(((([A-Z]|[a-z])|"$"|"_"|("\\"("u"([0-9a-fA-F]){4})))((([A-Z]|[a-z])|"$"|"_"|("\\"("u"([0-9a-fA-F]){4})))|[0-9])+)|(([A-Z]|[a-z])|"$"|"_"|("\\"("u"([0-9a-fA-F]){4})))) return 'IDENTIFIER'
\s+                   /* skip whitespace */
\n                    /* */
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex



%start Program
%nonassoc IF_WITHOUT_ELSE
%nonassoc ELSE

%%
Program
	: NamespaceBlock															{ return new yy.ProgramNode($1); }
    ;

	NameSpaceName
	: NAMESPACE IdentifierChain													{ $$ = $2; }
	;
	
NamespaceBlock
	: NameSpaceName '{' NamespaceElements '}' 									{ $$ = new yy.NameSpaceNode($1, $3); }
	;
	
/* This allows us to use Dot Notation. IE: System.Linq.Blah.Blah */
IdentifierChain
	: IDENTIFIER																{ $$ =  new yy.Accessor2Node($1);  }
	| IdentifierChain DOT IDENTIFIER											{ $$ = new yy.Accessor2Node($1, $3);  }
	;

NamespaceElements
	: NamespaceElement															{ $$ = new yy.NamespaceElementsNode($1);}
	| NamespaceElements NamespaceElement 										{ $$ = new yy.NamespaceElementsNode($1, $2);}
	;
	
NamespaceElement
	: ClassDeclaration													{ $$ = $1; }
	| ImportStatement													{ $$ = $1; }
	| Statement
	;
	
ImportStatement
	: IMPORT IdentifierChain ';'											{ $$ = new yy.ImportNode($2, $2, null); console.log("IMPORT: " + $2); }
	| IMPORT IdentifierChain AS IDENTIFIER ';'							{ $$ = new yy.ImportNode($2, $4, null);}
	| IMPORT '(' STRINGLITERAL ')' ';'								{ $$ = new yy.ImportNode(null, $3, $3);}
	| IMPORT '(' STRINGLITERAL ')' AS IDENTIFIER ';'				{ $$ = new yy.ImportNode(null, $6, $3);}
	;
	
ClassName
	: CLASS IDENTIFIER													{ $$ = $2;  }
	;
	
ClassDeclaration
	: ScopedClassDeclaration 											{ $$ = $1; }
	| UnscopedClassDeclaration											{ $$ = $1; }
	;

ScopedClassDeclaration	
	: AccessDeclaration ClassName '{' '}' 								{ $$ = new yy.ClassNode($2, null, $1, null);  }
	| AccessDeclaration ClassName '{' ClassElements '}' 				{ $$ = new yy.ClassNode($2, $4, $1, null); 	}
	| AccessDeclaration ClassName ClassExtends '{' '}' 					{  $$ = new yy.ClassNode($2, null, $1, $3); }
	| AccessDeclaration ClassName ClassExtends '{' ClassElements '}' 	{ $$ = new yy.ClassNode($2, $5, $1, $3); }
	;
	
// Note: Making default scope public
UnscopedClassDeclaration	
	: ClassName '{' '}'													{ $$ = new yy.ClassNode($1, null, 'PUBLIC', null); }
	| ClassName '{' ClassElements '}'									{ $$ = new yy.ClassNode($1, $3, 'PUBLIC', null);  }
	| ClassName ClassExtends '{' '}'									{ $$ = new yy.ClassNode($1, null, 'PUBLIC', $2); }
	| ClassName ClassExtends '{' ClassElements '}'						{ $$ = new yy.ClassNode($1, $4, 'PUBLIC', $2); }
	;
	
/* Class Blah : OtherBlah */
ClassExtends
	: ':' IdentifierChain 												{ $$ = $2; }
	;

ClassElements
	: ClassElement													{  $$ = new yy.ClassElementsNode($1, null,yy.yylineno); }
	| ClassElements ClassElement									{ $$ = new yy.ClassElementsNode($1, $2,yy.yylineno); }
	;

ClassElement
	: Statement														{   $$ = $1; }
	| PropertyDefinition											{ $$ = $1; }
	;
	
EnumDefinition
	: AccessDeclaration ENUM  IDENTIFIER Enumerators 						{ $$ = new yy.EnumDefNode($3, $4, $1); }
	|  ENUM IDENTIFIER Enumerators 											{ $$ = new yy.EnumDefNode($2, $3, 'PRIVATE');  }
	;
	
Enumerators 
	: '{' EnumeratorList '}'											{ $$ = new yy.EnumeratorsNode($2); }
	;
	
EnumeratorList
    : EnumItemSpec														{ $$ = new yy.EnumItemNode($1); }
    | EnumeratorList ',' EnumItemSpec										{ $$ = new yy.EnumItemNode($1, $3);  }
	;
	
EnumItemSpec
	: IDENTIFIER
	| IDENTIFIER EQUALS NUMBER
	;
	
/* 
 *  This defines properties somewhat similar to C#
 *  Examples:
 *  var myProp { get { return _stuff; } set { _stuff = value; };
*/
PropertyDefinition
	: Type IDENTIFIER '{' GetSetDeclaration '}' 
	| AccessDeclaration Type IDENTIFIER '{' GetSetDeclaration '}'
	;
	
GetSetDeclaration
	: GetDeclaration SetDeclaration
	| GetDeclaration
	| SetDeclaration
	;
	
GetDeclaration
	: GET Block
	;

SetDeclaration	
	: SET Block
	;
	
Type	
	: VAR																{ $$ = new yy.TypeNode('VAR'); }
	| STRINGTYPE														{ $$ = new yy.TypeNode('STRINGTYPE'); }
	| OBJECTTYPE														{ $$ = new yy.TypeNode('OBJECTTYPE'); }
	| INTTYPE															{ $$ = new yy.TypeNode('INTTYPE');  }
	| FLOATTYPE															{ $$ = new yy.TypeNode('INTTYPE');  }
	| DATETYPE															{ $$ = new yy.TypeNode('DATETYPE'); }
	| TIMETYPE															{ $$ = new yy.TypeNode('TIMETYPE'); }
	| BOOLTYPE															{ $$ = new yy.TypeNode('BOOLTYPE'); }
	| VOIDTYPE															{ $$ = new yy.TypeNode('VOIDTYPE'); }
	/*| IDENTIFIER									{ $$ = new TypeNode($1); }*/
	;	
	
AccessDeclaration
	: AccesKeyword														{ $$ = $1; }
	;

AccesKeyword
	: PRIVATE															{ $$ = 'PRIVATE';  }
	| PUBLIC															{ $$ = 'PUBLIC'; }
	;

  
/***** C.2.12 Attributes *****/
AttributesOpt
  : /* Nothing */
  | Attributes
  ;
  
Attributes
  : AttributeSections
  ;
  
AttributeSections
  : AttributeSection
  | AttributeSections AttributeSection
  ;
  
AttributeSection
  : '@[' AttributeTargetSpecifierOpt AttributeList ']@'
  // | '@[' AttributeTargetSpecifierOpt AttributeList COMMA ']@'
  ;
  
AttributeTargetSpecifierOpt
  : /* Nothing */
  | AsttributeTargetSpecifier
  ;
  
AsttributeTargetSpecifier
  : AttributeTarget ':'
  ;
  
AttributeTarget
  : ASSEMBLY
  | FIELD
  | EVENT
  | METHOD
  | MODULE
  | PARAM
  | PROPERTY
  | RETURN
  | TYPE
  ;
  
AttributeList
  : Attribute
  | AttributeList COMMA Attribute
  ;
  
Attribute
  : AttributeArgumentsOpt // AttributeName AttributeArgumentsOpt
  ;
  
AttributeArgumentsOpt
  : /* Nothing */
  | AttributeArguments
  ;
AttributeName
  : TypeName
  ;
AttributeArguments
  : '(' ExprOpt ')'
  ;
  
SourceElements
    : SourceElement														{ $$ = new yy.SourceElementsNode($1); }
    | SourceElements SourceElement										{ $$ = new yy.SourceElementsNode($1, $2);}
    ;
SourceElement
	: Statement                                         				{ $$ = $1; }
	;
	
	Statement
    : Block 									
    | VariableStatement 									
    | ConstStatement 									
    | FunctionDeclaration 									
    | EmptyStatement
    | ExprStatement
    | IfStatement
    | IterationStatement
    | ContinueStatement
    | BreakStatement
    | ReturnStatement
    | WithStatement
    | SwitchStatement
    | LabelledStatement
    | ThrowStatement
    | TryStatement
    | DebuggerStatement
	| PropertyStatement
	| EnumDefinition												
	;

Literal
    : NULLTOKEN																		{ $$ = new yy.NullNode(); }
    | TRUETOKEN																		{ $$ = new yy.BoolLiteralNode(true); }
    | FALSETOKEN																	{ $$ = new yy.BoolLiteralNode(false); }
    | NUMBER																		{ $$ = new yy.NumberLiteralNode($1);  }
    | STRINGLITERAL																	{ $$ = new yy.StringLiteralNode($1);  }
    | '/'																			{ dbg("Slash " + $1); }
    | DIVEQUAL																		{ dbg("DIVEQUAL " + $1); }
    ;

Property
    : IDENTIFIER ':' AssignmentExpr
    | STRINGLITERAL ':' AssignmentExpr
    | NUMBER ':' AssignmentExpr
    | IDENTIFIER IDENTIFIER '(' ')' '{' FunctionBody '}'
    | IDENTIFIER IDENTIFIER '(' FormalParameterList ')' '{' FunctionBody '}'
    ;

PropertyList
    : Property
    | PropertyList ',' Property
    ;

PrimaryExpr
    : PrimaryExprNoBrace															
    | '{' '}'
    | '{' PropertyList '}'
    | '{' PropertyList ',' '}'
    ;

PrimaryExprNoBrace
    : THISTOKEN																		 { $$ = new yy.ThisNode(); }
    | Literal																		{ $$ = $1; }
    | ArrayLiteral										
    | IDENTIFIER																	{ $$ = $1;  }
    | '(' Expr ')'																	{ $$ = new yy.GroupNode($2); }
    ;

ArrayLiteral
    : '[' ElisionOpt ']'															{ $$ = new yy.ArrayLiteralNode($2); }
    | '[' ElementList ']'															{ $$ = new yy.ArrayLiteralNode($2); }
    | '[' ElementList ',' ElisionOpt ']'											{ $$ = new yy.ArrayLiteralNode($4, $2); }
    ;

ElementList
    : ElisionOpt AssignmentExpr														{ $$ = new yy.ElementNode($1, $2); }
    | ElementList ',' ElisionOpt AssignmentExpr										{ $$ = new yy.ElementNode($1, $3, $4); }
    ;

ElisionOpt
    : 																				{ $$ = null; }
    | Elision
    ;

Elision
    : ','																			{ $$ = 1; }
    | Elision ','																	{ $$ = $1 + 1; }
    ;

MemberExpr
    : PrimaryExpr																	
    | FunctionExpr																	
    | MemberExpr '[' Expr ']'														{ $$ = new yy.Accessor1Node($1, $3); }
    | MemberExpr DOT IDENTIFIER														{ $$ = new yy.Accessor2Node($1, $3); }
    | NEW MemberExpr Arguments														{ $$ = new yy.NewExpressionNode($2, $3);  }
    ;

MemberExprNoBF
    : PrimaryExprNoBrace															
    | MemberExprNoBF '[' Expr ']'													{ $$ = new yy.Accessor1Node($1, $3); }
    | MemberExprNoBF DOT IDENTIFIER													{ $$ = new yy.Accessor2Node($1, $3); }
    | NEW MemberExpr Arguments													
    ;

NewExpr
    : MemberExpr
    | NEW NewExpr																	{ $$ = new yy.NewExpressionNode($2); }
    ;

NewExprNoBF
    : MemberExprNoBF
    | NEW NewExpr
    ;

CallExpr
    : MemberExpr Arguments															{ $$ = new yy.FunctionCallNode($1, $2);  }
    | CallExpr Arguments															{ $$ = new yy.FunctionCallNode($1, $2); }
    | CallExpr '[' Expr ']'															{ $$ = new yy.Accessor1Node($1, $3); }
    | CallExpr DOT IDENTIFIER														{ $$ = new yy.Accessor2Node($1, $3); }
    ;

CallExprNoBF
    : MemberExprNoBF Arguments														{ $$ = new yy.FunctionCallNode($1, $2); }
    | CallExprNoBF Arguments														{ $$ = new yy.FunctionCallNode($1, $2); }
    | CallExprNoBF '[' Expr ']'
    | CallExprNoBF DOT IDENTIFIER
    ;

Arguments
    : '(' ')'																		{ $$ = new yy.ArgumentsNode(null); }
    | '(' ArgumentList ')'															{ $$ = new yy.ArgumentsNode($2); }
    ;

ArgumentList
    : AssignmentExpr																{ $$ = new yy.ArgumentListNode($1); }
    | ArgumentList ',' AssignmentExpr												{ $$ = new yy.ArgumentListNode($1, $3); }
    ;

LeftHandSideExpr
    : NewExpr																		{ LeftHandSideExpressionlineno = yylineno; }
    | CallExpr																		{ LeftHandSideExpressionlineno = yylineno; }
    ;

LeftHandSideExprNoBF
    : NewExprNoBF
    | CallExprNoBF
    ;

PostfixExpr
    : LeftHandSideExpr
    | LeftHandSideExpr PLUSPLUS														{ $$ = new yy.PostfixNode($1, yy.OpPlusPlus); }
    | LeftHandSideExpr MINUSMINUS													{ $$ = new yy.PostfixNode($1, yy.OpMinusMinus()); }
    ;

PostfixExprNoBF
    : LeftHandSideExprNoBF
    | LeftHandSideExprNoBF PLUSPLUS													{ $$ = new yy.PostfixNode($1, yy.OpPlusPlus); }
    | LeftHandSideExprNoBF MINUSMINUS												{ $$ = new yy.PostfixNode($1, yy.OpMinusMinus); }
    ;

UnaryExprCommon
    : DELETETOKEN UnaryExpr															{ $$ = new yy.DeleteNode($2); }
    | VOIDTOKEN UnaryExpr															{ $$ = new yy.VoidNode($2); }
    | TYPEOF UnaryExpr																{ $$ = new yy.TypeOfNode($2);  }
    | PLUSPLUS UnaryExpr                     										{ $$ = new yy.PrefixNode(yy.OpPlusPlus, $2); }
    | AUTOPLUSPLUS UnaryExpr                     									{ $$ = new yy.PrefixNode(yy.OpPlusPlus, $2); }
    | MINUSMINUS UnaryExpr                   										{ $$ = new yy.PrefixNode(yy.OpMinusMinus, $2); }
    | AUTOMINUSMINUS UnaryExpr                   									{ $$ = new yy.PrefixNode(yy.OpMinusMinus, $2); }
    | '+' UnaryExpr																	{ $$ = new yy.UnaryPlusNode($2); }
    | '-' UnaryExpr																	{ $$ = new yy.NegateNode($2); }
    | '~' UnaryExpr						                          					{ $$ = new yy.BitwiseNotNode($2); }
    | '!' UnaryExpr							                          				{ $$ = new yy.LogicalNotNode($2); }
    ;

UnaryExpr
    : PostfixExpr
    | UnaryExprCommon
    ;

UnaryExprNoBF
    : PostfixExprNoBF
    | UnaryExprCommon
    ;

MultiplicativeExpr
    : UnaryExpr
    | MultiplicativeExpr '*' UnaryExpr												{ $$ = new yy.MultNode($1, $3, '*'); }
    | MultiplicativeExpr '/' UnaryExpr												{ $$ = new yy.MultNode($1, $3, '/'); }
    | MultiplicativeExpr '%' UnaryExpr												{ $$ = new yy.MultNode($1, $3, '%'); }
    ;

MultiplicativeExprNoBF
    : UnaryExprNoBF
    | MultiplicativeExprNoBF '*' UnaryExpr
    | MultiplicativeExprNoBF '/' UnaryExpr
    | MultiplicativeExprNoBF '%' UnaryExpr
    ;

AdditiveExpr
    : MultiplicativeExpr
    | AdditiveExpr '+' MultiplicativeExpr												{ $$ = new yy.AddNode($1, $3, '+');  }
    | AdditiveExpr '-' MultiplicativeExpr												{ $$ = new yy.AddNode($1, $3, '-'); }
    ;

AdditiveExprNoBF
    : MultiplicativeExprNoBF
    | AdditiveExprNoBF '+' MultiplicativeExpr											{ $$ = new yy.AddNode($1, $3, '-'); }
    | AdditiveExprNoBF '-' MultiplicativeExpr											{ $$ = new yy.AddNode($1, $3, '-'); }
    ;

ShiftExpr
    : AdditiveExpr
    | ShiftExpr LSHIFT AdditiveExpr														{ $$ = new yy.ShiftNode($1, new OpLShift, $3); }
    | ShiftExpr RSHIFT AdditiveExpr														{ $$ = new yy.ShiftNode($1, new OpRShift, $3); }
    | ShiftExpr URSHIFT AdditiveExpr													{ $$ = new yy.ShiftNode($1, new OpURShift, $3); }
    ;

ShiftExprNoBF
    : AdditiveExprNoBF
    | ShiftExprNoBF LSHIFT AdditiveExpr
    | ShiftExprNoBF RSHIFT AdditiveExpr
    | ShiftExprNoBF URSHIFT AdditiveExpr
    ;

RelationalExpr
    : ShiftExpr
    | RelationalExpr '<' ShiftExpr														{ $$ = new yy.RelationalNode($1, yy.OpLess, $3); }
    | RelationalExpr '>' ShiftExpr               										{ $$ = new yy.RelationalNode($1, yy.OpGreater, $3); }
    | RelationalExpr LE ShiftExpr                										{ $$ = new yy.RelationalNode($1, yy.OpLessEq, $3); }
    | RelationalExpr GE ShiftExpr														{ $$ = new yy.RelationalNode($1, yy.OpGreaterEq, $3); }
    | RelationalExpr INSTANCEOF ShiftExpr						        				{ $$ = new yy.RelationalNode($1, yy.OpInstanceOf, $3); }
    | RelationalExpr INTOKEN ShiftExpr							               			{ $$ = new yy.RelationalNode($1, yy.OpIn, $3); }
    ;

RelationalExprNoIn
    : ShiftExpr
    | RelationalExprNoIn '<' ShiftExpr													{ $$ = new yy.RelationalNode($1, yy.OpLess, $3, true); }
    | RelationalExprNoIn '>' ShiftExpr													{ $$ = new yy.RelationalNode($1, yy.OpGreater, $3, true); }
    | RelationalExprNoIn LE ShiftExpr													{ $$ = new yy.RelationalNode($1, yy.OpLessEq, $3, true); }
    | RelationalExprNoIn GE ShiftExpr													{ $$ = new yy.RelationalNode($1, yy.OpGreaterEq, $3, true); }
    | RelationalExprNoIn INSTANCEOF ShiftExpr											{ $$ = new yy.RelationalNode($1, yy.OpInstanceOf, $3, true); }
    ;

RelationalExprNoBF
    : ShiftExprNoBF
    | RelationalExprNoBF '<' ShiftExpr													{ $$ = new yy.RelationalNode($1, yy.OpLess, $3, true); }
    | RelationalExprNoBF '>' ShiftExpr													{ $$ = new yy.RelationalNode($1, yy.OpGreater, $3, true); }
    | RelationalExprNoBF LE ShiftExpr													{ $$ = new yy.RelationalNode($1, yy.OpLessEq, $3, true); }
    | RelationalExprNoBF GE ShiftExpr													{ $$ = new yy.RelationalNode($1, yy.OpGreaterEq, $3, true); }
    | RelationalExprNoBF INSTANCEOF ShiftExpr											{ $$ = new yy.RelationalNode($1, yy.OpInstanceOf, $3, true); }
    | RelationalExprNoBF INTOKEN ShiftExpr
    ;

EqualityExpr
    : RelationalExpr
    | EqualityExpr EQEQ RelationalExpr													{ $$ = new yy.EqualNode($1, yy.OpEqEq, $3); }
    | EqualityExpr NE RelationalExpr													{  $$ = new yy.EqualNode($1, "!=", $3); }
    | EqualityExpr STREQ RelationalExpr													{  $$ = new yy.EqualNode($1, yy.OpStrEq, $3); }
    | EqualityExpr STRNEQ RelationalExpr												{ $$ = new yy.EqualNode($1, yy.OpStrNEq, $3); }
    ;

EqualityExprNoIn
    : RelationalExprNoIn
    | EqualityExprNoIn EQEQ RelationalExprNoIn											{ $$ = new yy.EqualNode($1, yy.OpEqEq, $3, true); }
    | EqualityExprNoIn NE RelationalExprNoIn											{ $$ = new yy.EqualNode($1, "!=", $3, true); }
    | EqualityExprNoIn STREQ RelationalExprNoIn											{ $$ = new yy.EqualNode($1, yy.OpStrEq, $3, true); }
    | EqualityExprNoIn STRNEQ RelationalExprNoIn										{ $$ = new yy.EqualNode($1, yy.OpStrNEq, $3, true); }
    ;

EqualityExprNoBF
    : RelationalExprNoBF
    | EqualityExprNoBF EQEQ RelationalExpr
    | EqualityExprNoBF NE RelationalExpr												{ console.log("EqualityExprNoBF NE RelationalExpr"); }
    | EqualityExprNoBF STREQ RelationalExpr
    | EqualityExprNoBF STRNEQ RelationalExpr
    ;

BitwiseANDExpr
    : EqualityExpr
    | BitwiseANDExpr '&' EqualityExpr												{ $$ = new yy.BitOperNode($1, yy.OpBitAnd, $3); }
    ;

BitwiseANDExprNoIn
    : EqualityExprNoIn
    | BitwiseANDExprNoIn '&' EqualityExprNoIn
    ;

BitwiseANDExprNoBF
    : EqualityExprNoBF
    | BitwiseANDExprNoBF '&' EqualityExpr											{ $$ = new yy.BitOperNode($1, yy.OpBitAnd, $3); }
    ;

BitwiseXORExpr
    : BitwiseANDExpr
    | BitwiseXORExpr '^' BitwiseANDExpr												{ $$ = new yy.BitOperNode($1, OpBitXOr, $3); }
    ;

BitwiseXORExprNoIn
    : BitwiseANDExprNoIn
    | BitwiseXORExprNoIn '^' BitwiseANDExprNoIn
    ;

BitwiseXORExprNoBF
    : BitwiseANDExprNoBF
    | BitwiseXORExprNoBF '^' BitwiseANDExpr										{ $$ = new yy.BitOperNode($1, OpBitXOr, $3); }
    ;

BitwiseORExpr
    : BitwiseXORExpr
    | BitwiseORExpr '|' BitwiseXORExpr											{ $$ = new yy.BitOperNode($1, OpBitOr, $3); }
    ;

BitwiseORExprNoIn
    : BitwiseXORExprNoIn
    | BitwiseORExprNoIn '|' BitwiseXORExprNoIn
    ;

BitwiseORExprNoBF
    : BitwiseXORExprNoBF
    | BitwiseORExprNoBF '|' BitwiseXORExpr
    ;

LogicalANDExpr
    : BitwiseORExpr
    | LogicalANDExpr AND BitwiseORExpr														{ $$ = new yy.BinaryLogicalNode($1, yy.OpAnd, $3); }
    ;

LogicalANDExprNoIn
    : BitwiseORExprNoIn
    | LogicalANDExprNoIn AND BitwiseORExprNoIn
    ;

LogicalANDExprNoBF
    : BitwiseORExprNoBF																		
    | LogicalANDExprNoBF AND BitwiseORExpr													{ $$ = new yy.BinaryLogicalNode($1, yy.OpAnd, $3); }
    ;

LogicalORExpr
    : LogicalANDExpr
    | LogicalORExpr OR LogicalANDExpr														{ $$ = new yy.BinaryLogicalNode($1, "||", $3); }
    ;

LogicalORExprNoIn
    : LogicalANDExprNoIn
    | LogicalORExprNoIn OR LogicalANDExprNoIn
    ;

LogicalORExprNoBF
    : LogicalANDExprNoBF																	
    | LogicalORExprNoBF OR LogicalANDExpr													{ $$ = new yy.BinaryLogicalNode($1, "||", $3); console.log("LogicalORExprNoBF OR LogicalANDExpr"); }
    ;

ConditionalExpr
    : LogicalORExpr
    | LogicalORExpr '?' AssignmentExpr ':' AssignmentExpr									{ $$ = new yy.ConditionalNode($1, $3, $5); }
    ;

ConditionalExprNoIn
    : LogicalORExprNoIn
    | LogicalORExprNoIn '?' AssignmentExprNoIn ':' AssignmentExprNoIn				
    ;

ConditionalExprNoBF
    : LogicalORExprNoBF																	
    | LogicalORExprNoBF '?' AssignmentExpr ':' AssignmentExpr							{ $$ = new yy.ConditionalNode($1, $3, $5); }
    ;

AssignmentExpr
    : ConditionalExpr
    | LeftHandSideExpr AssignmentOperator AssignmentExpr								{ $$ = new yy.AssignNode($1, $2, $3);}
    ;

AssignmentExprNoIn
    : ConditionalExprNoIn
    | LeftHandSideExpr AssignmentOperator AssignmentExprNoIn
    ;

AssignmentExprNoBF
    : ConditionalExprNoBF											
    | LeftHandSideExprNoBF AssignmentOperator AssignmentExpr		 					{ $$ = new yy.AssignNode($1, $2, $3);}
    ;

AssignmentOperator
    : EQUALS																			{ $$ = yy.OpEqual; }
    | PLUSEQUAL																			{ $$ = yy.OpPlusEq; }
    | MINUSEQUAL																		{ $$ = yy.OpMinusEq; }
    | MULTEQUAL																			{ $$ = yy.OpMultEq; }
    | DIVEQUAL																			{ $$ = yy.OpDivEq; }
    | LSHIFTEQUAL																		{ $$ = yy.OpLShift; }
    | RSHIFTEQUAL																		{ $$ = yy.OpRShift; }
    | URSHIFTEQUAL																		{ $$ = yy.OpURShift; }
    | ANDEQUAL																			{ $$ = yy.OpAndEq; }
    | XOREQUAL																			{ $$ = yy.OpXOrEq; }
    | OREQUAL																			{ $$ = yy.OpOrEq; }
    | MODEQUAL																			{ $$ = yy.OpModEq; }
    ;

Expr
    : AssignmentExpr
    | Expr ',' AssignmentExpr															{ $$ = new yy.CommaNode($1, $3); }
    ;

ExprNoIn
    : AssignmentExprNoIn
    | ExprNoIn ',' AssignmentExprNoIn
    ;

ExprNoBF
    : AssignmentExprNoBF												
    | ExprNoBF ',' AssignmentExpr														{ $$ = new yy.CommaNode($1, $3); }
    ;


Block
    : '{' '}'																			{ $$ = new yy.BlockNode(null); }
    | '{' SourceElements '}'															{ $$ = new yy.BlockNode($2); }
    ;

VariableStatement
    : Type VariableDeclarationList ';'													{ $$ = new yy.VarStatementNode($2, 'PRIVATE');  }
    | AccessDeclaration Type VariableDeclarationList ';'								{ $$ = new yy.VarStatementNode($3, $1); }
    | Type VariableDeclarationList error												{ dbg("VAR VariableDeclarationList error"); }
    ;

VariableDeclarationList
    : IDENTIFIER																		{ $$ = new yy.VarDeclListNode($1);  }
    | IDENTIFIER Initializer															{ $$ = new yy.VarDeclListNode($1, $2);  }
    | VariableDeclarationList ',' IDENTIFIER
    | VariableDeclarationList ',' IDENTIFIER Initializer
    ;

VariableDeclarationListNoIn
    : IDENTIFIER																		{ $$ = new yy.VarDeclListNode($1); }
    | IDENTIFIER InitializerNoIn														{ $$ = new yy.VarDeclListNode($1, $2); }	
    | VariableDeclarationListNoIn ',' IDENTIFIER
    | VariableDeclarationListNoIn ',' IDENTIFIER InitializerNoIn
    ;

ConstStatement
    : CONSTTOKEN ConstDeclarationList ';'
    | CONSTTOKEN ConstDeclarationList error
    ;

ConstDeclarationList
    : ConstDeclaration
    | ConstDeclarationList ',' ConstDeclaration
    ;

ConstDeclaration
    : IDENTIFIER
    | IDENTIFIER Initializer
    ;

Initializer
    : EQUALS AssignmentExpr																{ $$ = new yy.AssignExpressionNode($2); }
    ;

InitializerNoIn
    : EQUALS AssignmentExprNoIn															{ $$ = new yy.AssignExpressionNode($2); }
    ;

EmptyStatement
    : ';'																				{ $$ = new EmptyStatementNode(); }
    ;

ExprStatement
    : ExprNoBF ';'																		{ $$ = new yy.ExprStatementNode($1);  }
    | ExprNoBF error
    ;

IfStatement
    : IF '(' Expr ')' Statement %prec IF_WITHOUT_ELSE									{ $$ = new yy.IfNode($3, $5, null); }
    | IF '(' Expr ')' Statement ELSE Statement											{ $$ = new yy.IfNode($3, $5, $7); }
    ;

IterationStatement
    : DO Statement WHILE '(' Expr ')' ';'												{ $$ = new yy.DoWhileNode($2,$5);}
    | DO Statement WHILE '(' Expr ')' error
    | WHILE '(' Expr ')' Statement										{ $$ = new yy.WhileNode($3,$5); }
    | FOR '(' ExprNoInOpt ';' ExprOpt ';' ExprOpt ')' Statement			{ $$ = new yy.ForNode($3, $5, $7, $9, false); }
    | FOR '(' Type VariableDeclarationListNoIn ';' ExprOpt ';' ExprOpt ')' Statement	{ $$ = new yy.ForNode($4, $6, $8, $10, true); }
    | FOREACH '(' LeftHandSideExpr INTOKEN Expr ')' Statement			{ $$ = new yy.ForEachNode($3, $5, $7, false); }
    | FOREACH '(' Type IDENTIFIER INTOKEN Expr ')' Statement			{ $$ = new yy.ForEachNode($4, $6, $8, true); }
    | FOREACH '(' Type IDENTIFIER InitializerNoIn INTOKEN Expr ')' Statement	{ $$ = new yy.ForEachNode($4, null, $6, $9); }
    ;

ExprOpt
    : 																	{ $$ = null; }
    | Expr
    ;

ExprNoInOpt
    : 																	{ $$ = null; } 
    | ExprNoIn
    ;

ContinueStatement
    : CONTINUE ';'												 		{ $$ = new yy.ContinueNode(); }
    | CONTINUE error
    | CONTINUE IDENTIFIER ';'											{ $$ = new yy.ContinueNode($2); }
    | CONTINUE IDENTIFIER error
    ;

BreakStatement
    : BREAK ';'															{ $$ = new yy.BreakNode(); }
    | BREAK error
    | BREAK IDENTIFIER ';'												{ $$ = new yy.BreakNode($2);  }
    | BREAK IDENTIFIER error
    ;

ReturnStatement
    : RETURN ';'														{ $$ = new yy.ReturnNode(null); }
    | RETURN error
    | RETURN Expr ';'                									{ $$ = new yy.ReturnNode($2); }
    | RETURN Expr error
    ;

WithStatement
    : WITH '(' Expr ')' Statement										{ $$ = new WithNode($3,$5); }
    ;

SwitchStatement
    : SWITCH '(' Expr ')' CaseBlock										{ $$ = new yy.SwitchNode($3, $5); }
    ;

CaseBlock
    : '{' CaseClausesOpt '}'											{ $$ = new yy.CaseBlockNode($2, null, null); }
    | '{' CaseClausesOpt DefaultClause CaseClausesOpt '}'				{ $$ = new yy.CaseBlockNode($2, $3, $4); }
    ;

CaseClausesOpt
    : 																	{ $$ = null; }
    | CaseClauses
    ;

CaseClauses
    : CaseClause														{ $$ = new yy.ClauseListNode($1, null); }
    | CaseClauses CaseClause											{ $$ = new yy.ClauseListNode($1, $2); }
    ;

CaseClause
    : CASE Expr ':'														{ $$ = new yy.CaseClauseNode($2, null); }
    | CASE Expr ':' SourceElements										{ $$ = new yy.CaseClauseNode($2, $4);  }
    ;

DefaultClause
    : DEFAULT ':'														{ $$ = new yy.CaseClauseNode(null, null); }
    | DEFAULT ':' SourceElements										{ $$ = new yy.CaseClauseNode(null, $3); }
    ;

LabelledStatement
    : IDENTIFIER ':' Statement											{ $3.label = $1; $$ = $3; }
    ;

ThrowStatement
    : THROW Expr ';'													{ $$ = new yy.ThrowNode($2); }
    | THROW Expr error
    ;

TryStatement
  : TRY Block Catch                      								{ $$ = new yy.TryNode($2, $3); }
  | TRY Block Finally                    								{ $$ = new yy.TryNode($2, null, $3); }
  | TRY Block Catch Finally              								{ $$ = new yy.TryNode($2, $3, $4); }
  ;
  
Catch
  : CATCH '(' IDENTIFIER ')' Block            							{ $$ = new yy.CatchNode($3, $5);  }
  | CATCH '(' ')' Block            										{ $$ = new yy.CatchNode(null, $5);  }
;

Finally
  : FINALLY Block                        								{ $$ = new yy.FinallyNode($2); }
;
  
DebuggerStatement
    : DEBUGGER ';'
    | DEBUGGER error
    ;

	
FunctionDeclaration
    :  FUNCTION IDENTIFIER '(' ')' '{' FunctionBody '}'					{ $$ = new yy.FuncDeclNode($2, null, $6,  'PRIVATE'); }
    |  FUNCTION IDENTIFIER '(' FormalParameterList ')' '{' FunctionBody '}'	{ $$ = new yy.FuncDeclNode($2, $4, $7, 'PRIVATE'); }
    |  AccessDeclaration FUNCTION IDENTIFIER '(' ')' '{' FunctionBody '}'	{ $$ = new yy.FuncDeclNode($3, null, $7, $1); }
    |  AccessDeclaration FUNCTION IDENTIFIER '(' FormalParameterList ')' '{' FunctionBody '}'	{ $$ = new yy.FuncDeclNode($3, $5, $8, $1); }
    ;

FunctionExpr
    : FUNCTION '(' ')' '{' FunctionBody '}'								{ $$ = new yy.FuncExpressionNode(null, $4); }
    | FUNCTION '(' FormalParameterList ')' '{' FunctionBody '}'			{ $$ = new yy.FuncExpressionNode($3, $5); }
    | FUNCTION IDENTIFIER '(' ')' '{' FunctionBody '}'					{ $$ = new yy.FuncExpressionNode(null, $5, $2); }
    | FUNCTION IDENTIFIER '(' FormalParameterList ')' '{' FunctionBody '}' { $$ = new yy.FuncDeclNode($4, $6, $2); }
    ;

FormalParameterList
    : IDENTIFIER														{ $$ = new yy.ParameterNode($1);  }
    | FormalParameterList ',' IDENTIFIER								{ $$ = new yy.ParameterNode($1, $3);  }
    ;

FunctionBody
	:                                            						{ $$ = new yy.FunctionBodyNode(null);  }
	| SourceElements                            						{ $$ = new yy.FunctionBodyNode($1); }
	;
%%
function dbg(stmt) {
	//parser.yy.debug.push(stmt);
	console.log(stmt);
}
function inspect(obj) {
	return parser.yy.inspect(obj);
}