const { log } = require("console");

function x() {
    let x = [10 ,12 ,14 ,16]
    x.map((x1 ,i) => {
        if(i == x.length - 1) {
            x1 += 2;
            return x;
        }
    })
}

let q = x();

log(q)