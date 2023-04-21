import axios from 'axios'
import  baseURL  from '../../utils/globalVariables.tsx'

export default function Protected(token) {
    
    return axios.create({
    baseURL:baseURL.baseURL,
    headers:{
        'content-type':'application/json',
        'Authorization':`Bearer ${token}`
    }
})
}
