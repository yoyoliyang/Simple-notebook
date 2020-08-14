import React, { useState, useContext, useEffect, useCallback } from "react"
import { useCookies } from "react-cookie"
import { LoginTokenContext, LoginStatusContext } from "./LoginTokenContext"
import { MainClass } from './Main'
import Header from './Header'

const Login = (props) => {
    const [token, setToken] = useContext(LoginTokenContext)
    const [loginStatus, setLoginStatus] = useContext(LoginStatusContext)

    const [cookies, setCookie] = useCookies('last_token')

    const userApi = "http://127.0.0.1:5000/api/user"

    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    })


    const tokenApi = 'http://127.0.0.1:5000/api/check_token'
    const checkToken = async () => {
        let result = await fetch(tokenApi, {
            method: 'POST',
            body: JSON.stringify(cookies),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        result = await result.json()
        if (result.loginStatus) {
            setLoginStatus(true)
            props.history.push('/')
        }
    }

    // const callbackCheckToken = useCallback(() => {
    //     checkToken()
    // }, [checkToken])

    useEffect(() => {
        if (cookies.last_token) {
            checkToken()
        }
    }, [cookies.last_token]) // 避免重复提交check_auth

    const handleEdit = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const fetchUserApi = async () => {
        let result = await fetch(userApi, {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        result = await result.json()
        if (result.last_token) {
            setToken({
                last_token: result.last_token,
                username: result.username
            })
            // 保存token到cookie
            setCookie('last_token', result.last_token, { path: '/' })
            setLoginStatus(true)
            props.history.push('/')
        } else {
            props.history.push('/login')
        }

    }
    const handleSubmit = (e) => {
        // 此处必须要分离出async异步函数，不能把该handle定义为异步函数
        fetchUserApi()
        e.preventDefault()
    }

    return (
        <>
            <Header />
            <MainClass>
                <form className="form-signin" onSubmit={(e) => handleSubmit(e)}>
                    <div className="form-group">
                        <label htmlFor="username" />
                        <input className="form-control" name="username" value={loginData.username} onChange={(e) => handleEdit(e)} placeholder="用户名" autoFocus required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" />
                        <input rows="10" className="form-control" name="password" value={loginData.password} onChange={(e) => handleEdit(e)} placeholder="密码" autoFocus required />
                    </div>
                    <button type="submit" className="btn btn-primary" >Submit</button>
                </form>
            </MainClass>
        </>
    )
}

export default Login