import QRCode from 'qrcode';
import { init } from './nav';
import "./nav.css";
import "./code.css";
init();

const qrName = document.querySelector<HTMLInputElement>('#name')
const phoneNum = document.querySelector<HTMLInputElement>('#phone')
const button = document.querySelector<HTMLButtonElement>('#makeQR')
const code = document.querySelector<HTMLCanvasElement>('#code')

const ctx = code.getContext('2d');
let img = new Image ();
img.src = "../src/qrcode.png" ;
code.width = 164;
code.height = 164;
code.style.width = '200px';
code.style.height = '200px';
img.onload = () => {
    ctx.globalAlpha = 0.2;
    ctx.drawImage(img, 0, 0, 164, 164);
};

button.addEventListener('click', async(e) => {
    if(qrName.value != '' && phoneNum.value != '') {
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
            code.style.width = '200px'
            code.style.height = '200px'
        })
    } else {
        alert('정보를 모두 입력해주세요!')
    }
})