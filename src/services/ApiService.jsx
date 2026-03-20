import { apiconfig } from "./ApiAuth"

export const fetchApi = {
    postApi : async (url, props) => {
        try{
            const response = await apiconfig.post(url, props);
            return response.data;
        }catch(error){
             if (error.response && error.response.data) return error.response.data;
        }
        
    },

    getApi : async (url) => {
       try{
            const response = await apiconfig.get(url);
            return response.data;
        }catch(error){
             if (error.response && error.response.data) return error.response.data;
        }
    },

    putApi : async (url, props) => {
        try{
            const response = await apiconfig.put(url, props);
            return response.data;
        }catch(error){
             if (error.response && error.response.data) return error.response.data;
        }
    },

    deleteApi : async (url) => {
        try{
            const response = await apiconfig.delete(url);
            return response.data;
        }catch(error){
             if (error.response && error.response.data) return error.response.data;
        }
    }
}