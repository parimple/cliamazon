- List all files in an S3 Bucket

`node index.js ls
`

- Upload a local file to a defined location in the bucket

`node index.js push ./data/file.txt
`
- List an AWS buckets files that match a "filter" regex

`node index.js lsregex folder/1574065792603_file.txt
`

- Delete all files matching a regex from a bucket

`node index.js rmregex folder/1574065954705_file.txt
`
