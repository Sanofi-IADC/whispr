#!/bin/bash
# set -x
awslocal s3 mb s3://demo-bucket/
awslocal s3api put-bucket-acl --bucket demo-bucket --acl public-read
# set +x