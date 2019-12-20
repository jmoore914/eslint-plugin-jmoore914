/**
 * @fileoverview Disallow ternary statements where the consequent and alternates are true or false
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
			noUnnecessaryTernary: 'This ternary can be replaced by a return statement.'
		},
		docs: {
			description: 'Disallow ternary statements where the consequent and alternates are true or false',
			category: 'Best Practices',
			recommended: true
		},
		fixable: 'code',     
	},
	create(context) {
    
		/**
             * Checks an if statement to see if it only return a boolean.
             * @param {ASTNode} node The node to check.
             * @returns {void}
             * @private
             */
		function checkTernary(node) {
			if(checkConsequentAndAlternate(node)) {
				context.report({
					node, 
					messageId: 'noUnnecessaryTernary',
					fix: function(fixer){
						const ifCondition = node.test.name;
						const consequentValue = node.consequent.value; 
						const replacement =   consequentValue ? ifCondition : '!(' +  ifCondition + ')';
						return  fixer.replaceText(node, replacement);
                    
					}
				});
			}
		}
		function checkConsequentAndAlternate(node){
			return checkConsequentOrAlternate(node.consequent) && 
            checkConsequentOrAlternate(node.alternate) &&
            node.consequent.value === !node.alternate.value;
		}
        
		function checkConsequentOrAlternate(consequentOrAlternateNode){
			return consequentOrAlternateNode.type === 'Literal' && typeof consequentOrAlternateNode.value === 'boolean';
		}

		return {
			ConditionalExpression : checkTernary
		};
	}

	
};