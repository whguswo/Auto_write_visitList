import { Request, Response } from 'express'
import { MongoClient, Collection } from 'mongodb';
import { Query, UserQuery } from './type';
const client = new MongoClient('mongodb+srv://whguswo:whguswo@whguswo.ggu4w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useUnifiedTopology: true });

const dbMap = new Map<string, Collection<any>>();
(async()=>{
    await client.connect();
    const db = client.db('whguswodb');
    dbMap.set('visit-list', db.collection('visit-list'));
    dbMap.set('user-list', db.collection('user-list'));
    console.log('Connected Complete!!!')
})();
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

const search = async (query:Query, res:Response) => {
    query.date['$gte'] = new Date(query.date['$gte']);
    query.date['$lte'] = new Date(query.date['$lte']);
    const arr = await dbMap.get('visit-list').find(query).toArray();
    if(arr.length == 0) {
        console.log('검색결과 없음')
    }
    res.json(arr);
};

const writeList = async(name:string, date:string) => {
    await dbMap.get('visit-list').insertOne({
        "name": name,
        "date": new Date(date),
        "temp": 36.5,
    })
    console.log('uploaded')
};

const addUser = (obj:UserQuery) => {
    return dbMap.get('user-list').insertOne(obj);
};

const findHash = async(hash:string, time:string, res:Response) => {
    const arr = await dbMap.get('user-list').find({ "hash": hash}).toArray();
    if(arr.length == 0) {
        console.log('등록되지않은 사용자입니다.')
        res.end('noUser')
    } else {
        writeList(arr[0].name, time)
        res.end('complete')
    }
    
    // console.log(` == Find ${hash} ==`)
    // console.log(arr)
}

export { search, writeList, addUser, findHash };