import axios from "axios";

const axiosInstance = axios.create({ baseURL: "http://localhost:8080/api/v1/", withCredentials: true })

axiosInstance.interceptors.request.use(function (config) {
    // console.log(config,"config") 
    return config
}, function (error) {
    return Promise.reject(error)
})
axiosInstance.interceptors.response.use(function (config) {
    // console.log(config,"config") 
    return config
}, function (error) {
    return Promise.reject(error)
})

export const signUpUser = (username: string, mobile: string, email: string, password: string) => {
    return axiosInstance.post('user/sign-up', { username, mobile, email, password })
}
export const signInUser = (mobile: string, password: string) => {
    return axiosInstance.post('user/sign-in', { mobile, password })
}
export const verifyUser = (mobile: string, otp: string) => {
    return axiosInstance.post('user/verify', { mobile, otp })
}
export const signOutUser = () => {
    return axiosInstance.get('user/sign-out')
}

// chat api end point

export const getAuth = () => {
    return axiosInstance.get('user')
}

export const getAllChats = () => {
    return axiosInstance.get('chat')
}

// message api end point

export const sendMessage = (chatId: string, message: string) => {
    return axiosInstance.post('message/' + chatId, { message })
}

export const getAllMessage = (chatId: string) => {
    return axiosInstance.get('message/' + chatId)
}   