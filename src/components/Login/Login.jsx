import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import userApi from '../../services/usersApi';
import './index.css';

class Login extends Component {
    state = {
        phone: '',
        password: '',
        redirectToHome: false,
        error: ''
    }

    onSubmit (event) {
        event.preventDefault()
        userApi.Login({phone: this.state.phone, password: this.state.password}).then(result => {
            let token = result.token;
            localStorage.setItem("ibisubizo.admin.token", token);
            this.setState({redirectToHome: true});
        }).catch(error => {
            let errorMessage = error.response.data.error
            this.setState({error: errorMessage})
        });
    }

    onFieldChanged (event) {
        this.setState({[event.target.name]: event.target.value})
    }
    render() {
        if(this.state.redirectToHome) {
            return <Redirect to='/' />
        }
        return (
            <div>
                <div className="container">
                    <div className="login-section">
                        <form onChange={this.onFieldChanged.bind(this)} onSubmit={this.onSubmit.bind(this)}>
                            <h3 id="logo">Log In</h3>
                            {this.state.error && (
                                <div className="error text-center">{this.state.error}</div>
                            )}

                            <label htmlFor="email">E-mail</label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Enter your phone"
                                autoComplete="off" required />

                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password.."
                                autoComplete="off" required />

                            <input type="submit" name="submit" value="Log In" />

                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;