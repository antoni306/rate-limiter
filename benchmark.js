const autocannon = require('autocannon');
const API_KEY='a3160be233e192a8554578371b88a1857c7473efdc60ac256b3e13545952a28a';

const strategies = ['fixed', 'sliding-log', 'token-bucket', 'sliding-window-counter'];


async function benchmark(strategy) {
    return new Promise((resolve)=>{
        const instance = autocannon({
            url: `http://localhost:3000/rate-limit/check/${strategy}`,
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'X-API-KEY': API_KEY,
            },
            body: JSON.stringify({identifier:'benchmark',limit: 10000,windowSeconds:60}),
            connections:10,
            duration:10,
        },(err,result)=>{
            resolve({strategy,result});
        });
    });
}
async function run(){
    for(const strategy of strategies){
        console.log(`Benchmarking ${strategy}`);
        const {strategy:s,result} = await benchmark(strategy);
        // console.log(JSON.stringify(result.latency, null, 2));

        console.log(`${s}: p50=${result.latency.p50}ms p95=${result.latency.p97_5}ms p99=${result.latency.p99}ms throughput=${result.requests.average}req/s`);
    }
}
run();