/**
 * @fileoverview Disallow if/then statements that merely return true or false based on the if condition.
 * @author jmoore914
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unnecessary-if-statement');

const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------


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
	},
	{
		code: `function foo(){
            if(a){
                return true;
            }
            return true;
        }`
	},
	{
		code: `function foo(){
            if(a){
                return true;
            }
            else{
                return true;
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
			{column: 17, line: 3, type: 'IfStatement', messageId: 'noUnnecessaryIfStatement'}
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
			{column: 17, line: 3, type: 'IfStatement', messageId: 'noUnnecessaryIfStatement'}
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
			{column: 17, line: 3, type: 'IfStatement', messageId: 'noUnnecessaryIfStatement'}
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
			{column: 17, line: 3, type: 'IfStatement', messageId: 'noUnnecessaryIfStatement'}
		]
	}

];

var ruleTester = new RuleTester();
ruleTester.run('no-unnecessary-if-statement', rule, {
	valid,
	invalid
});
