digit                       [0-9]
id                          [a-zA-Z][a-zA-Z0-9]*
terminator					^(\n|;)
math						("*"|"/"|"^"|"%"|"+"|"-")
boolop						('||'|'&&')
strLiteral					^(\'|\")(\\.|[^\"])*(\'|\")
sngLineComment				"//"[^\n]*                       
multiLineComment			"//*"(.|\n|\r)*?"*/"  
            
%%


{sngLineComment}            return 'SINGCOMMENT';
{multiLineComment}			return 'MULTCOMMENT';

"class"                     return 'CLASS';
"public"					return 'PUBLIC';
"private"					return 'PRIVATE';
"require"					return 'REQUIRE';

{digit}+                    return 'NUMLITERAL';
{id}                        return 'IDENTIFIER';
{strLiteral}				return 'STRINGLITERAL';
{terminator}				return 'TERMINATOR';
{regexp}					return 'REGEXP';

">>>="                		return 'URSHIFTEQUAL';
"!=="                 		return 'STRNEQ';
"==="                 		return 'STREQ';
">>>"                 		return 'URSHIFT';
"<<="                 		return 'LSHIFTEQUAL';
">>="                 		return 'RSHIFTEQUAL';
"%="                  		return 'MODEQUAL';
"&&"                  		return 'AND';
"&="                  		return 'ANDEQUAL';
"*="                  		return 'MULTEQUAL';
"++"                  		return 'PLUSPLUS';
"+="                  		return 'PLUSEQUAL';
"--"                  		return 'MINUSMINUS';
"-="                  		return 'MINUSEQUAL';
"/="                  		return 'DIVEQUAL';
"<<"                  		return 'LSHIFT';
"<="                  		return 'LE';
">="                  		return 'GE';
"=="                  		return 'EQEQ';
">>"                  		return 'RSHIFT';
"^="                  		return 'XOREQUAL';
"|="                  		return 'OREQUAL'
"||"                  		return 'OR';
"&"                   		return 'AMPERSAND';
"%"                   		return 'PERCENT';
"!="                  		return 'NE';
"("                   		return 'LPAREN';
")"                   		return 'RPAREN';
"+"                   		return 'PLUS';
"*"                   		return 'TIMES';
","                   		return 'COMMA';
"-"                   		return 'MINUS';
"!"                   		return 'BANG';
"."                   		return 'DOT';
"/"                   		return 'FWDSLASH';
":"                   		return 'COLON';
";"                   		return 'SEMICOLON';
"<"                   		return 'LESSTHAN';
"="                   		return 'EQUALS';
">"                   		return 'GREATERTHAN';
"?"                   		return 'QUESTION';
"["                   		return 'LBRACKET';
"]"                   		return 'RBRACKET';
"^"                   		return 'CARET';
"{"                   		return 'LCURLY';
"}"                   		return 'RCURLY';
"|"                   		return 'VBAR';
"~"                   		return 'TILDE';


"break"               		return 'BREAK';
"case"                		return 'CASE';
"catch"               		return 'CATCH';
"continue"            		return 'CONTINUE';
"default"             		return 'DEFAULT';
"delete"              		return 'DELETE';
"do"                  		return 'DO';
"else"                		return 'ELSE';
"false"               		return 'FALSETOKEN';
"finally"             		return 'FINALLY';
"for"                 		return 'FOR';
"function"            		return 'FUNCTION';
"get"                 		return 'GET';
"if"                  		return 'IF';
"in"                  		return 'IN';
"instanceof"          		return 'INSTANCEOF';
"new"                 		return 'NEW';
"null"                		return 'NULLTOKEN';
"return"              		return 'RETURN';
"set"                 		return 'SET';
"switch"              		return 'SWITCH';
"this"                		return 'THIS';
"throw"               		return 'THROW';
"true"                		return 'TRUETOKEN';
"try"                 		return 'TRY';
"typeof"              		return 'TYPEOF';
"var"                 		return 'VAR';
"const"               		return 'CONST';
"void"                		return 'VOID';
"while"               		return 'WHILE';
"whith"               		return 'WITH';

"string"					return 'STRINGTYPE';
"int"						return 'INTTYPE';
"bool"						return 'BOOLTYPE';
"object"					return 'OBJECTTYPE';

\s+                         /* skip whitespace */
\n							return 'NEWLINE';
<<EOF>>                     return 'ENDOFFILE';



