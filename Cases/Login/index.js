import * as login_service from '../../Services/Login.js'
import * as type_test from './parametrizacion.js'
import { sleep,check } from 'k6'

export let options =type_test.type[__ENV.TYPE_TEST]

export default function(){
  
  //console.log('Tipo de Prueba',__ENV.TYPE_TEST);
    const loginRes = login_service.execute();
 
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
