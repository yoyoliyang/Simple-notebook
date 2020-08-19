import React, { useState } from "react"
import {searchApi} from './tools/Env'

const Search = (props) => {

    const [value, setValue] = useState()
    // const [resultData, setResultData] = useState()

    const handleInput = (e) => {
        setValue(e.target.value)
    }

    const fetchSearchData = async (s) => {
        let result = await fetch(searchApi + s)
        result = await result.json()
        // 父组件Sidebar函数（来自List组件）
        props.handleSetSearch(result)
    }
    const handleSubmit = (e) => {
        fetchSearchData(value)
        e.preventDefault()
    }
    return (
        <>
            <form className="form-group" onSubmit={handleSubmit}>
                <label htmlFor="search" />
                <input className="form-control" name="search" onChange={handleInput} placeholder="search..." required />
            </form>
        </>
    )
}

export default Search