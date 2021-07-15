import { init } from './nav';
import "./nav.css";
init();

const rekoServer = '/blob'
const video = document.querySelector<HTMLVideoElement>('video')
const visitButton = document.querySelector<HTMLButtonElement>('button')
const canvas = document.querySelector<HTMLCanvasElement>('canvas');
const main = document.querySelector<HTMLDivElement>('#main')
const loading = document.querySelector<HTMLDivElement>('.loader')
const ctx = canvas.getContext('2d');

window.addEventListener('load', async (e) => {
    main.style.display = 'none'
    const tracks = await navigator.mediaDevices.enumerateDevices();
    const deviceId = tracks.find(v => { if (v.kind === 'videoinput' && v.label !== 'OBS Virtual Camera') return true; return false; }).deviceId;
    let stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 680, height: 480, deviceId },
        audio: false
    });
    video.srcObject = stream;
    loading.style.display = 'none'
    main.style.display = ''
})

visitButton.addEventListener('click', (e) => {
    visitButton.disabled = true;
    visitButton.style.backgroundColor = 'gray'
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
        const result = await fetch(rekoServer, {
            method: 'POST',
            body: blob,
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });

        let data = await result.json();
        console.log(data)

        if (data[0] == 'noPerson') {
            alert('사람이 없습니다.')
        } else if (data[0] == 'noIden') {
            let isNew = confirm('처음보는 사용자 입니다. 사용자를 등록하시겠습니까?')
            if (isNew) {
                location.href = '/addUser'
            }
        } else {
            let answer = confirm(`${data[0]}이(가) 맞나요?`)
            if (answer) {
                let date = new Date()
                const write = await fetch('/writeList', {
                    method: 'POST',
                    body: JSON.stringify({
                        visit: [data[0], date.toISOString()]
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                let reconfirm = confirm('사용자 등록을 하셨나요?')
                if (reconfirm) {
                    alert('다시 측정해주세요.')
                    window.location.reload()
                } else {
                    location.href = '/addUser'
                }

            }

        }
        visitButton.disabled = false;
        visitButton.style.backgroundColor = 'lightgreen';
    })

})