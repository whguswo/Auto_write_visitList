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
    if (data == 'noUser') {
        alert('등록된 사용자가 아닙니다.\n입력된 정보를 다시 확인해주세요.')
        window.location.reload()
    } else {
        alert('방명록이 작성되었습니다.')
    }
    window.location.reload()
}

const scanner = new QrScanner(qrVideo, result => setResult(result), error => { }, 300, camera);

scanner.start()
    .then(() => {
        loading.style.display = 'none'
        main.style.display = ''
    })