# AWS Video uploading
## Description
This repo is designed for creating a AWS resource stack that can be used for video uploading and transcoding. The stack contains following resources :
|Resource|Description|
|--------|-----------|
|AWS elastic transcoder preset|A new presset for optimal video conversion|
|AWS elastic transcoder pipeline|A pipeline for running transcoder jobs with the new preset
|AWS API gateway|API Gateway for requesting URL for uloading the original video. The URL is a S3 signed URL and is to be used with the [S3 REST API](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
|Lambda functions|Lambda functions for generating S3 signed url, starting elastic transcoder jobs and notification about job completion
|Policies and roles|Policies and roles needed for running the stack 
The process of uploading and transcoding is as follow :
1. User requests an AWS S3 signed url 
2. User uploads original video to the url via [S3 REST API](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
3. After upload finishes a elastic transcoder job is created
4. After job is completed a request is made to the API configured with API_DOMAIN parameter

## Prerequisites
1. [AWS cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html "Howto install aws cli")
2. [jq](https://stedolan.github.io/jq/download/ "Howto install jq")
## Configuration
All configuration should be done in the [console/prepare](console/prepare) script.

| Variable        | Description           |
| ------------- |-------------|
|REGION|region for the stack deployment. SHOULD BE SAME AS THE  DEFAULT REGION OF THE DEPLOYMENT ACCOUNT
|CUSTOMER_ID|your AWS customer ID
|BUCKET_NAME_TO_UPLOAD|bucket for uploading videos 
|BUCKET_NAME_FOR_VIDEOS|bucket where the transcoded videos will be stored to
|TRANSCODER_PRESSET_NAME|new presset name for the transcoder pipeline
|VIDEO_UPLOADING_POLICY_NAME|name for policy to be used for access to buckets
|TRANSCODER_ROLE_NAME|name for transcoder jobs role
|TRANSCODER_PIPELINE_NAME|new pipeline name
|LAMBDA_ROLE_NAME|role name for the new lambdas
|LAMBDA_LOGGING_POLICY_NAME|policy name for lambdas logging functionality
|LAMBDA_GET_UPLOAD_URL_NAME|name of the lambda for generating signed urls
|LAMBDA_START_TRANSCODING_NAME|name of the lambda for starting transcoding jobs
|LAMBDA_NOTIFICATION_NAME|name of the lambda for notification about job completion
|AUTH_DOMAIN|authentification domain
|API_NAME|notification target domain
## Scripts
|Sctipt|Description|
|------|-----------|
|[console/prepare](console/prepare)|Script for generating all necessary scripts
|console/create_stack| Is used to deploy the solution to the account configured as default in the aws cli. Will be generated with the [console/prepare](console/prepare) script. 
|console/create_stack| Is used to remove the solution from the account configured as default in the aws cli. Will be generated with the [console/prepare](console/prepare) script. 
|console/clear_templates| Is used to clear all files generated with the [console/prepare](console/prepare) script. 
