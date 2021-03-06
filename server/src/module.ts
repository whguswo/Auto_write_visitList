import fs from 'fs';
import { resolve } from 'path';
import AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import path from 'path';
import { Request, Response } from 'express';
const bucket = 'whguswo-bucket';
const photo_source = 'source.jpg'
const pathing = path.resolve(__dirname, '..', 'src', '.env');
dotenv.config({ path: pathing })

AWS.config.update({
    accessKeyId: process.env.AK,
    secretAccessKey: process.env.SK,
    region: 'ap-northeast-2'
})

const s3 = new AWS.S3({
    apiVersion: '2006-03-01'
});
//업로드 함수
const uploadFile = (fileName: string) => {
    //fileContent는 Buffer
    const fileContent = fs.readFileSync(fileName);

    const params = {
        Bucket: bucket,
        Key: fileName,
        Body: fileContent
    };

    // s3.upload(params, (err, data) => {
    //     console.log(`File uploaded successfully. ${data.Location}`);
    // });
    // return s3.upload(params).promise().then((data)=>{
    //     console.log(data)
    //     return 'uploaded'
    // })
    return new Promise((res, rej) => {

        s3.upload(params, (err: AWS.AWSError, data: AWS.S3.ManagedUpload.SendData) => {
            if (err) rej(err)
            console.log(data)
            // console.log(`File uploaded successfully. ${data.Location}`)
            res('uploaded')
        });
    })

};

const uploadFileAsBuffer = (buf: Buffer, name: string, type: string) => {
    const params = {
        Bucket: bucket,
        Key: `${name}.${type}`,
        Body: buf,
    };
    console.log(buf)

    // s3.upload(params, (err, data) => {
    //     console.log(`File uploaded successfully. ${data.Location}`);
    // });

    return new Promise((res, rej) => {
        s3.upload(params, (err: AWS.AWSError, data: AWS.S3.ManagedUpload.SendData) => {
            if (err) rej(err)
            res('uploaded')
        });
    })

};

//삭제 함수
const removeFile = (fileName: string) => {

    const params = {
        Bucket: bucket,
        Key: fileName,
    };

    s3.deleteObject(params, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log(`File removed successfully`);
        }
//
    });

    // return new Promise((res, rej) => {
    //     s3.deleteObject(params, (err, data) => {
    //         if (err) rej(err)
    //         console.log(`File removed successfully`);
    //         res('removed')
    //     });
    // })
};


const getFile = (fileName: string, res: Response) => {
    const parms = {
        Bucket: bucket,
        Key: fileName,
    }

    s3.getObject(parms, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            // res.send(result.Body)
            res.send(result)
        }
    })
}

//목록 함수
const getList = (bucket: string) => {

    const bucketParams = {
        Bucket: bucket,
    };

    let list: string[] = [];

    return new Promise((res: (value: string[]) => void, rej) => {
        s3.listObjects(bucketParams, (err, data) => {
            for (let i = 0; i < data.Contents.length; i++) {
                list.push(data.Contents[i].Key)
            }
            res(list);
        });
    })
}

const awsRekog = (client: AWS.Rekognition, fileName: string, source: Buffer) => {
    return new Promise((resolve: (value: string) => void, reject: (value: string) => void) => {
        const params = {
            SourceImage: {
                Bytes: source
            },
            TargetImage: {
                S3Object: {
                    Bucket: bucket,
                    Name: fileName
                },
            },
            SimilarityThreshold: 80
        };

        client.compareFaces(params, async (err, response) => {
            if (!response) {
                console.log('사람이 없습니다.')
                reject('noPerson')
            } else if (response.FaceMatches.length === 0) {
                resolve('');
            } else {
                response.FaceMatches.forEach((data) => {
                    if (data) {
                        let userName = fileName.split('.')[0]
                        resolve(userName)
                    }
                })
            }
        });

    })
}

// removeFile('alt.png')

export { uploadFile, uploadFileAsBuffer, removeFile, getList, getFile, awsRekog }