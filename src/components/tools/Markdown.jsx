import React, { useEffect, useState } from "react"
import marked from "marked"
import HtmlReactParser from "html-react-parser"
import Prism from "prismjs"
import 'prismjs/themes/prism-okaidia.css'
// import 'prismjs/components/prism-handlebars.min.js'
import 'prismjs/components/prism-json.min.js'
import 'prismjs/components/prism-jsx.min.js'
import 'prismjs/components/prism-python.min.js'
import 'prismjs/components/prism-bash.min.js'

const Md = (props) => {

    const [isloading, setIsloading] = useState(true)

    const HtmlContent = () => {
        // source:夫组建传递过来的markdown源代码
        let mdString = marked(props.source)
        mdString = HtmlReactParser(mdString)
        return (
            <>
                {mdString}
            </>
        )
    }

    useEffect(() => {
        if (props.source) {
            setIsloading(false)
        }
    }, [props.source])

    //注意此处，Prism不能和其他副作用函数放到一块，否则不起作用
    useEffect(() => {
        Prism.highlightAll()
    })

    return (
        <>
            {isloading ? '' :
                <HtmlContent />
            }
        </>
    )
}

export default Md