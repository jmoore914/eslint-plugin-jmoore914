/**
 * @fileoverview Prefer ternary operator to simple if/then statements
 * @author jmoore914
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function parseOptions(options) {
	let assignmentExpSame = true;
	let assignmentExpAny = false;
	let returnExp = true;
	let callExp = false;

	if (typeof options === 'string') {
		assignmentExpAny = true;
		callExp = true;
	} else if (typeof options === 'object' && options !== null) {
		assignmentExpSame = options.assignment !== 'never';
		assignmentExpAny = options.assignment === 'any';
		returnExp = options.return !== false;
		callExp = options.call === true;
	}

	return {assignmentExpSame: assignmentExpSame, 
		assignmentExpAny:assignmentExpAny,
		returnExp: returnExp,
		callExp: callExp
	};
}

module.exports = {
	meta: {
		type: 'suggestion',
		messages: {
			preferTernary: 'This if statement can be replaced by a ternary operator.'
		},
		docs: {
			description: 'Prefer ternary operator to if/then assignment statements',
			category: 'suggestion',
			recommended: false
		},
		schema: [
			{
				oneOf: [
					{
						enum: ['always']
					},
					{
						type: 'object',
						properties: {
							assignment: {
								enum: ['never', 'same', 'any']
							},
							return: {type: 'boolean'},
							call: {type: 'boolean'}
						},
						additionalProperties: false
					}
				]
			}
		],
		fixable: 'code'

	},

	create(context) {
    
		/**
         * Checks an if statement to see if it can be simplified with a ternary expression.
         * @param {ASTNode} node The node to check.
         * @returns {void}
         * @private
         */

		const options = parseOptions(context.options[0]);

		function checkIfStatement(node) {
			if (checkConsequentAndAlternateLength(node) && 
            checkConsequentAndAlternateType(node)){
				context.report({
					node, 
					messageId: 'preferTernary',
					fix: function(fixer){
						return fixFunction(node, fixer);
					}
				});
			}
		}

		function checkConsequentAndAlternateLength(node){
			return checkConsequentOrAlternateLength(node.consequent) && 
            checkConsequentOrAlternateLength(node.alternate);
		}

		function checkConsequentOrAlternateLength(consequentOrAlternateNode){
			return consequentOrAlternateNode && 
            consequentOrAlternateNode.body.length === 1; 
		}

		function checkConsequentAndAlternateType(node){
			return node.consequent.body[0].type === node.alternate.body[0].type && 
			(checkConsequentAndAlternateAssignment(node) || 
			checkConsequentAndAlternateReturn(node) ||
				checkConsequentAndAlternateCall(node));
		}

		function checkConsequentAndAlternateAssignment(node){
			return options.assignmentExpSame &&
			checkConsequentOrAlternateAssignment(node.consequent) && 
			checkConsequentOrAlternateAssignment(node.alternate) &&
			(options.assignmentExpAny ||
				compareConsequentAndAlternateAssignments(node)
			);
		}

		function checkConsequentOrAlternateAssignment(consequentOrAlternateNode){
			return consequentOrAlternateNode.body[0].type === 'ExpressionStatement' &&
			consequentOrAlternateNode.body[0].expression.type === 'AssignmentExpression';
		}

		function compareConsequentAndAlternateAssignments(node){
			return node.consequent.body[0].expression.left.name === node.alternate.body[0].expression.left.name;
		}

		function checkConsequentAndAlternateReturn(node){
			return options.returnExp && node.consequent.body[0].type === 'ReturnStatement';
		}


		function checkConsequentAndAlternateCall(node){
			return options.callExp && 
				node.consequent.body[0].type === 'ExpressionStatement' && 
				node.consequent.body[0].expression.type === 'CallExpression';
		}

		function fixFunction(node, fixer){
			let prefix = '';
			const ifCondition = node.test.name;
			let left = '';
			let right = '';
			if(checkConsequentOrAlternateAssignment(node.consequent)){
				if(compareConsequentAndAlternateAssignments(node)){
					prefix = node.consequent.body[0].expression.left.name + ' = ';
					left = node.consequent.body[0].expression.right.value;
					right = node.alternate.body[0].expression.right.value;
				}
				else{
					const consequentExpression = node.consequent.body[0].expression;
					left = consequentExpression.left.name + consequentExpression.operator + consequentExpression.right.value;
					const alternateExpression = node.alternate.body[0].expression;
					right = alternateExpression.left.name + alternateExpression.operator + alternateExpression.right.value;
				}
			}
			else if(node.consequent.body[0].type === 'ReturnStatement'){
				prefix = 'return ';
				left = node.consequent.body[0].argument.value;
				right = node.alternate.body[0].argument.value; 
			}
			else {
				left = node.consequent.body[0].expression.callee.name;
				right = node.alternate.body[0].expression.callee.name;
			}

			const replacement = prefix + ifCondition + ' ? ' + left + ' : ' + right;
			return fixer.replaceText(node, replacement);
		}
 
		return {
			IfStatement : checkIfStatement
		};
	}
		

};
