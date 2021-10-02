import './delUser.css'

const name = document.querySelector<HTMLInputElement>('#name')
const phone = document.querySelector<HTMLInputElement>('#phone')
const address = document.querySelector<HTMLInputElement>('#address')
const search = document.querySelector<HTMLButtonElement>('#search')
const face = document.querySelector<HTMLImageElement>('#face')
const deleteBtn = document.querySelector<HTMLButtonElement>('#deleteBtn')
const cancelBtn = document.querySelector<HTMLButtonElement>('#cancelBtn')

search.addEventListener('click', async () => {
    if (name.value == '' || phone.value == '' || address.value == '') {
        alert('정보를 모두 입력해주세요.')
    } else {
        const result = await fetch('/userSearch', {
            method: 'POST',
            body: JSON.stringify({
                name: name.value,
                phone: phone.value,
                address: address.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let data = await result.text()
        if (data == 'noResult') {
            alert('일치하는 정보가 없습니다.')
        } else {
            let img = JSON.parse(data)
            const toBase64 = (arr: []) => {
                return btoa(
                    arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
            }
            face.src = `data:image/jpg;base64,${toBase64(img.Body.data)}`
            name.disabled = true
            phone.disabled = true
            address.disabled = true
            // console.log(toBase64(img.Body.data))
        }
    }
})

deleteBtn.addEventListener('click', async (e) => {
    const result = await fetch('/delUser', {
        method: 'POST',
        body: JSON.stringify({
            name: name.value,
            phone: phone.value,
            address: address.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
})

cancelBtn.addEventListener('click', (e) => {
    name.disabled = false
    phone.disabled = false
    address.disabled = false
    name.value = ''
    phone.value = ''
    address.value = ''
    face.src = '../../src/check/img/alt.png'
})