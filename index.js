const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const Regex = require("regex");

//configuring the AWS environment


bucketaws = 'lcloud-427-ag';

AWS_ACCESS_KEY_ID='AKIAS464CIUFY3NKMV5H';
AWS_SECRET_ACCESS_KEY='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';

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
            async function listAllObjectsFromS3Bucket(bucket) {
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

        case "lsregex":
            async function listRegexObjectsFromS3Bucket(bucket, regext) {
                const regex = new Regex(regext);
                let isTruncated = true;
                let marker;
                while(isTruncated) {
                    let params = { Bucket: bucket };
                    if (marker) params.Marker = marker;
                    try {
                        const response = await s3.listObjects(params).promise();
                        response.Contents.forEach(item => {

                            if (regex.test(item.Key)) {
                                console.log(item.Key);
                            }

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
            listRegexObjectsFromS3Bucket(bucketaws, myArgs[1]);

            break;

        case "rmregex":

            async function listRmregexObjectsFromS3Bucket(bucket, regext) {
                const regex = new Regex(regext);
                let isTruncated = true;
                let marker;
                while(isTruncated) {
                    let params = { Bucket: bucket };
                    if (marker) params.Marker = marker;
                    try {
                        const response = await s3.listObjects(params).promise();
                        response.Contents.forEach(item => {

                            if (regex.test(item.Key)) {
                                console.log('deleted file: ', item.Key);
                                var params = {  Bucket: bucketaws, Key: item.Key };
                                s3.deleteObject(params, function(err, data) {
                                    if (err) console.log(err, err.stack);  // error
                                    else     console.log();                 // deleted
                                });

                            }

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
            listRmregexObjectsFromS3Bucket(bucketaws, myArgs[1]);
            break;

        default:
            process.stdout.write('Typed command is not accurate');
    }


