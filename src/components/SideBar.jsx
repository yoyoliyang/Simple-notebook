import React from "react"
import Search from "./Search"

const SideBar = (props) => {


    return (
        <aside className="col-md-4 blog-sidebar">
            <div className="p-3 mb-3 bg-light rounded">
                <h4 className="font-italic">About</h4>
                {/* { token ? <span>token: {token}</span> : '' } */}
                <p className="mb-0">这是我的笔记本 <em>兴趣是学习进步的动力</em></p>
            </div>

            <div className="p-3" >
                {/* 传递父组件函数至Search组件 */}
                <Search handleSetSearch={props.handleSetSearch}/>
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