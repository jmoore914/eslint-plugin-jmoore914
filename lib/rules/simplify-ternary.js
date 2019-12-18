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



module.exports = {
	meta: {
		type: 'suggestion',
		messages: {
			simplifyTernary: 'This ternary expression can be simplified by extracting the variable name being assigned to.'
		},
		docs: {
			description: 'Simplify ternary expressions when possible',
			category: 'suggestion',
			recommended: false
		},
		schema: [],
		fixable: 'code'

	},

	create(context) {
    
		/**
         * Checks an if statement to see if it can be simplified with a ternary expression.
         * @param {ASTNode} node The node to check.
         * @returns {void}
         * @private
         */


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
			return node.consequent.type === 'AssignmentExpression' &&
			node.alternate.type === 'AssignmentExpression' && 
			compareConsequentAndAlternateAssignments(node);	
		}

		

		function compareConsequentAndAlternateAssignments(node){
			return node.consequent.left.name === node.alternate.left.name;
		}


		function fixFunction(node, fixer){
			const ifCondition = node.test.name;
			const prefix = node.consequent.left.name + ' = ';
			const left = node.consequent.right.name;
			const right = node.alternate.right.name;
			const replacement = prefix + ifCondition + ' ? ' + left + ' : ' + right;
			return fixer.replaceText(node, replacement);
		}
        
		return {
			ConditionalExpression : checkTernary
		};
	}
		

};
