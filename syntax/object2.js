var f = function () {
  console.log(1+1);
  console.log(1+2);
}
console.log(f);
f();
console.log();

// array
var arr = [f];
arr[0]();
console.log();

// object
var obj = {
  func : f
}
obj.func();
