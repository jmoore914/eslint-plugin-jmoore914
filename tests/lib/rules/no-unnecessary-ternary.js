/**
 * @fileoverview Disallow ternary statements where the consequent and alternates are true or false
 * @author jmoore914
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require('../../../lib/rules/no-unnecessary-ternary');

const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions: {ecmaVersion: 6}});
ruleTester.run('no-unnecessary-ternary', rule, {

	valid: [

		{
			code: 'function foo(){const a = testCondition ? 1 : 2}'
		},
		{
			code: 'const a = testCondition ? true : true'
		},
		{
			code: 'const a = testCondition ? "true" : false'
		},
		{
			code: 'const a = testCondition ? 1 : true'
		},
		{
			code: 'testCondition ? a=true : a=false'
		}
	],

	invalid: [
		{
			code: 'const a = testCondition ? true : false',
			output: 'const a = testCondition',
			errors: [
				{column: 17, line: 1, type: 'IfStatement', messageId: 'noUnnecessaryTernary'}
			]
		},
		{
			code: 'const a = testCondition ? false : true',
			output: 'const a = !(testCondition)',
			errors: [
				{column: 17, line: 1, type: 'IfStatement', messageId: 'noUnnecessaryTernary'}
			]
		}
	]
});
