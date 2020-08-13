import React from "react"
// import { LoginTokenContext } from "./LoginTokenContext"

const SideBar = () => {

    // const [token, setToken] = useContext(LoginTokenContext)

    // useEffect(() => {
    //     console.log(token)
    // }, [token])

    return (
        <aside className="col-md-4 blog-sidebar">
            <div className="p-3 mb-3 bg-light rounded">
                <h4 className="font-italic">About</h4>
                {/* { token ? <span>token: {token}</span> : '' } */}
                <p className="mb-0">这是我的笔记本 <em>注意了：</em> 这里面的内容是硬编码写入的，不要尝试从管理修改。</p>
            </div>

            <div className="p-3">
                <h4 className="font-italic">Archives</h4>
                <ol className="list-unstyled mb-0">
                    {/* <li><a href="#">March 2014</a></li> */}
                </ol>
            </div>

            <div className="p-3">
                <h4 className="font-italic">Elsewhere</h4>
                <ol className="list-unstyled">
                    {/* <li><a href="#">GitHub</a></li> */}
                </ol>
            </div>
        </aside>
    )
}

export default SideBar 