const scan = document.querySelector<HTMLButtonElement>('#scan');

scan.addEventListener('click', async() => {
    const result = await fetch('/temp', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/html'
        },
        body: '측정',
    });
    let data = await result.text()
    data = await JSON.parse(data)
    console.log(data)
})