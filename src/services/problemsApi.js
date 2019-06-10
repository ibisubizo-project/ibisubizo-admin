import ApiService from "./Api";


const BASE_URL = process.env.URL || 'http://localhost:8000/api'
const client = new ApiService({ baseURL: BASE_URL });

const problemsApi = {};

const getPageSlice = (limit, page = 0) => ({ begin: page * limit, end: (page + 1) * limit });
const getPageValues = ({ begin, end, items }) => items.slice(begin, end);


problemsApi.getAllApprovedProblems = () => client.get('/problems/approved')
problemsApi.getAllResolvedProblems = () => client.get('/problems/resolved')
problemsApi.getAllUnResolvedProblems = () => client.get('/problems/unresolved')
problemsApi.getAllProblems = () => client.get('/problems')
problemsApi.getProblem = (problem_id) => client.get(`/problems/${problem_id}`)
problemsApi.getAllUsersProblems = (user_id) => client.get(`/problems/user/${user_id}`)
problemsApi.approveProblem = (payload) => client.put(`/problems/approve`, payload)
problemsApi.getAllUnApprovedProblems = () => client.get(`/problems/unapproved`)

problemsApi.addProblem = (problem) => client.post('/problems/', problem);

export default problemsApi;