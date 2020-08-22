function like(event) {
    const button = event.currentTarget

	axios.post(`https://project-management-tool-miguel.herokuapp.com/projects/${button.id}/like`)
		.then(res => {
			const add = res.data.like
			button.querySelector('.likes-count').innerText = Number(button.querySelector('.likes-count').innerText) + add
		})
		.catch(console.error)
}