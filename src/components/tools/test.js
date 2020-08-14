const markdown = require("markdown").markdown;

const md = "Hello.\n\n* This is markdown.\n* It is fun\n* Love it or leave it."

html_con = markdown.toHTML(md)

console.log(html_con)
