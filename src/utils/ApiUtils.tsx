import axios from "axios";

const baseUrl = "http://localhost:8080/api";

export const useApi =()=>{
    const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        }
      };
    const httpPost=(url:string, requestBody:any)=>{
        return axios.post(`${baseUrl}${url}`, requestBody, config)
    }

    const httpPut=(url:string, requestBody:any)=>{
      return axios.put(`${baseUrl}${url}`, requestBody, config)
  }

    const httpGet=(url:string)=>{
        return axios.get(`${baseUrl}${url}`)
    }

    return { httpPost, httpGet, httpPut };
};

export const updateUrlParams = (url:string, params:Record<string, string>)=>{
  let modifiedUrl = url;
  for(const par in params) {
    modifiedUrl = modifiedUrl.replace(par,params[par])
  }

  return modifiedUrl;
}