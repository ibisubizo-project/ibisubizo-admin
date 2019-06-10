import ApiService from "./Api";

const client = new ApiService({});

const commentApi = {};


commentApi.AddComment = (postId, comment) => client.post(`/comments/${postId}`, comment)
commentApi.ListAllPostComments = (postId) => client.get(`/comments/${postId}/all`)


export default commentApi;