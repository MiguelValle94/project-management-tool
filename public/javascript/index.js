function like(event) {
    const button = event.currentTarget
    console.log('Hola');

	axios.post(`http://localhost:3000/projects/${button.id}/like`)
		.then(res => {
			const add = res.data.like
			button.querySelector('.likes-count').innerText = Number(button.querySelector('.likes-count').innerText) + add
		})
		.catch(console.error)
}