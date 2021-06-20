import { init } from './nav';
import "./nav.css";
import "./addUser.css";
init();


const photo = document.querySelector<HTMLDivElement>('#photo')
const fileInput = document.querySelector<HTMLInputElement>('#fileInput')
const userName = document.querySelector<HTMLInputElement>('#name');
const address = document.querySelector<HTMLInputElement>('#address')
const phone = document.querySelector<HTMLInputElement>('#phone')
const submit = document.querySelector<HTMLButtonElement>('#submit')
const reader = new FileReader();

let file:File = null

submit.addEventListener('click', async (e) => {
    if (userName.value && address.value && phone.value && photo.style.backgroundImage) {
        console.log(file)
        const result = await fetch(`https://192.168.0.91:3000/addUser?name=${userName.value}&address=${address.value}&phone=${phone.value}&type=${file.type}`, {
            method: 'POST',
            body: file,
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });
        let data = await result.text()
        alert(data)
    } else {
        alert('정보를 모두 입력해주세요')
    }
    
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
    if(file){
        const url = URL.createObjectURL(file);
        photo.style.backgroundImage = `url(${url})`;
        // URL.revokeObjectURL(url)
    }
}