import { init } from '../nav';
import "../nav.css";
import "./admin.css";

init();

interface visitList {
    name:string,
    date:string,
    temp:number
}

const main = document.querySelector<HTMLTableElement>('#main')
const pageButton = document.querySelectorAll<HTMLButtonElement>('.pageButton')

pageButton[0].addEventListener('click', (e) => {
    render(-1)
})
pageButton[1].addEventListener('click', (e) => {
    render(1)
})

let page = 1
const startTime = document.querySelector<HTMLInputElement>('#startTime');
const endTime = document.querySelector<HTMLInputElement>('#endTime');
const tbody = document.querySelector<HTMLTableElement>('tbody')
const pageNum = document.querySelector<HTMLDivElement>('#pageNum')
let list:[] = [];

startTime.addEventListener('input', () => {
    search()
})
endTime.addEventListener('input', () => {
    search()
})

const search = async() => {
    if(startTime.value != '' && endTime.value != '') {
        if (endTime.value < startTime.value) {
            alert('기간이 올바르지 않습니다.')
            startTime.value = ''
            endTime.value = ''
        } else {
            // const query = { 'date': { '$gte': startTime.value, '$lte': endTime.value } }
            const query = { 'date': { '$gte': {$regex:/./}, '$lte': endTime.value } }
            const result = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(query)
            });
            
            const data = await result.text()
            list = await JSON.parse(data)
            page = 1
            await render(0)
        }
    }
}

const render = (pageEdit:number) => {
    tbody.innerHTML = ''
    page += pageEdit
    pageNum.innerHTML = String(page)
    if(page == 1) {
        pageButton[0].disabled = true
    } else {
        pageButton[0].disabled = false;
    }
    for(let i = 10 * (page - 1); i < 10 * page; i++) {
        let x:visitList = list[i]
        if(x == null) {
            break
        }
        let fullDate = new Date(x.date)
        let tr = document.createElement('tr')
        let nameTd = document.createElement('td')
        let DateTd = document.createElement('td')
        // DateTd.style.width = '60%'
        let tempTd = document.createElement('td')
        nameTd.innerHTML = x.name
        DateTd.innerHTML = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()} ${fullDate.getHours()}:${fullDate.getMinutes()}:${fullDate.getSeconds()}`
        tempTd.innerHTML = String(x.temp)
        tr.append(nameTd)
        tr.append(DateTd)
        tr.append(tempTd)
        tbody.append(tr)
    }
}