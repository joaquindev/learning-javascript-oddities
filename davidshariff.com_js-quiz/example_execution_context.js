/*
Source: http://davidshariff.com/blog/what-is-the-execution-context-in-javascript/ 
- 3 environments: 1) global code, 2) function code or 3) eval code
- only 1 global context, accesible from any other context in your program
- function contexts: each function call creates one with a private scope where anything declared inside of the function can not be directly accessed from outside the current function scope. 
- Execution context stack: the JS interpreter is implemented as a single thread (only 1 thing can ever happen at one time in the browser, with other actions or events being queued in what is called the Execution stack. For instance: Active now: Current Execution Context, and in 2 place: Execution Context N+2, then: Execution Context N+1 and the Global Execution Context is always at the bottom. When a browser first loads your script, it enters the global execution context by default and if in your global code you call a function the sequence flow of your program enters the function being called which creates a new execution context and pushing that context to the top of the execution stack. 
- 5 points to remember about the execution stack: single threaded, synchronous execution, 1 global context, infinite function contexts, each function call creates a new execution context, even a call to itself
*/

//global context
var sayHello = 'Hello';
function person(){
  //execution context
  var first = 'Joaquin', 
      last  = 'Dev'; 

  function firstName(){
    //execution context
    return first;
  }

  function lastName(){
    //execution context
    return last;
  }
}

(function foo(i){
  if (i === 3){
    return;
  }
  else{
    console.log(i);
    foo(++i);
  }
}(0));

//Execution context in code
executionContextObj = {
  scopeChain: {/* variableObjcet + all parent execution context's variableObject */}, 
  variableObject: {/* function arguments / parameters, inner variable and function declarations*/}, 
  this: {}
}

(function() {

    console.log(typeof foo); // function pointer
    console.log(typeof bar); // undefined

    var foo = 'hello',
        bar = function() {
            return 'world';
        };

    function foo() {
        return 'hello';
    }

}());

/*-
Great source here: http://davidshariff.com/blog/javascript-scope-chain-and-closures/
Execution context creation has 2 stages: 1) creation stage: create the scope chain, create variables, functions and arguments and determine the value of this. 2) activation execution stage: assign values, references to functions and interpret/execute code
- Identifier Resolution and Closures in the JS Scope Chain
- The scope chain property of each Execution context is simply a collection of the current Context (available in the Activation object) plus all parent EC with its AO. 
- Determing a Scope Chain's variable Objects VOs: we know that the 1st VO of the scope chain belongs to the current EC, and we can find the remaining parent VOs by looking at the parent context's scope chain: 

*/

/*EC stack: global context -> one -> two -> three. (we are at the time when alert is showed), the scope looks like:
//three() scopeChain: {[three() VO] + [two() VO] + [one VO] + [Global VO] }
*/
function one() {
    two();
    function two(){
        three();
        function three(){
            alert('I am function three');
        }
    }
}

/*
- In JS the interpreter uses Lexical Scoping as opposed to Dynamic Scoping which means that all inner functions are statically bound to the parent context in which the inner funcion was physically defined. This lexical scope as opposed to Dynamic scope is the source of confusion for many developers. We know that every invocation of a function will create a new EC and VO, which holds the values of variables evaluated in the current context. It is this dynamic, runtime evaluation of the VO paired with the lexical (static) defined scope off each context that leads unexpected results in progrma behaviour. For instance: 
*/
var myAlerts = [];
for (var i = 0; i < 5; i++){
    myAlerts.push(
        function inner(){ alert(i);}
    );
}
myAlerts[0]();//5
myAlerts[1]();//5
myAlerts[2]();//5
myAlerts[3]();//5
myAlerts[4]();//5

/* This is the most common point of confusion. Function inner was created in the global context, therefore it's scope schain is statically bound to the global context which means that lines 90 to 94 invoke inner() which looks in inner.ScopeChain to resolve i, which is located in the GC. At the time of each invocation, i, has already been incremented to 5, giving the same result every time inner() is called. The statically bound scope chain, which holds VOs from each context containing live variables, often catches developers by surprise. The key here is that the code is not inside a function so it is in GC and the behaviour is as we already have explained*/


/* 
JS is prototypal by nature and almost everything is an object (except null and undefined). When trying to access a property on an object, the interpreter will try to resolve it by looking for the existance of the property in the object. If it can't find the property, it will continue to look up the prototype chain, which is an inherited chain of objects, until it finds the property or traversed to the end of the chain. But, does the interpreter resolve an object property using the scope chain or prototype chain first? It uses both. When trying to resolve a property or identifier, the scope chain will be used first to locate the object. Once the object has been found, the prototype chain of that object will then be traversed looking for the property name. 
*/

var bar = {};
function foo(){
    bar.a = 'Set from foo()';
    return function inner(){
        alert(bar.a);
    }
}
foo()();//'Set from foo()'

/* Line 105 creates a property a on the Global object BAR, what happened here is that the interpreter checks the scope chain and finds bar as a Global property, but now let's consider the followin: */

var bar = {};
function foo(){
    Object.prototype.a = 'Set from prototype';
    return function inner(){
        alert(bar.a);
    }
}
foo()();//Set from prototype

/* At runtime we invoke inner which tries to resolve bar.a by looking in it's scope chain. It finds bar in the GC and that's ok, now it proceeds to search inside bar for a property named A. However, A was never set on BAR so the interpreter traverses the object's prototype chain and finds A was set on Object.prototype. This happens as it is this exact behaviour which explains identifier resolution: locate the object in the scope chain, then proceed up the object's prototyp chain until the property is found or returned undefined.  */

/* When to use Closures?
Closures are a powerful concept given to JS and some of the most common situations to use them are: encapsulation: allows us to hide the implementation details of a context from outsides scopes, while exposing a controlled public interface. This is commonly referred to as the module pattern or revealing module pattern returning an object instead of allowing accesing everything. In callbacks: perhaps one of the most powerful uses for closures are callbakcs, JS in the browser, typically runs in a single threaded event loop, blocking other events from starting until one event has finished. CB allow us to defer the invocation of a function in a non-blocking manner. An example of this is when making an AJAX call to the server, using a CB to handle to response, while still maintaining the bindings in which it was created. 

*/










/* About the Module Pattern in JS*/

var myNamespace = (function(){
    var myPrivateVar, myPrivateMethod;
    myPrivateVar = 0; //a private counter method
    myPrivateMethod = function(foo){ console.log(foo)};
    return {
        myPublicVar: "foo", //a public variable
        myPublicFunction: function(bar){
            myPrivateVar++;//increment our private counter
            myPrivateMethod(bar);//call our private method using bar
        }
    };
})();

//An example with code: 
var testModule = (function(){
    var counter = 0;
    return {
        incrementCounter: function(){ return counter++;}, 
        resetCounter: function(){ console.log('counter value prior to reset: ' + counter); counter = 0;}
    };
})();
//usage
testModule.incrementCounter(); //increment our counter
testModule.resetCounter(); //check the counter value and reset, it outputs 1


