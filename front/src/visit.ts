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
const info = document.querySelector('#info')

window.addEventListener('load', async (e) => {
    
    main.style.display = 'none'
    const tracks = await navigator.mediaDevices.enumerateDevices();
    const deviceId = tracks.find(v => { if (v.kind === 'videoinput' && v.label !== 'OBS Virtual Camera') return true; return false; }).deviceId;
    let filter = "win32|win64|mac";

    if(navigator.platform){

        if (0 > filter.indexOf(navigator.platform.toLowerCase())) {    
            //mobile
            let stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 680, height: 480, deviceId },
                // video: { width: 1523, height: 880, deviceId }
                audio: false
            });
            video.srcObject = stream;
            loading.style.display = 'none'
            main.style.display = ''
            
        } else {
            //PC
            let stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1200, height: 1200, deviceId },
                // video: { width: 1523, height: 880, deviceId }
                audio: false
            });
            video.srcObject = stream;
            loading.style.display = 'none'
            main.style.display = ''
        }
        
    }
    // let stream = await navigator.mediaDevices.getUserMedia({
    //     video: { width: 680, height: 480, deviceId },
    //     // video: { width: 1523, height: 880, deviceId }
    //     audio: false
    // });
    // video.srcObject = stream;
    // loading.style.display = 'none'
    // main.style.display = ''
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
                const result = await fetch('/temp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/html'
                    },
                    body: '측정',
                });
                let temp = await result.text()
                if(temp != 'bad') {
                    let date = new Date()
                    const write = await fetch('/writeList', {
                        method: 'POST',
                        body: JSON.stringify({
                            visit: [data[0], date.toISOString(), temp]
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    info.innerHTML = '<h1>사용자 정보</h1>'
                    const arr = [data[0], date.toISOString(), temp]
                    let countDiv = document.createElement('div')
                    countDiv.classList.add('count')
                    arr[1] = new Date(arr[1])
                    arr[1] = `${arr[1].getFullYear()}-${arr[1].getMonth() + 1}-${arr[1].getDate()} ${arr[1].getHours()}:${arr[1].getMinutes()}:${arr[1].    getSeconds()}`
                    let option = ['이름', '시간', '온도']
                    for(let i = 0; i < 3; i++) {
                        let field = document.createElement('fieldset')
                        let legend = document.createElement('legend')
                        legend.innerText = option[i]
                        field.append(legend)
                        field.append(arr[i])
                        info.append(field)
                    }
                    let i = 5
                    let count = setInterval(() => {
                        countDiv.innerHTML = `${i}초 뒤에 자동으로 새로고침`
                        if(i == 0) {
                            window.location.reload()
                        }
                        i -= 1
                    }, 1000)
                    info.append(countDiv)

                    alert('방명록이 작성되었습니다.')
                } else {
                    alert('체온이 너무 높습니다. 좀 더 떨어져서 측정하거나 잠시뒤 다시 측정해주세요.')
                }
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