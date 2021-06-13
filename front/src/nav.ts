export const init = () => {
    const nav = document.querySelector('.navigation')
    nav.addEventListener('click', (e) => {
        nav.classList.toggle('active')
    })
};