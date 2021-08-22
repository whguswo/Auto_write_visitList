import { Request, Response } from 'express'
import { MongoClient, Collection } from 'mongodb';
import { Query, UserQuery } from './type';
import * as dotenv from 'dotenv';
const client = new MongoClient(process.env.DBURL, { useUnifiedTopology: true });

const dbMap = new Map<string, Collection<any>>();
(async()=>{
    await client.connect();
    const db = client.db('whguswodb');
    dbMap.set('visit-list', db.collection('visit-list'));
    dbMap.set('user-list', db.collection('user-list'));
    console.log('Connected Complete!!!')
})();

const search = async (query:Query, res:Response) => {
    if(query.date['$gte'] != '') {
        query.date['$gte'] = new Date(query.date['$gte']);
    } else {
        delete query.date['$gte']
    }
    if(query.date['$lte'] != '') {
        query.date['$lte'] = new Date(query.date['$lte']);
    } else {
        if(query.date['$gte']) {
            delete query.date['$lte']
        } else {
            delete query.date
        }
    }
    if(query.name == '') {
        delete query.name
    }
    if(query.temp['$gte'] != '') {
        query.temp['$gte'] = Number(query.temp['$gte'])
    } else {
        delete query.temp['$gte']
    }
    if(query.temp['$lte'] != '') {
        query.temp['$lte'] = Number(query.temp['$lte'])
    } else {
        if(query.temp['$gte']) {
            delete query.temp['$lte']
        } else {
            delete query.temp
        }
    }
    
    const arr = await dbMap.get('visit-list').find(query).toArray();
    if(arr.length == 0) {
        console.log('검색결과 없음')
        res.send('noResult')
    } else {
        res.json(arr);
    }
};

const writeList = async(name:string, date:string, temp:string) => {
    console.log(temp)
    await dbMap.get('visit-list').insertOne({
        "name": name,
        "date": new Date(date),
        "temp":  parseFloat(temp),
    })
    console.log('uploaded')
};

const addUser = (obj:UserQuery) => {
    return dbMap.get('user-list').insertOne(obj);
};

const findHash = async(hash:string, time:string, temp:string, res:Response) => {
    const arr = await dbMap.get('user-list').find({ "hash": hash}).toArray();
    if(arr.length == 0) {
        console.log('등록되지않은 사용자입니다.')
        res.end('noUser')
    } else {
        writeList(arr[0].name, time, temp)
        res.end(JSON.stringify([arr[0].name, time, temp]))
    }
}

export { search, writeList, addUser, findHash };