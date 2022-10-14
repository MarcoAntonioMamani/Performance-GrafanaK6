import * as config_data from '../Services/ArchivosConfiguracion/Config.js'
import * as data_login from '../Services/ArchivosConfiguracion/LoginConfig.js'
import http from 'k6/http';


export const execute=(token)=>{
    return http.get(`${config_data.url_atlas}/api/v2/clients/${data_login.clientId}/savingAccounts`, token);
}


