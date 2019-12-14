/**
 * @fileoverview Simplify ternary operator expressions
 * @author jmoore914
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
/**
 * @fileoverview Prefer ternary operator to simple if/then statements
 * @author jmoore914
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function parseOptions(options) {

	return {
		assignmentExp:options.assignment !== false,
		returnExp: options.return !== false
	};
}

module.exports = {
	meta: {
		docs: {
			description: 'Simplify ternary expressions when possible',
			category: 'suggestion',
			recommended: false
		},
		schema: [
			{
				type: 'object',
				properties: {
					return: {type: 'boolean'},
					assignment: {type: 'boolean'}
				},
				additionalProperties: false
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

		function checkTernary(node) {
			if (checkConsequentAndAlternateType(node)){
				context.report({
					node, 
					messageId: 'simplifyTernary',
					fix: function(fixer){
						return fixFunction(node, fixer);
					}
				});
			}
		}
        
		function checkConsequentAndAlternateType(node){
			return node.consequent.type === node.alternate.type && 
			(checkConsequentAndAlternateAssignment(node) || 
            checkConsequentAndAlternateReturn(node)	
            );	
		}

		function checkConsequentAndAlternateAssignment(node){
			return options.assignmentExp &&
			checkConsequentOrAlternateAssignment(node.consequent) && 
			checkConsequentOrAlternateAssignment(node.alternate) &&
				compareConsequentAndAlternateAssignments(node);
			
		}

		function checkConsequentOrAlternateAssignment(consequentOrAlternateNode){
			return consequentOrAlternateNode.type === 'ExpressionStatement' &&
			consequentOrAlternateNode.expression.type === 'AssignmentStatement';
		}

		function compareConsequentAndAlternateAssignments(node){
			return node.consequent.expression.left === node.alternate.expression.left;
		}

		function checkConsequentAndAlternateReturn(node){
			return options.returnExp && node.consequent.body[0].type === 'ReturnStatement';
		}

		function fixFunction(node, fixer){
			let prefix = '';
			const ifCondition = node.test.name;
			let left = '';
			let right = '';
			if(node.consequent.type === 'ExpressionStatement'){
				prefix = node.consequent.body[0].expression.left + ' = ';
				left = node.consequent.expression.right;
				right = node.alternate.expression.right;
			}
			else{
				prefix = 'return ';
				left = node.consequent.body[0].argument.name;
				right = node.alternate.body[0].argument.name; 
			}

			const replacement = prefix + ifCondition + ' ? ' + left + ' : ' + right;
			return fixer.replaceText(node, replacement);
		}
        
		return {
			ConditionalExpression : checkTernary
		};
	}
		

};
