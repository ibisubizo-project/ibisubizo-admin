import React, {Component} from 'react';
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import { Link } from 'react-router-dom';
import problemsApi from '../../services/problemsApi';
import userApi from '../../services/usersApi';
import likesApi from '../../services/likesApi';
import commentsApi from '../../services/commentApi';
import TimeAgo from 'react-timeago';
import jwt_decode from 'jwt-decode'


class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            problem : {},
            comments: [],
            likes: [],
            comment: '',
            postedBy: '',
            hasLiked: false,
            featuredProblems: [],
            error: '',
            redirectToLogin: false,
            firstname: '',
            lastname: '',
            problemsComments: [],
            problemsLikes: []
        }
    }


    handleSubmit(event) {
        event.preventDefault()
        const { match: { params } } = this.props;
        if(this.state.comment.length < 2) return;

        let problemId = params.postId;
        let loggedInUser = jwt_decode(localStorage.getItem("ibisubizo.admin.token"));
        let userId = loggedInUser.id;
        let comment = {
          post_id: problemId,
          user_id: userId,
          comment:  this.state.comment
        }
        this.state.problemsComments.unshift(comment)
        this.setState({comment: ''})

        commentsApi.AddComment(problemId, comment).then(result => {
            console.dir(result)
        })
        
    }


    componentDidMount() {
        const { match: { params } } = this.props;
        this.setState({isLoading: true})
        let problems = problemsApi.getProblem(params.postId)
        let comments = commentsApi.ListAllPostComments(params.postId)
        let likes  = likesApi.GetAllLikes(params.postId)
        this.setAdminName();
        Promise.all([problems, comments, likes]).then(result => {
            this.setState({problemsComment: result[1], problemsLikes: result[2]})
            userApi.GetUserById(result[0].created_by).then(userData => {
                let { firstname, lastname } = userData;
                let name = `${firstname} ${lastname}`;
                this.setState({postedBy: name})
            }).catch(error => this.setState({error: error}));
            result[2].map(like => {})
            this.setState({problem: result[0], problemsComments: result[1], isLoading: false, likes: result[2]})
        }).catch(error => {
            console.error(error)
            this.setState({isLoading: false})
        });
    }


    setAdminName() {
        if(localStorage.getItem("ibisubizo.admin.token") !== undefined) {
            let adminLocalStorage = localStorage.getItem("ibisubizo.admin.token")
            if(adminLocalStorage !== undefined) {
                let admin = jwt_decode(adminLocalStorage)
                userApi.GetUserById(admin.id).then(result => {
                    console.log("I got here")
                    this.setState({firstname: result.firstname, lastname: result.lastname})
                }).catch(error => {
                    console.dir(error);
                })
            }
        }
    }

    
    render() {
        const { match: { params } } = this.props;
        let renderPostImage = null
        if(this.state.problem.pictures !== undefined) {
            renderPostImage = (this.state.problem.pictures.length > 0) ? <p><a href={this.state.problem.pictures[0]}><img src={this.state.problem.pictures[0]} alt="Upload" className="border border-solid border-grey-light rounded-sm" /></a></p> : '';
        }

        return (
            <div className="content">
                <div className="container m-auto p-8 text-grey-darkest flex">
                    <div className="w-full sm:w-4/5 md:w-4/5 py-4">
                        <div className="flex">
                            <div className="w-full pl-0">
                                <div className="flex justify-between">
                                    <div className="flex justify-between">
                                        <div><span className="font-bold mr-12">{this.state.postedBy}</span></div>
                                        <div><span className="text-grey-dark"><TimeAgo date={new Date(this.state.problem.created_at)} /></span></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-4">
                                        <p className="mb-6 font-bold">{this.state.problem.title}</p>
                                        <p className="mb-4">{this.state.problem.text}</p>
                                        {renderPostImage}
                                    </div>

                                    <div className="py-4">
                                        <div className="flex">
                                            <span
                                                className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2">
                                                <i className="fa fa-comment fa-lg mr-2"></i>{this.state.problemsComments.length}
                                            </span>
                                            <span
                                                onClick={(e) => this.updateLike(params.id)}
                                                className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2">
                                                <i className="fa fa-heart fa-lg mr-2"></i> {this.state.likes.length}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <form onSubmit={this.handleSubmit.bind(this)}>
                                        <input
                                            className="w-full h-8 p-2"
                                            type="text"
                                            name='comment'
                                            value={this.state.comment}
                                            onChange={(e) => {
                                                this.setState({comment: e.target.value})
                                            }}
                                            placeholder="Add your comment" />
                                    </form>
                                </div>

                                <div className="comments mt-6 border-grey-lighter">
                                    {this.state.problemsComments.map((comments, index) => (
                                        <div key={index} className="bg-white p-5 mb-4">
                                            <div className="flex justify-between">
                                                <h4 className="font-extrabold">{`${this.state.firstname}, ${this.state.lastname}`}</h4>
                                                <TimeAgo date={new Date(comments.commented_at)} />
                                            </div>

                                            <div>
                                                {comments.comment}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/*  */}
                    </div>
                </div>
            </div>
        )
    }
}

export default Post