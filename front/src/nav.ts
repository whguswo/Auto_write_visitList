export const init = () => {
    const nav = document.querySelector('.navigation')
    const main = document.querySelector('#main')
    nav.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        if(!target.classList.contains('fa') && !target.classList.contains('icon')) {
            nav.classList.toggle('active')
            e.stopPropagation()
            window.addEventListener('click', (e) => {
                nav.classList.remove('active')
            })
        }
    })
    
};