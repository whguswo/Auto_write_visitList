const addUser = document.querySelector<HTMLDivElement>('#addUser')
const delUser = document.querySelector<HTMLDivElement>('#delUser')
const readList = document.querySelector<HTMLDivElement>('#readList')
const logout = document.querySelector<HTMLDivElement>('#logout')

addUser.addEventListener('click', () => {
    location.href = './addUser.html'
})

delUser.addEventListener('click', () => {
    location.href = './delUser.html'
})

readList.addEventListener('click', () => {
    location.href = './readList.html'
})

logout.addEventListener('click', async () => {
    const result = await fetch('/logout', {
        method: 'GET',
    });
    location.href = '/'
})

