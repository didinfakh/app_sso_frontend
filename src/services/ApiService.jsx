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
    }
}