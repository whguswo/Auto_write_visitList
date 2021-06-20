import QRCode from 'qrcode';
import { init } from './nav';
import "./nav.css";
init();

const qrName = document.querySelector<HTMLInputElement>('#name')
const phoneNum = document.querySelector<HTMLInputElement>('#phone')
const button = document.querySelector<HTMLButtonElement>('#makeQR')
const code = document.querySelector<HTMLCanvasElement>('#code')

button.addEventListener('click', async(e) => {
    const result = await fetch('/qrHash', {
        method: 'POST',
        body: qrName.value + phoneNum.value,
        headers: {
            'Content-Type': 'text/plain'
        }
    });
    let data = await result.text();
    console.log(data)
    QRCode.toCanvas(code, data, () => {
        console.log('success!')
    })
})