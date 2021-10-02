const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: 'AKIA4TLUUGSFYF4555HO',
    secretAccessKey: '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',
    region: 'ap-northeast-2'
})

const s3 = new AWS.S3({
    apiVersion: '2006-03-01'
});

const removeFile = (fileName) => {

    const params = {
        Bucket: 'whguswo-bucket',
        Key: fileName,
    };

    s3.deleteObject(params, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log(`File removed successfully`);
        }
    });

    // return new Promise((res, rej) => {
    //     s3.deleteObject(params, (err, data) => {
    //         if (err) rej(err)
    //         console.log(`File removed successfully`);
    //         res('removed')
    //     });
    // })
};

removeFile('alt.png')