/**
 * @fileoverview Disallow if/then statements that merely return true or false based on the if condition.
 * @author jmoore914
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-if-then-return-boolean');

const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

// tues dec 10 reyes 10am

const valid = [
	{
		code: `function foo(){
            if(a){
                return true;
            }
            doSomeStuff()
            return false;
        }`
	},
	{
		code: `function foo(){
            if(a){
                doSomeStuff()
                return true;
            }
            return false;
        }`
	},
	{
		code: `function foo(){
            if(a){
                return true;
            }
            else{
                doSomeStuff()
                return false;
            }
        }`
	},
	{
		code: `function foo(){
            if(a){
                doSomeStuff()
                return true;
            }
            else{
                return false;
            }
        }`
	}

];
const invalid = [
	{
		code: `
            function foo(){
                if(a){
                    return true;
                }
                return false;
            }
        `,
		output: `
            function foo(){
                return a;
            }
        `,
		errors: [
            {column: 17, line: 3, type: 'IfStatement', messageId: 'noIfThenReturnBoolean'}
		]
	},
	{
		code: `
            function foo(){
                if(a){
                    return true;
                } 
                else{
                    return false;
                }
            }
        `,
		output: `
            function foo(){
                return a
            }
        `,
		errors: [
            {column: 17, line: 3, type: 'IfStatement', messageId: 'noIfThenReturnBoolean'}
		]
	},
	{
		code: `
            function foo(){
                if(a){
                    return false;
                }
                return true;
            }
        `,
		output: `
            function foo(){
                return !(a);
            }
        `,
		errors: [
            {column: 17, line: 3, type: 'IfStatement', messageId: 'noIfThenReturnBoolean'}
		]
	},
	{
		code: `
            function foo(){
                if(a){
                    return false;
                } else{
                    return true;
                }
            }
        `,
		output: `
            function foo(){
                return !(a)
            }
        `,
		errors: [
            {column: 17, line: 3, type: 'IfStatement', messageId: 'noIfThenReturnBoolean'}
		]
	}

];

var ruleTester = new RuleTester();
ruleTester.run('no-if-then-return-boolean', rule, {
	valid,
	invalid
});
