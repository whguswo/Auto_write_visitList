import express, { Request } from 'express'
import https from 'https'
import path from 'path';
import * as dotenv from 'dotenv';
import qrcode from 'qrcode';
import queryString from 'querystring'
import { exec } from 'child_process';
import fs from 'fs/promises';
import { readFileSync } from 'fs'
import cookies from 'cookie-parser';
import crypto from 'crypto';
import { PythonShell, Options } from 'python-shell';
import AWS from 'aws-sdk';
const app = express();
const PORT = 3000;
const salt = 'whguswo'
const hash = crypto.createHash('sha1').update(`admin${salt}pass`).digest('base64');
const tempOption:Options = {
    mode: "json",
}

//AWS, DB

import { uploadFile, uploadFileAsBuffer, removeFile, getList, awsRekog } from './module'
import { search, writeList, addUser, findHash } from './connectDB';
import { UserQuery, UserNet } from './type';
const bucket = 'whguswo-bucket'
const photo_source = 'source.jpg'
const photo_target = '조현재.jpg'
app.use(express.text());
app.use(express.json());
app.use(express.raw({ limit: '50mb' }));
app.use(cookies());

app.use('/front/dist/check', (req, res, next) => {
    if (req.cookies.id == hash) {
        next();
    } else {
        res.redirect('/front/dist/login.html');
    }
})
app.use('/front', express.static(path.resolve(__dirname, '../../front')));

const option = {
    key: readFileSync('./openssl/key.pem'),
    cert: readFileSync('./openssl/cert.pem'),
    passphrase: 'whguswo',
    agent: false
};

app.get('/', (req, res) => {
    res.redirect('/front/dist/index.html')
})
app.get('/visit', (req, res) => {
    res.redirect('/front/dist/visit.html')
})

app.get('/admin', (req, res) => {
    res.redirect('/front/dist/check/admin.html');
})
app.get('/adduser', (req, res) => {
    res.redirect('/front/dist/addUser.html');
})

app.post('/adduser', async (req, res) => {
    const client = new AWS.Rekognition();
    const fileName = 'sample.jpg'
    const source = req.body as Buffer;

    
    const result = await awsRekog(client, fileName, source)
    .then ( async() => {
        let param = req.query as unknown as UserNet;
        //차례로 이름, 주소, 전화번호
        let qrHash = crypto.createHash('sha256').update(`${param.name}${param.phone}`).digest('base64')
        await addUser({ ...param, hash: qrHash })
        console.log(param.type)
        await uploadFileAsBuffer(req.body as Buffer, param.name, param.type.replace('image/', ''))
        console.log('유저 등록 완료')
        res.end('유저 등록 완료')
    }).catch(() => {
        res.end('noPerson')
    });  
})

app.post('/search', (req, res) => {
    search(req.body, res)
})

app.post('/blob', async (req, res) => {
    const client = new AWS.Rekognition();
    const list = await getList(bucket)
    const source = req.body as Buffer;

    const arr = []
    try {
        for await (let fileName of list) {
            const result = await awsRekog(client, fileName, source)
            if (result) {
                arr.push(result)
            }
        }
        if (arr.length) {
            res.json(arr);
        } else {
            res.json(['noIden'])
        }
    } catch {
        res.json(['noPerson']);
    }

})
app.post('/writeList', async (req, res) => {
    writeList(req.body.visit[0], req.body.visit[1], req.body.visit[2])
    res.end('방명록 작성완료')
})

app.get('/test', (req, res) => {
    res.sendFile('test.html', {
        root: '../front/src'
    })
})
app.get('/login', (req, res) => {
    if(req.cookies.id == hash) {
        res.redirect('/front/dist/check/admin.html')
    } else {
        res.redirect('/front/dist/login.html')
    }
    // res.redirect('/front/dist/login.html')
})
app.post('/login', (req, res) => {
    if (req.body.id == 'admin' && req.body.pass == 'pass') {
        res.cookie('id', hash, { maxAge: 100000000 })
        res.end('admin')
    } else {
        res.end('noEx')
    }
})
app.get('/logout', (req, res) => {
    res.cookie('id', '')
    res.end('end')
})

app.get('/code', (req, res) => {
    res.redirect('/front/dist/code.html')
})
app.get('/scan', (req, res) => {
    res.redirect('/front/dist/scan.html')
})
app.post('/qrHash', (req, res) => {
    res.end(crypto.createHash('sha256').update(req.body).digest('base64'))
})
app.post('/qrCompare', (req, res) => {
    let flag = false
    let highest_temp = 0
    PythonShell.run(path.resolve(__dirname, '..', 'temperature.py'), tempOption, (err, result) => {
        const arr = result[0].result;
        for(let i = 0; i < 8; i++) {
            for(let j = 0; j < 8; j++) {
                if(parseFloat(arr[i][j] + 7) > 38) {
                    flag = true
                }
                if(parseFloat(arr[i][j] + 7) > highest_temp) {
                    highest_temp = parseFloat(arr[i][j] + 7)
                }
            }
        }
        if(flag) {
            res.end('bad')
        } else {
            findHash(req.body.result[0], req.body.result[1], String(highest_temp), res)
        }
    })
})

app.get('/scan', (req, res) => {
    res.sendFile('scan.html', {
        root: '../front/src'
    })
})

app.get('/temp', (req, res) => {
    res.redirect('/front/dist/tempTest.html')
})

app.post('/temp', async(req, res) => {
    let flag = false
    let highest_temp = 0
    PythonShell.run(path.resolve(__dirname, '..', 'temperature.py'), tempOption, (err, result) => {
        const arr = result[0].result;
        for(let i = 0; i < 8; i++) {
            for(let j = 0; j < 8; j++) {
                if(parseFloat(arr[i][j] + 7) > 38) {
                    flag = true
                }
                if(parseFloat(arr[i][j] + 7) > highest_temp) {
                    highest_temp = parseFloat(arr[i][j] + 7)
                }
            }
        }
        if(flag) {
            res.end('bad')
        } else {
            res.end(String(highest_temp))
            console.log(highest_temp)
        }
    })
})

https.createServer(option, app).listen(PORT, () => {
    console.log(`[HTTPS] Server is started on port ${PORT}`)
});