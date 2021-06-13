import { init } from './nav';
init();

const pageButton = document.querySelectorAll<HTMLButtonElement>('.pageButton')

pageButton[0].addEventListener('click', (e) => {
    search(-1)
})
pageButton[1].addEventListener('click', (e) => {
    search(1)
})

let page = 1
const startTime = document.querySelector<HTMLInputElement>('#startTime');
const endTime = document.querySelector<HTMLInputElement>('#endTime');
const tbody = document.querySelector<HTMLTableElement>('tbody')
const pageNum = document.querySelector<HTMLDivElement>('#pageNum')
let arr = [];

const search = async(pageEdit:number) => {
    if(startTime.value != '' && endTime.value != '') {
        if (endTime.value < startTime.value) {
            alert('기간이 올바르지 않습니다.')
            startTime.value = ''
            endTime.value = ''
        } else {
            page += pageEdit  
            pageNum.innerHTML = String(page)
            tbody.innerHTML = ''
            if(page == 1) {
                pageButton[0].disabled = true
            } else {
                pageButton[0].disabled = false;
            }
            const query = { 'date': { '$gte': startTime.value, '$lte': endTime.value } }
            const result = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(query)
            });
            const data = await result.text()
            const res = await JSON.parse(data)
            for(let i = 7 * (page - 1); i < 7 * page; i++) {
                let x = res[i]
                if(x == null) {
                    break
                }
                let fullDate = new Date(x.date)
                let tr = document.createElement('tr')
                let nameTd = document.createElement('td')
                let DateTd = document.createElement('td')
                let tempTd = document.createElement('td')
                nameTd.innerHTML = x.name
                DateTd.innerHTML = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()} ${fullDate.getHours()}:${fullDate.getMinutes()}:${fullDate.getSeconds()}`
                tempTd.innerHTML = x.temp
                tr.append(nameTd)
                tr.append(DateTd)
                tr.append(tempTd)
                tbody.append(tr)
            }
        }
        
    }
}