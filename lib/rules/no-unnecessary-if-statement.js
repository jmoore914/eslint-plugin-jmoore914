/**
 * @fileoverview Disallow if/then statements that merely return true or false based on the if condition.
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
			noUnnecessaryIfStatement: 'This if statement can be replaced by a single return statement.'
		},
		docs: {
			description: 'Disallow if/then statements that soley returns true or false',
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
		function checkIfStatement(node) {
			if(checkNode(node)){
				context.report({
					node, 
					messageId: 'noUnnecessaryIfStatement',
					fix: function(fixer){
						const ifCondition = node.test.name;
						const consequentValue = node.consequent.body[0].argument.value; 
						const replacement =   'return ' + (consequentValue ? ifCondition : '!(' +  ifCondition + ')');
						const rangeStart = node.start;
						const rangeEnd = node.alternate ? node.end : context.getTokenAfter(context.getTokenAfter(node)).end;
						
						return  fixer.replaceTextRange([rangeStart, rangeEnd], replacement);
                    
					}
				});
			}
		}

		function checkNode(node){
			return node.alternate ? checkConsequentAndAlternate(node) : checkConsequentAndFollowingSibling(node);
		
		}

		function checkConsequentAndAlternate(node){
			return checkIfReturnStatementAndBoolean(node.consequent.body[0]) &&
			checkIfReturnStatementAndBoolean(node.alternate.body[0]) &&
			node.consequent.body[0].argument.value === !node.alternate.body[0].argument.value;
		}

		function checkConsequentAndFollowingSibling(node){
			return checkIfReturnStatementAndBoolean(node.consequent.body[0]) &&
			checkIfFollowingSiblingIsReturnStatementAndBoolean(node) &&
			node.consequent.body[0].argument.value === !convertFollowingSiblingFromStringToBoolean(node);
		}

		function checkIfFollowingSiblingIsReturnStatementAndBoolean(ifNode){
			const nextSibling = context.getTokenAfter(ifNode);
			return  nextSibling.value === 'return' && context.getTokenAfter(nextSibling).type === 'Boolean';
		}

		function convertFollowingSiblingFromStringToBoolean(node){
			return context.getTokenAfter(context.getTokenAfter(node)).value === 'true';
		}

		function checkIfReturnStatementAndBoolean(node){
			return node.type === 'ReturnStatement' && typeof node.argument.value === 'boolean';
		}

		
    
		return {
			IfStatement : checkIfStatement
		};
        
	}
    
};
