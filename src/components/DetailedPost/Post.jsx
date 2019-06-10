import React, {Component} from 'react';
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import { Link } from 'react-router-dom';
import problemsApi from '../../services/problemsApi';
import userApi from '../../services/usersApi';
import likesApi from '../../services/likesApi';
import commentsApi from '../../services/commentApi';
import TimeAgo from 'react-timeago';


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
            first_name: '',
            last_name: '',
            problemsComments: [],
            problemsLikes: []
        }
    }

    updateLike(problemId) {
        const userLocalStorage = JSON.parse(localStorage.getItem("userData"))
        const { match: { params } } = this.props;

        if(!this.props.userIsAuthenticated) {
            this.setState({redirectToLogin: true})
            return
        } else {
            if(this.state.hasLiked) {
                const userLike = {}
                userLike.problem_id = params.id
                userLike.liked_by = userLocalStorage._id
                likesApi.RemoveLike(this.props._id, userLocalStorage._id).then(result => {
                    this.state.likes.map((item, index) => {
                        if(item.liked_by === userLocalStorage._id) {
                            this.state.likes.splice(index, 1)
                        }
                    })
                    this.setState({hasLiked: !this.state.hasLiked})
                }).catch(error => {
                    console.error(error)
                })
            } else {
                //If the user has not liked te post before and clicked the like button
                //-Add the like to the database (They just liked the post )
                const like = {}
                like.problem_id = params.id
                like.liked_by = userLocalStorage._id

                likesApi.AddLike(like).then(result => {
                    this.setState({likes: [...this.state.likes, like], hasLiked: !this.state.hasLiked})
                }).catch(error => {
                    console.error(error)
                })
            }
        }
    }

    handleSubmit(event) {
        event.preventDefault()
        const { match: { params } } = this.props;
        if(this.state.comment.length < 2) return;

        let problemId = params.postId;
        // let loggedInUser = localStorage.getItem("userData");
        // let userId = JSON.parse(loggedInUser)._id;
        let comment = {
          post_id: problemId,
          user_id: "5cec722a63f44cba05ca8372",
          comment:  this.state.comment
        }

        commentsApi.AddComment(problemId, comment)
        this.state.problemsComments.unshift(comment)
        this.setState({comment: ''})
    }


    componentDidMount() {
        const { match: { params } } = this.props;
        this.setState({isLoading: true})
        let problems = problemsApi.getProblem(params.postId)
        let comments = commentsApi.ListAllPostComments(params.postId)
        let likes  = likesApi.GetAllLikes(params.postId)
        Promise.all([problems, comments, likes]).then(result => {
            //this.props.setSelectedProblemsComments(result[1])
            //this.props.setSelectedProblemsLikes(result[2])

            this.setState({problemsComment: result[1], problemsLikes: result[2]})

            userApi.GetUserById(result[0].created_by).then(userData => {
                let { firstname, lastname } = userData;
                let name = `${firstname} ${lastname}`;
                this.setState({postedBy: name})
            }).catch(error => this.setState({error: error}));
            result[2].map(like => {
                // const userLocalStorage = JSON.parse(localStorage.getItem("userData"))
                // if(like.liked_by === userLocalStorage._id) {
                //     this.setState({hasLiked: true})
                // }
            })
            this.setState({problem: result[0], isLoading: false, likes: result[2]})
        }).catch(error => {
            console.error(error)
            this.setState({isLoading: false})
        });
    }
    render() {
        console.log(this.props);
        const { match: { params } } = this.props;
        let renderPostImage = null
        if(this.state.problem.pictures !== undefined) {
            renderPostImage = (this.state.problem.pictures.length > 0) ? <p><a href={this.state.problem.pictures[0]}><img src={this.state.problem.pictures[0]} alt="Upload" className="border border-solid border-grey-light rounded-sm" /></a></p> : '';
        }

        let firstname = undefined;
        let lastname = undefined;

        //TODO: Handle Properly
        if(localStorage.getItem("admin_token") === undefined) {
             firstname = "Admin"
             lastname = "Super"
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
                                    <form className="form" onSubmit={this.handleSubmit.bind(this)}>
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
                                                <h4 className="font-extrabold">{`${firstname}, ${lastname}`}</h4>
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

                    <div className="w-2/5 ml-4 mt-10 hidden sm:block md:block">
                        <h4>Problem Listings</h4>
                    </div>
                </div>
            </div>
        )
    }
}

export default Post