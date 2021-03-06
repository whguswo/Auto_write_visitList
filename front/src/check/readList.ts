import "./readList.css";

const startTime = document.querySelector<HTMLInputElement>('#startTime');
const endTime = document.querySelector<HTMLInputElement>('#endTime');
const nameInput = document.querySelector<HTMLInputElement>('#name')
const startTemp = document.querySelector<HTMLInputElement>('#startTemp')
const endTemp = document.querySelector<HTMLInputElement>('#endTemp')
const tbody = document.querySelector<HTMLTableElement>('tbody')
const pageNum = document.querySelector<HTMLDivElement>('#pageNum')
const searchBtn = document.querySelector<HTMLButtonElement>('#searchBtn')
const logoutBtn = document.querySelector<HTMLButtonElement>('#logoutBtn')
const pageButton = document.querySelectorAll<HTMLButtonElement>('.pageButton')
const csvButton = document.querySelector<HTMLButtonElement>('#csvBtn')
const numberSelect = document.querySelector<HTMLSelectElement>('#number-select')

let page = 1
let sortNum = 7
let list: [] = [];

interface visitList {
    _id: string,
    name: string,
    date: string,
    temp: number
}

pageButton[0].addEventListener('click', (e) => {
    render(-1, sortNum)
})
pageButton[1].addEventListener('click', (e) => {
    render(1, sortNum)
})

searchBtn.addEventListener('click', () => {
    search()
})

numberSelect.addEventListener('change', (e) => {
    let sort = e.target as HTMLOptionElement
    sortNum = Number(sort.value)
    if (list.length != 0) {
        page = 1
        render(0, sortNum)
    }
})

logoutBtn.addEventListener('click', async () => {
    window.history.back()
})

const search = async () => {
    let query = { 'date': { '$gte': startTime.value, '$lte': endTime.value }, 'name': nameInput.value, 'temp': { '$gte': startTemp.value, '$lte': endTemp.value } }

    const result = await fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    });

    const data = await result.text()
    if (data == 'noResult') {
        tbody.innerHTML = ''
        const td = document.createElement('td')
        td.colSpan = 3
        td.innerHTML = '???????????? ??????'
        tbody.append(td)
    } else {
        list = await JSON.parse(data)
        page = 1
        await render(0, sortNum)
    }
}

const render = (pageEdit: number, sort: number) => {
    tbody.innerHTML = ''
    page += pageEdit
    pageNum.innerHTML = String(page)
    if (page == 1) {
        pageButton[0].disabled = true
    } else {
        pageButton[0].disabled = false;
    }
    for (let i = sort * (page - 1); i < sort * page; i++) {
        let x: visitList = list[i]
        if (x == null) {
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

    if (!list[page * sort + 1]) {
        pageButton[1].disabled = true
    } else {
        pageButton[1].disabled = false
    }
}

csvButton.addEventListener('click', async (e) => {
    let arr = []
    for (let i = 0; i < list.length; i++) {
        let data: visitList = list[i]
        delete data._id
        let fullDate = new Date(data.date)
        data.date = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()} ${fullDate.getHours()}:${fullDate.getMinutes()}:${fullDate.getSeconds()}`
        arr.push(data)
    }
    const result = await fetch('/csv', {
        method: 'POST',
        body: JSON.stringify(arr),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const temp = await result.blob();
    const url = URL.createObjectURL(temp);
    let a = document.createElement('a');
    a.download = '?????????.csv';
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
})