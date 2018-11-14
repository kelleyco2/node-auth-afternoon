import React, { Component } from 'react'
import './Header.css'
import Axios from 'axios';

export default class Header extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            isAdmin: false,
        }

        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
        this.logout = this.logout.bind(this)
    }
    handleUsernameInput(e){
        // should update this.state.username  based on user input. Do not mutate state, use setState.
        this.setState({
            username: e.target.value
        })
    }
    handlePasswordInput(e){
        // should update this.state.password based on user input. Do not mutate state, use setState.
        this.setState({
            password: e.target.value
        })
    }

    toggleAdmin () {
        // should toggle the value of isAdmin on state, by setting it to the value of it's opposite. (!this.state.isAdmin)
        this.setState({
            isAdmin: !this.state.isAdmin
        })
    }

    login () {
        // create POST request to login endpoint
        let { username, password, isAdmin } = this.state
        Axios.post('/auth/login', { username, password }).then(res => {
            this.setState({
                username: '',
                password: ''
            })
            this.props.updateUser({ username, isAdmin })
        })
    }

    register () {
        // create POST request to register new user
        let { username, password, isAdmin } = this.state
        Axios.post('/auth/register', { username, password, isAdmin}).then(res => {
            this.setState({
                username: '',
                password: ''
            })
            this.props.updateUser({ username, isAdmin })
        })
    }

    logout () {
        // GET request to logout
        Axios.get('/auth/logout').then(res => {
            this.props.updateUser({})
        })
    }

    render() {
        const { username, password } = this.state
        const { user } = this.props
        return (
            <div className='Header'>
                <div className="title">Dragon's Lair</div>
                {
                    user.username ?
                    (<div className='welcomeMessage'>
                            <h4>{user.username}, welcome to the dragon's lair</h4>
                            <button type="submit" onClick={this.logout}>Logout</button>
                        </div>
                        )
                        :
                        <div className="loginContainer">

                            <input type="text"
                                placeholder="Username"
                                value={username}
                                onChange={e => this.handleUsernameInput(e)}
                                
                            />
                            <input type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => this.handlePasswordInput(e)}
                                
                            />
                            <div className='adminCheck' >
                                <input type="checkbox" id='adminCheckbox' onChange={e => this.toggleAdmin(e)}/> <span> Admin </span>
                            </div>
                            <button onClick={this.login}>Log In</button>
                            <button onClick={this.register} id='reg' >Register</button>

                        </div>}
            </div>
        )
    }
}
