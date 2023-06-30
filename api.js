const { log } = require("console");

function x() {
    let x = [10 ,12 ,14 ,16]
    // x.forEach((x1 ,i) => {
    //     if(i == x.length - 1) {
    //         log("ye")
    //         x1 += 2;
    //         return 10;
    //     }
    // })
    for(let i = 0;i < x.length;i++) {
        if(i == x.length - 1) {
            x[i] += 2;
            return x;
        }
    }
}

let q = x();

log(q)