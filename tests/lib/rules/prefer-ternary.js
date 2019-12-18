/**
 * @fileoverview Prefer ternary operator to simple if/then statements
 * @author jmoore914
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/prefer-ternary');

const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions: {ecmaVersion: 6}});
ruleTester.run('prefer-ternary', rule, {

	valid: [
		
		{
			code: `function foo(){
                    if(a){
                        b = 1;
                    }
                }`
		},
		{
			code: `function foo(){
                    if(a){
                        b = 1
                        doSomeStuff()
                    }
                    else{
                        b = 2
                    }
            }`
		}
		
	],

	invalid: [
		{
			code: `
                function foo(){
                    if(a){
                        b  = 1;
                    } 
                    else{
                        b =  2;
                    }
                }
            `,
			output: `
                function foo(){
                    b = a ? 1 : 2
                }
            `,
			errors: [
				{column: 21, line: 3, type: 'IfStatement', messageId: 'preferTernary'}
			]
		}
	]
});
