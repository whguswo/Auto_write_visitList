import { init } from './nav';
import "./nav.css";
init();

import QrScanner from 'qr-scanner';
// import QrScannerWorkerPath from '!!file-loader!./../qr-scanner';
// console.log(QrScannerWorkerPath)
// QrScanner.WORKER_PATH = QrScannerWorkerPath;

const qrVideo = document.querySelector<HTMLVideoElement>('#qrVideo')
const turn = document.querySelector<HTMLButtonElement>('#turn')
const camera = (location.search.match(/camera=(\w+)/)?.[1] ?? 'user') as 'user' | 'environment';
const main = document.querySelector<HTMLDivElement>('#main')
const loading = document.querySelector<HTMLDivElement>('.loader')
const info = document.querySelector<HTMLDivElement>('#info')

turn.addEventListener('click', () => location.search = `?camera=${camera === 'user' ? 'environment' : 'user'}`);

window.addEventListener('load', async (e) => {
    main.style.display = 'none'
})

const setResult = async (result: string) => {
    scanner.stop()
    const hash = result
    const date = new Date()

    const compareRes = await fetch('/qrcompare', {
        method: 'POST',
        body: JSON.stringify({
            result: [hash, date.toISOString()]
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await compareRes.text()
    if(data == 'bad') {
        alert('체온이 너무 높습니다. 좀 더 떨어져서 측정하거나 잠시뒤 다시 측정해주세요.')
        scanner.start()
    } else if (data == 'noUser') {
        alert('등록된 사용자가 아닙니다.\n입력된 정보를 다시 확인해주세요.')
        scanner.start()
        // window.location.reload()
    } else {
        scanner.start()
        let filter = "win32|win64|mac";

        if(navigator.platform){

            if (0 > filter.indexOf(navigator.platform.toLowerCase())) {    
                alert('방명록이 작성되었습니다.')
                
            } else {
                info.innerHTML = '<h1>사용자 정보</h1>'
                let countDiv = document.createElement('div')
                let arr = JSON.parse(data)
                arr[1] = new Date(arr[1])
                arr[1] = `${arr[1].getFullYear()}-${arr[1].getMonth() + 1}-${arr[1].getDate()} ${arr[1].getHours()}:${arr[1].getMinutes()}:${arr[1].getSeconds()}`
                let option = ['이름', '시간', '온도']
                alert('방명록이 작성되었습니다.')
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
            }
            
        }
        
    }
    // window.location.reload()
}

// const reloadScanner = () => {
//     const scanner = new QrScanner(qrVideo, result => setResult(result), error => { }, 300, camera);

//     scanner.start()
//         .then(() => {
//             loading.style.display = 'none'
//             main.style.display = ''
//         })  
// }
const scanner = new QrScanner(qrVideo, result => setResult(result), error => { }, 300, camera);

scanner.start()
    .then(() => {
        loading.style.display = 'none'
        main.style.display = ''
    })