const timeout = setTimeout(() => {
    console.log('1.5초 후 실행');
}, 1500);

const interval = setInterval(() => {
    console.log('1초마다 실행');
}, 1000);

const timeout2 = setTimeout(() => {
    console.log('실행되지 않습니다');
}, 3000);

setTimeout(() => {
    clearTimeout(timeout2);
    clearInterval(interval);
}, 2500);

const immediate = setImmediate(() => {
    console.log('즉시 실행');
});
const immediate2 = setImmediate(() => {
    console.log('실행되지 않습니다');
});
clearImmediate(immediate2);

/*
   초         실행            콘솔
    0       immediate       즉시 실행
            (immediate2)

    1       interval        1초마다 실행

    1.5     timeout         1.5초마다 실행

    2       interval        1초마다 실행

    2.5     (timeout2)
            (interval)
*/