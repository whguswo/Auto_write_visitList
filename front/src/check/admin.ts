import "./admin.css";

const startTime = document.querySelector<HTMLInputElement>('#startTime');
const endTime = document.querySelector<HTMLInputElement>('#endTime');
const nameInput = document.querySelector<HTMLInputElement>('#name')
const tempInput = document.querySelector<HTMLInputElement>('#temp')
const tbody = document.querySelector<HTMLTableElement>('tbody')
const pageNum = document.querySelector<HTMLDivElement>('#pageNum')
const searchBtn = document.querySelector<HTMLButtonElement>('#searchBtn')
const logoutBtn = document.querySelector<HTMLButtonElement>('#logoutBtn')
const pageButton = document.querySelectorAll<HTMLButtonElement>('.pageButton')
let page = 1
let list:[] = [];

interface visitList {
    name:string,
    date:string,
    temp:number
}

pageButton[0].addEventListener('click', (e) => {
    render(-1)
})
pageButton[1].addEventListener('click', (e) => {
    render(1)
})

searchBtn.addEventListener('click', () => {
    search()
})

logoutBtn.addEventListener('click', () => {
    location.href = '/'
})

const search = async() => {
    let query = { 'date': {'$gte': startTime.value, '$lte': endTime.value } , 'name': nameInput.value, 'temp': tempInput.value }
    
    const result = await fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    });
    
    const data = await result.text()
    if(data == 'noResult') {
        tbody.innerHTML = ''
        const td = document.createElement('td')
        td.colSpan = 3
        td.innerHTML = '검색결과 없음'
        tbody.append(td)
    }
    list = await JSON.parse(data)
    page = 1
    await render(0)
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
    for(let i = 7 * (page - 1); i < 7 * page; i++) {
        let x:visitList = list[i]
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
        tempTd.innerHTML = String(x.temp)
        tr.append(nameTd)
        tr.append(DateTd)
        tr.append(tempTd)
        tbody.append(tr)
    }
}