import axios from 'axios';
import { host } from '../API/apiPath';

export default async function RequestUtils(props) {
    const headers = {
        'Content-Type': 'application/json; charset=UTF-8'
    };
    const {url, param} = {...props};
    const path = host + url;
    
    return await axios.post(path,param,headers).then((response) => {
        return response.data;
    }).catch((error) => {
      return error;
    }).finally(() => {
      // always executed
    });
}