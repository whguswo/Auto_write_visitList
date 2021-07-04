import { init } from './nav';
import "./nav.css";
import "./login.css";
init();

const loginButton = document.querySelector<HTMLButtonElement>('#submit')
const id = document.querySelector<HTMLInputElement>('#id')
const pass = document.querySelector<HTMLInputElement>('#pass')

loginButton.addEventListener('click', async(e) => {
    const result = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify({
            id: id.value,
            pass: pass.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let data = await result.text();
    if(data == 'admin') {
        alert(`환영합니다. Admin님`)
        location.href = '/front/dist/check/admin.html'
    } else {
        alert('Access denied.')
    }
})
