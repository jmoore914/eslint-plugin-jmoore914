/**
 * @fileoverview Disallow ternary statements where the consequent and alternates are true or false
 * @author jmoore914
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-unnecessary-ternary"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-unnecessary-ternary", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "let a = ifCondition ? true : false",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
