import ApiService from "./Api";

const client = new ApiService({});

const userApi = {};


userApi.Login = (credentials) => client.post('/auth/admin/login', credentials)
userApi.Register = (credentials) => client.post('/auth/register', credentials)
userApi.GetUserById = (userId) => client.get(`/users/${userId}`)


export default userApi;