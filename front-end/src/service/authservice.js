import api from "./api";


export const loginApi = (data) => {
    return api.post("/auth/login", data);
};

export const registerApi = (data) => {
    return api.post("/auth/register", data);
};

export const logoutApi = () => {
    return api.post("/auth/logout");
};  
