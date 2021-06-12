import express from 'express'
import https from 'https'
import queryString from 'querystring'
import { exec } from 'child_process';
import fs from 'fs/promises';
import { readFileSync } from 'fs'
import cookies from 'cookie-parser';
import crypto from 'crypto';
import { PythonShell } from 'python-shell';
import AWS from 'aws-sdk';
const app = express();
const PORT = 3000;
const salt = 'whguswo'
const hash = crypto.createHash('sha1').update(`admin${salt}pass`).digest('base64');

//AWS, DB

import { uploadFile, uploadFileAsBuffer, removeFile, getList, awsRekog } from './module'
import { search, writeList, addUser, findHash } from './connectDB';
import { UserQuery, UserNet } from './type';
import 'dotenv/config'
const bucket = 'whguswo-bucket'
const photo_source = 'source.jpg'
const photo_target = '조현재.jpg'

app.use(express.static('view'));
app.use(express.static('/'));
app.use(express.text());
app.use(express.json());
app.use(express.raw({ limit: '50mb' }));
app.use(cookies());



const option = {
    key: readFileSync('./openssl/key.pem'),
    cert: readFileSync('./openssl/cert.pem'),
    passphrase: 'whguswo',
    agent: false
};

//온도부분!!! 테스트중
// let tempOption = {
//     mode: 'json',
// }
// PythonShell.run('temperature.py', tempOption, (err, result) => {
//     // console.log(`result : ${result[0]}`)

//     let arr = result[0].result
//     for(let i of arr) {
//         for(let j of i) {
//             if(j > 40) {
//                 console.log('비정상!')
//             }
//         }
//     }
// })

// uploadFile('source.jpg') 업로드
// removeFile('source.jpg') 삭제
// getList(bucket) 목록

app.get('/', (req, res) => {
    res.sendFile('index.html', {
        root: './view'
    })
})
app.get('/visit', (req, res) => {
    res.sendFile('visit.html', {
        root: './view'
    })
})

// app.get('/list', async(req, res) => {
// exec(`fswebcam -r 1280x720 --no-banner source.jpg`, async(err, stdout, stderr) => {
//     const client = new AWS.Rekognition();
//     let list = await getList(bucket)
//     await uploadFile('source.jpg')

//     let arr = []
//     for await (let fileName of list) {
//         const result = await awsRekog(client, fileName)
//         if(result) {
//             arr.push(result)
//             console.log(arr)
//         }
//     }

//     await removeFile('source.jpg')
// })

// })
// // app.get('/compare', async (req, res) => {
//     exec(`fswebcam -r 1280x720 --no-banner source.jpg`, async(err, stdout, stderr) => {
//         const client = new AWS.Rekognition();
// const params = {
//     SourceImage: {
//         S3Object: {
//             Bucket: bucket,
//             Name: photo_source
//         },
//     },
//     TargetImage: {
//         S3Object: {
//             Bucket: bucket,
//             Name: photo_target
//         },
//     },
//     SimilarityThreshold: 80
// };

//         const data = await uploadFile('source.jpg')
//         client.compareFaces(params, async (err, response) => {
//             if(!response) {
//                 res.end('사람이 없습니다.')
//                 await removeFile('source.jpg')
//                 return true
//             } else if(response.FaceMatches.length === 0) {
//                 res.end('등록된 사용자가 없습니다.')
//             }
//             response.FaceMatches.forEach(data => {
//                 if (data) {
//                     let position = data.Face.BoundingBox
//                     let similarity = data.Similarity
//                     // console.log(`The face at: ${position.Left}, ${position.Top} matches with ${similarity} % confidence`)
//                     console.log('인식 완료!')
//                     res.end(`The face at: ${position.Left}, ${position.Top} matches with ${similarity} % confidence`)
//                 }
//             })
//             await removeFile('source.jpg')
//         });
//     });
// })

app.get('/noUpload', async (req, res) => {
    exec(`fswebcam -r 1280x720 --no-banner source.jpg`, async (err, stdout, stderr) => {
        const client = new AWS.Rekognition();
        let list = await getList(bucket)
        const source = await fs.readFile('./source.jpg');

        let arr = []
        for await (let fileName of list) {
            const result = await awsRekog(client, fileName, source)
            if (result) {
                arr.push(result)
                console.log(arr)
            }
        }
    })

    // const source = await fs.readFile('./source.jpg');
    // const params = {
    //     SourceImage: {
    //       Bytes: source
    //     },
    //     TargetImage: {
    //         S3Object: {
    //             Bucket: bucket,
    //             Name: '조현재.jpg'
    //         },
    //     },
    //     SimilarityThreshold: 80
    // };
    // client.compareFaces(params, async (err, response) => {
    //     response.FaceMatches.forEach(data => {
    //         if (data) {
    //             let position = data.Face.BoundingBox
    //             let similarity = data.Similarity
    //             // console.log(`The face at: ${position.Left}, ${position.Top} matches with ${similarity} % confidence`)
    //             res.end(`The face at: ${position.Left}, ${position.Top} matches with ${similarity} % confidence`)
    //         }
    //     })
    // });
})

app.get('/admin', (req, res) => {  
    if(req.cookies.id == hash) {
        res.sendFile('admin.html', {
            root: './view'
        })
    } else {
        res.redirect('/login')
    }
})
app.get('/adduser', (req, res) => {
    res.sendFile('addUser.html', {
        root: './view'
    })
})

// 유저등록 구현할 부분
app.post('/adduser', (req, res) => {
    let param = req.query as unknown as UserNet;
    //차례로 이름, 주소, 전화번호
    let qrHash = crypto.createHash('sha256').update(`${param.name}${param.phone}`).digest('base64')
    addUser({ ...param, hash:qrHash })
    console.log(param.type)
    uploadFileAsBuffer(req.body as Buffer, param.name, param.type.replace('image/', ''))
    console.log('유저 등록 완료')
    res.end('유저 등록 완료')
})

app.post('/search', (req, res) => {
    search(req.body, res)
})

app.post('/blob', async (req, res) => {
    const client = new AWS.Rekognition();
    let list = await getList(bucket)
    const source = req.body as Buffer;

    let arr = []
    try{
        for await (let fileName of list) {
            const result = await awsRekog(client, fileName, source)
            if (result) {
                arr.push(result)
                res.json(arr)
            }
        }
        if(!arr[0]) {
            res.json(['noIden'])
        }
    } catch {
        res.json(['noPerson'])
    }
    
})
app.post('/writeList', async (req, res) => {
    writeList(req.body.visit[0], req.body.visit[1])
})

app.get('/test', (req, res) => {
    res.sendFile('test.html', {
        root: './view'
    })
})
app.get('/login', (req, res) => {
    if(req.cookies.id == hash) {
        res.redirect('/admin')
    } else {
        res.sendFile('login.html', {
            root: './view'
        })
    }
})
app.post('/login', (req, res) => {
    if(req.body.id == 'admin' && req.body.pass == 'pass') {
        res.cookie('id', hash)
        res.end('admin')
    } else {
        res.end('noEx')
    }
    
})

app.get('/code', (req, res) => {
    res.sendFile('code.html', {
        root: './view'
    })
})
app.post('/qrHash', (req, res) => {
    res.end(crypto.createHash('sha256').update(req.body).digest('base64'))
})
app.post('/qrCompare', (req, res) => {
    findHash(req.body, res)
})

app.get('/scan', (req, res) => {
    res.sendFile('scan.html', {
        root: './view'
    })
})

https.createServer(option, app).listen(PORT, () => {
    console.log(`[HTTPS] Server is started on port ${PORT}`)
});