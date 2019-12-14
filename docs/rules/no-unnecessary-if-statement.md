# Disallow if/then statements that merely return true or false based on the if condition. (no-if-then-return-boolean)

Please describe the origin of the rule here.


## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js

if(testCondition){
    return true;
}
else{
    return false;
}


if(testCondition){
    return false;
}
else{
    return true;
}


if(testCondition){
    return true;
}
return false;


if(testCondition){
    return true;
}
else if(secondTestCondition){
return true;
}
else{
    return false
}


```

Examples of **correct** code for this rule:

```js

return testCondition;


if(testCondition){
    doSomeStuff();
    return true;
}
else{
    return false;
}

if(testCondition){
    return true;
}
else{
    doSomeStuff();
    return false;
}

if(testCondition){
    return true;
}
doSomeStuff();
return false;


```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
