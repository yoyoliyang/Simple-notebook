const test = async () => {
	try {
		const imgURL = 'https://r210:5000/api/img/2d7bac14-7501-4f07-9c96-1985589c61f5--1597824981514'
		const data = await fetch(imgURL)
		const base64str = await data.text
		console.log(base64str)
	} catch (err) {
		console.log(err.name,err.message)
	}
}

test()
