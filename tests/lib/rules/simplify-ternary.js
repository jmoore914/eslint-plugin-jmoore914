/**
 * @fileoverview Simplify ternary operator expressions
 * @author jmoore914
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/simplify-ternary"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("simplify-ternary", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "ifCondition ? return consequent : return alternate",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
