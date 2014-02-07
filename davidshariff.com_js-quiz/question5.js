function bar(){
  return foo;
  //foo = 10; 
  function foo(){}
  var foo = '11';
}
console.log(typeof bar());

//Output: 'function' 
/*Explanation: think about how the AO is formed: scopeChain{}, variableObject(), this. So: 
 barExecutionContext = {
  scopeChain: {[bar VO]+[Global VO]}, 
  variableObject: {
    arguments: {0:22, length: 1//however this is not the case}, 
    i: 22, //however this is not the case, in case we called a function like this: foo(22)
    foo: pointer to function foo()
    foo: variable
  },
  this: {}
 }

 As you can see, it is usually said that function are first class objects in JS and this is because a pointer to a function is always going to have preference and be before anything else like varibles in the variableObject. 
*/
