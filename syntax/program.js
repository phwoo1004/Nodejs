var args = process.argv;

// args[0] : C:\\Program Files\\nodejs\\node.exe
// args[1] : C:\\Users\\phwoo\\OneDrive\\바탕 화면\\nodejs\\syntax\\program.js
console.log(args[2]);
console.log('A');
console.log('B');

if (args[2] === '1') {
  console.log('C1');
}
else {
  console.log('C2');
}

console.log('D');
