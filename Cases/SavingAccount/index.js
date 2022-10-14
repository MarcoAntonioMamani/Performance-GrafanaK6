import * as login_service from '../../Services/Login.js'
import * as savingAccount_service from '../../Services/SavingAccount.js'
import { sleep,check } from 'k6'


export let option ={
    stages:[
        {duration : '5s',target:1},
    ]
}

export function setup(){
    const loginRes = login_service.execute();     
     let authHeaders;
     let valor=loginRes.status;
     if (valor==200){
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

export default function(token){
   
    if (token!=false){
        const result =savingAccount_service.execute(token);
        check(result, { 'is status 200 SavingAccount': (resp) => resp.status ===200 });
    }

    sleep(1);
  };
