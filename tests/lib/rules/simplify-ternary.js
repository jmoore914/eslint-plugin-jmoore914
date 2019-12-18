/**
 * @fileoverview Simplify ternary operator expressions
 * @author jmoore914
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/simplify-ternary');

const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const valid = [
	{code: 'const a = testCondition ? consequent : alternate'},
	{code: 'testCondition ? a = consequent : b = alternate'}
];

const invalid = [
	{
		code: 'testCondition ? a =  consequent : a = alternate',
		output: 'a = testCondition ? consequent : alternate',
		errors: [
			{column: 1, line: 1, type: 'ConditionalExpression', messageId: 'simplifyTernary'}
		]
	}
];

var ruleTester = new RuleTester({parserOptions: {ecmaVersion: 6}});
ruleTester.run('simplify-ternary', rule, {
	valid, 
	invalid
});
