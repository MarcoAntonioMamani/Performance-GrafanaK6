module.exports ={
    "type":{
        "smoke_test":{
            vus:1,
            duration:'10s'
        },
        "load_test":{
            stages:[
                {duration:'10s',target:5},
                {duration:'10s',target:5},
                {duration:'10s',target:10},
                {duration:'10s',target:10},
                {duration:'10s',target:0},
            ]
        },
        "stress_test":{
            stages:[
                {duration:'10s',target:5},
                {duration:'10s',target:5},
                {duration:'10s',target:10},
                {duration:'10s',target:10},
                {duration:'10s',target:20},
                {duration:'10s',target:20},
                {duration:'10s',target:0},
            ],
            RPS:10,
            ext: {
                loadimpact: {
                  name: 'BouncerStress',
                },
              },
        },
    }
}