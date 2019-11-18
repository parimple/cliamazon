const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

//configuring the AWS environment

AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
bucketaws = 'lcloud-427-ag';



AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});

var s3 = new AWS.S3();
var filePath = "./data/file.txt";

//configuring parameters
var params = {
    Bucket: bucketaws,
    Body : fs.createReadStream(filePath),
    Key : "folder/"+Date.now()+"_"+path.basename(filePath)
};

var myArgs = process.argv.slice(2);

console.log('args: ', myArgs);

    switch (myArgs[0]) {
        case "push":
            if (myArgs[1]) {
                var params = {
                    Bucket: bucketaws,
                    Body : fs.createReadStream(myArgs[1]),
                    Key : "folder/"+Date.now()+"_"+path.basename(myArgs[1])
                };
                s3.upload(params, function (err, data) {
                    //handle error
                    if (err) {
                        console.log("Error", err);
                    }

                    //success
                    if (data) {
                        console.log("Uploaded in:", data.Location);
                    }
                });
            }

            break;

        case "ls":
            async function listAllObjectsFromS3Bucket(bucket, prefix) {
                let isTruncated = true;
                let marker;
                while(isTruncated) {
                    let params = { Bucket: bucket };
                    if (marker) params.Marker = marker;
                    try {
                        const response = await s3.listObjects(params).promise();
                        response.Contents.forEach(item => {
                            console.log(item.Key);
                        });
                        isTruncated = response.IsTruncated;
                        if (isTruncated) {
                            marker = response.Contents.slice(-1)[0].Key;
                        }
                    } catch(error) {
                        throw error;
                    }
                }
            }

            listAllObjectsFromS3Bucket(bucketaws);

            break;

        case "head":
            commandLibrary.head(userInputArray.slice(1));
            break;

        case "tail":
            commandLibrary.tail(userInputArray.slice(1));

        default:
            process.stdout.write('Typed command is not accurate');
    }


const listDirectories = params => {
    return new Promise ((resolve, reject) => {
        const s3params = {
            Bucket: 'bucket-name',
            MaxKeys: 20,
            Delimiter: '/',
        };
        s3.listObjectsV2 (s3params, (err, data) => {
            if (err) {
                reject (err);
            }
            resolve (data);
        });
    });
};