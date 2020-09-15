import React, { useState, useContext, useEffect } from "react"
import { useCookies } from "react-cookie"
import { LoginTokenContext, LoginStatusContext } from "./LoginTokenContext"
import { MainClass } from './tools/Class'
import { userApi } from './tools/Env'

const Login = (props) => {
    const [token, setToken] = useContext(LoginTokenContext)
    const [loginStatus, setLoginStatus] = useContext(LoginStatusContext)
    const [cookies, setCookie] = useCookies('token')


    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    })

    // 登录错误信息state,此处不能设置为对象，因为fetch error会setState为字符串
    const [apiInfo, setApiInfo] = useState()

    useEffect(() => {
        if (loginStatus) {
            props.history.push("/")
        }
    }, [loginStatus, props.history])

    const handleEdit = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const fetchUserApi = async () => {
        try {
            let result = await fetch(userApi, {
                method: 'POST',
                body: JSON.stringify(loginData),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            // result = Response响应对象
            if (result.ok) {
                result = await result.json()
                setApiInfo(result.info)
                setToken({
                    token: result.token,
                    username: result.username
                })
                // 保存token到cookie
                setCookie('token', result.token, { path: '/' })
                setLoginStatus(true)
                // 等待setLoginStatus结束后才进行goBack操作，否则会出现挂载未结束告警
                if (loginStatus) {
                    props.history.goBack()
                }
            } else {
                result = await result.json()
                setApiInfo(result.info)
                props.history.push('/login')
            }
        } catch (err) {
            setApiInfo(`API error(${err.message})`)
        }

    }
    const handleSubmit = (e) => {
        // 此处必须要分离出async异步函数，不能把该handle定义为异步函数
        fetchUserApi()
        e.preventDefault()
    }

    return (
        <>
            <MainClass>
                <form className="form-signin" onSubmit={(e) => handleSubmit(e)}>
                    <div className="form-group">
                        <label htmlFor="username" />
                        <input className="form-control" name="username" type="text" value={loginData.username} onChange={(e) => handleEdit(e)} placeholder="用户名" autoFocus required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" />
                        <input rows="10" className="form-control" name="password" type="password" value={loginData.password} onChange={(e) => handleEdit(e)} placeholder="密码" autoFocus required />
                    </div>
                    <button type="submit" className="btn btn-primary" >Submit
                    </button>
                    {apiInfo ? <span className="ml-4 text-danger">{apiInfo}</span> : ''}
                </form>
            </MainClass>
        </>
    )
}

export default Login