var bcrypt = require('bcrypt-nodejs');

for (k=0;k<11;k++){

    timeout(k);
}

function timeout(round){
    console.log("round:"+round);
    var start = new Date();
    for(i=0;i<10;i++){
        var salt = bcrypt.genSaltSync(round);   
        var hash = bcrypt.hashSync('gebilaowang',salt);
        // console.log(hash);
    }

    var end = new Date();

    console.log(end-start+'ms');
}


//测试结果
/**
round:0
2379ms
round:1
2388ms
round:2
2370ms
round:3
2401ms
round:4
63ms
round:5
79ms
round:6
179ms
round:7
304ms
round:8
609ms
round:9
1195ms
round:10
2446ms
*/
//结论：小于4轮是不好使的会默认变成10轮