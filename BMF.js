import http from 'k6/http';
import { check, group, sleep } from 'k6';

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
const usuario = 'user13846';
const contrasenia = '0000';
const codCliente='1270152';

let contador=0;
export default () => {
   
    const token=obtenerToken();
   savingAccount(token,codCliente);
   currentAccount(token,codCliente);
    contador++;

    console.log('Contador='+contador);
    sleep(1);
  };


  function obtenerToken(){
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
    check(loginRes, {
      'Status Request 200 Token ' :(resp)=> resp.status === 200,  
      'Token Exitoso': (resp) => resp.body.includes('access_token')
    });

    const authHeaders = {
        headers: {
          Authorization: `Bearer ${loginRes.json('access_token')}`,
        },
      };

    return authHeaders;

  };
  function savingAccount(token,codigoCliente){

    const myObjects = http.get(`${Base_Url_Atlas}/api/v2/clients/${codigoCliente}/savingAccounts`, token);
   // console.log(myObjects.status);
    check(myObjects, { 'is status 200 Saving': (resp) => resp.status ===200 });
    //console.log(myObjects);
  };
function currentAccount(token,codigoCliente){
    const myObjects = http.get(`${Base_Url_Atlas}/api/v2/clients/${codigoCliente}/currentAccounts`, token);
    check(myObjects, { 'is status 200 current': (obj) => obj.status ===200 });
}








