import http from 'k6/http';
import { check, group, sleep } from 'k6';
import * as config_data from './Services/ArchivosConfiguracion/Config.js'
import * as data_login from './Services/ArchivosConfiguracion/LoginConfig.js'

  
const BASE_URL = 'https://bfsmb-staging-bouncer-v2.fassil.com.bo';
const Base_Url_Atlas='https://bfsmb-staging-atlas-v2.fassil.com.bo'
const usuario = 'user71590';
const contrasenia = '0000';
const codCliente='23805';

let contador=0;



export function setup(){

  //console.log(`${config_data.url_bouncer}${data_login.url}`)
 //console.log(data_login.body)

const loginRes = http.post(`${config_data.url_bouncer}${data_login.url}`,data_login.body );

console.log("Body: "+loginRes.body)

let valor= check(loginRes, {
  'Status Request 200 Token ' :(resp)=> resp.status == 200,  
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


return authHeaders;

}


export default (token) => {
   
    //const token=obtenerToken();
  
    if (token!=false){
        savingAccount(token,codCliente);
        currentAccount(token,codCliente);
    }
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

   let valor= check(loginRes, {
      'Status Request 200 Token ' :(resp)=> resp.status == 200,  
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








