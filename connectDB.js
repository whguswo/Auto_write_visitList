const express = require('express')
const { MongoClient } = require('mongodb')

const client = new MongoClient('DB url', { useUnifiedTopology: true });
let visitList = null;
let userList = null
client.connect((err) => {
    const db = client.db('whguswodb')
    visitList = db.collection('visit-list');
    userList = db.collection('user-list')
    console.log('Connected Complete!!!')
});

// client.connect(async (err) => {
//     if(err) {
//         console.error(err)
//     }
//     console.log('Connected Complete!!!')
//     const db = client.db('whguswodb')
//     const collection = db.collection('visit-list')
//     // const arr = await collection.find({}).toArray()
//     // console.log(arr)

// collection.find({ "name": "조현재", "date": "2021818"}).toArray((err, data) => {
//     console.log(' == Find 조현재')
//     for(let i = 0; i < data.length; i++) {
//         console.log(data[i].temp)
//     }
// })

//     //업로드
//     // collection.insertOne({
//     //     "name": '조현재',
//     //     "date": '2021818',
//     //     "hour": '13',
//     //     "temp": '36.5',
//     // })
// })

const search = async (query, res) => {
    query.date['$gte'] = new Date(query.date['$gte']);
    query.date['$lte'] = new Date(query.date['$lte']);
    const arr = await visitList.find(query).toArray();
    res.json(arr)
    console.log(` == Find ${query.date['$gte']} ~ ${query.date['$lte']}`)
    console.log(arr)
}
const writeList = (name, date) => {
    visitList.insertOne({
        "name": name,
        "date": new Date(date),
        "temp": 36.5,
    })
    console.log('uploaded')
}
const addUser = (name, address, phone, hash) => {
    userList.insertOne({
        "name": name,
        "address": address,
        "phone": phone,
        "qrHash": hash
    });
}

const findHash = async(hash, res) => {
    const arr = await userList.find({ "qrHash": hash}).toArray();
    if(arr.length == 0) {
        console.log('등록되지않은 사용자입니다.')
        res.end('noUser')
    } else {
        res.end(arr[0].name)
    }
    
    // console.log(` == Find ${hash} ==`)
    // console.log(arr)
}

module.exports = { search, writeList, addUser, findHash }