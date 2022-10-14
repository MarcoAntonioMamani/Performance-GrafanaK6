import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';



export let options = {
  scenarios: {
    my_web_test: {
      executor: 'constant-vus',
      exec: 'obtenerToken', 
      setup: `obtenerTokenSetup`
    },
    my_api_test_1: {
      executor: 'constant-arrival-rate',
      exec: 'savingAccount',
      setup: `savingAccountSetup`
    },
  },
};
export function setup(){
}
/*
export const options = {
    stages: [
      { duration: '10s', target: 100 }, // below normal load
      { duration: '1m', target: 100 },
      { duration: '10s', target: 1400 }, // spike to 1400 users
      { duration: '3m', target: 1400 }, // stay at 1400 for 3 minutes
      { duration: '10s', target: 100 }, // scale down. Recovery stage.
      { duration: '3m', target: 100 },
      { duration: '10s', target: 0 },
    ],
  };

/*
//Prueba de Performance
export const options = {
    stages: [
      { duration: '2m', target: 100 }, // below normal load
      { duration: '5m', target: 100 },
      { duration: '2m', target: 200 }, // normal load
      { duration: '5m', target: 200 },
      { duration: '2m', target: 300 }, // around the breaking point
      { duration: '5m', target: 300 },
      { duration: '2m', target: 400 }, // beyond the breaking point
      { duration: '5m', target: 400 },
      { duration: '10m', target: 0 }, // scale down. Recovery stage.
    ],
  };*/
  //Esta configuración aumenta la carga en 100 usuarios cada 2 minutos y se mantiene 
 // en este nivel durante 5 minutos. También hemos incluido una etapa de recuperación al final,
  // donde el sistema va disminuyendo gradualmente la carga a 0.
  
const BASE_URL = 'https://bfsmb-staging-bouncer-v2.fassil.com.bo';
const Base_Url_Atlas='https://bfsmb-staging-atlas-v2.fassil.com.bo'
const usuario = 'user147180';
const contrasenia = '0000';
const codCliente='2786126';

let contador=0;

/*
export let options = {
  scenarios: {
    test_counters: {
        executor: 'constant-arrival-rate',
        rate: 5,
        duration: '10s',
        preAllocatedVUs: 60,
    },
},
  thresholds: {
      // Hack to surface these sub-metrics (https://github.com/k6io/docs/issues/205)
      'http_req_duration{my_tag:Bouncer}': ['max>=0'],
      'http_req_duration{my_tag:savingAccount}': ['max>=0'],
      'http_reqs{my_tag:Bouncer}': ['count>=0'],
      'http_reqs{my_tag:savingAccount}': ['count>=0'],
  },
}

/*
export default () => {
   
    const token=obtenerToken();
  
    if (token!=false){
        savingAccount(token,codCliente);
        //currentAccount(token,codCliente);
    }
    sleep(1);
  };
*/
const token="";
  export function obtenerToken(){
    const loginRes = http.post(`${BASE_URL}/connect/token`, {
        grant_type:'password',
        username: usuario,
        password: contrasenia,
        client_id:'flutter_test',
        client_secret:'Th0QroG0kbk3XY7230ae',
        scope:'atlas IdentityServerApi flutter_test',
        client:true,
        deviceDetails:'K6_prueba'
    });
    //console.log(loginRes.json('access_token'));
    //valor variable para ver si el check es true o false 
   let valor= check(loginRes, {
      'Status Request 200 Token ' :(resp)=> resp.status === 200,  
      'Token Exitoso': (resp) => resp.body.includes('access_token')
    });
    
    let authHeaders;
    if (valor==true){
        authHeaders  = {
            headers: {
              Authorization: `Bearer ${loginRes.json('access_token')}`,
            },
          };
    }else{
        authHeaders=false
    }

   
    token=authHeaders;
    return authHeaders;

  };
  export function  savingAccount(token,codigoCliente){

    const myObjects = http.get(`${Base_Url_Atlas}/api/v2/clients/${codigoCliente}/savingAccounts`, token,{ tags: { my_tag: 'savingAccount' } });
   // console.log(myObjects.status);
    check(myObjects, { 'is status 200 Saving': (resp) => resp.status ===200 });
    //console.log(myObjects);
  };
function currentAccount(token,codigoCliente){
    const myObjects = http.get(`${Base_Url_Atlas}/api/v2/clients/${codigoCliente}/currentAccounts`, token,{ tags: { my_tag: 'CurrentAccount' } });
    check(myObjects, { 'is status 200 current': (obj) => obj.status ===200 });
}








