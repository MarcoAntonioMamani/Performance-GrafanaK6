import * as config_data from '../Services/ArchivosConfiguracion/Config.js'
import * as data_login from '../Services/ArchivosConfiguracion/LoginConfig.js'
import http from 'k6/http';


export const execute=()=>{
 return http.post(`${config_data.url_bouncer}${data_login.url}`,data_login.body );   
}



