export const init = () => {
    const nav = document.querySelector('.navigation')
    const main = document.querySelector('#main')
    nav.addEventListener('click', (e) => {
        nav.classList.toggle('active')
    })
};