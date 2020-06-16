# File Upload

## AWS Dependency

This feature is currently **only available with AWS**.

You need to provide the following environment variable.

```bash
AWS_S3_ENDPOINT # If you want to work with something else than AWS
AWS_BUCKET_NAME # The bucket name where the files should be uploaded

# Are we required ?
AWS_CONTAINER_CREDENTIALS_RELATIVE_URI # whoami

COGNITO_ADMIN_USER # whoami
COGNITO_ADMIN_PW # whoami
COGNITO_USER_POOL_ID # whoami
COGNITO_CLIENT_ID_ADMIN # whoami
COGNITO_REGION # whoami
COGNITO_IDENTITY_POOL_ID # whoami
```

## Usage

Add the files in the data of your whisp. They will be saved on the S3 with a key that matches your data architecture.