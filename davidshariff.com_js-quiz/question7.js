var x = 3; 
var foo = {
  x: 2, 
  baz: {
    x: 1, 
    bar: function(){
      return this.x;
    }
  }
}
var go = foo.baz.bar;


/* 
 GC/AO:{
  scopeChain: GC Vo 
  variableObject: 
    x:undefined,
    go: pointer to function bar
  this:
 }
 foo:{
  scopeChain: foo VO +  GC Vo 
  variableObject: 
    bar: pointer to bar()
    x: undefined
  this:
 }
 bar: {
  scopeChain: bar VO + foo VO +  GC Vo 
  variableObject: 
  this:
 }
*/

console.log(typeof go);//'function', we show a pointer to a function
console.log(typeof go());//3 or 'undefined', inside the function we don't know anything but the GS 
console.log(typeof foo.baz.bar());//3,1 
