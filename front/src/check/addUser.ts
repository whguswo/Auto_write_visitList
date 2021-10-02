import "./adduser.css";

const photo = document.querySelector<HTMLDivElement>('#photo')
const fileInput = document.querySelector<HTMLInputElement>('#fileInput')
const userName = document.querySelector<HTMLInputElement>('#name');
const address = document.querySelector<HTMLInputElement>('#address')
const phone = document.querySelector<HTMLInputElement>('#phone')
const submit = document.querySelector<HTMLButtonElement>('#submit')
const reader = new FileReader();

let file: File = null

submit.addEventListener('click', async (e) => {
    submit.disabled = true
    submit.style.backgroundColor = 'gray'
    if (userName.value && address.value && phone.value && photo.style.backgroundImage) {
        console.log(file)
        const result = await fetch(`/addUser?name=${userName.value}&address=${address.value}&phone=${phone.value}&type=${file.type}`, {
            method: 'POST',
            body: file,
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });
        let data = await result.text()
        if (data == 'noPerson') {
            alert('사진에 사람이없습니다. 자신이 나온 사진을 업로드해주세요.')
        } else {
            alert(data)
            location.reload()
        }

    } else {
        alert('정보를 모두 입력해주세요')
    }
    submit.disabled = false
    submit.style.backgroundColor = 'rgb(40, 40, 253)'
})

fileInput.addEventListener('change', (e) => {
    readURL()
})
// function readURL(){
// let file = fileInput.files[0];
// let reader = new FileReader();
//     if(file){
//         reader.readAsDataURL(file);
//     }
// reader.onloadend = () => {
//     photo.style.backgroundImage = "url(" + reader.result + ")";
//     console.log(reader.result)
// }   
// }
const readURL = () => {
    file = fileInput.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        photo.style.backgroundImage = `url(${url})`;
    }
}