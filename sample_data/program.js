// import the data
const json = require('./data1');

// PART1 DONE
duration = []
intensity = []
tmp=[]

for (var i=0;i<json.length;i++){
    var obj = json[i];
    intensity.push(obj.intnsity)
    duration.push(obj.duration);
}


function avg(data){
    
    for(var i=0;i<data.length;i++){
    var sum = data[i].reduce(function(a, b){
        return a + b;
    },0);

    //console.log(sum/data.length)
    tmp.push(sum/data.length)

    }
    return tmp
}


// console.log(intensity)
// console.log(duration)


//var intensity_list = 
//var duration_list = avg(duration)

//console.log(avg(intensity));

console.log(avg(duration))
//console.log(duration_list);














// console.log(avg(intensity));
// console.log(avg(duration));