# File Upload

## AWS Dependency

::: warning
This feature is currently **only available with AWS**.
:::
::: warning
This feature is only supported by the GraphQL-API, not the REST-API.
:::

You need to provide the following environment variable.

```bash
# Optional
AWS_S3_ENDPOINT # To set the S3 endpoint to something else then the default

# Required
AWS_BUCKET_NAME # The bucket name where the files should be uploaded

# Required (Auth: Alternative 1 - auto)
AWS_CONTAINER_CREDENTIALS_RELATIVE_URI # Automatically populated by ECS

# Required (Auth: Alternative 2 - manual)
COGNITO_ADMIN_USER # Username with permissions to write & read from S3
COGNITO_ADMIN_PW # Password for admin user
COGNITO_USER_POOL_ID # Cognito User Pool ID
COGNITO_CLIENT_ID_ADMIN # Cognito User Pool Client ID
COGNITO_REGION # Region of Cognito instance
COGNITO_IDENTITY_POOL_ID # Cognito Identity Pool ID
```

## Usage
### Upload
To upload a file together with your Whisp, you can use the attachment field.
In order to upload a new File, pass:
```json
{
    "attachments":[{
        "path": "<Information about where you need the file to be used inside the whisp>",
        "file":{
            "newFile": "<binary>"
        }
    }]
}
```
The binary inside of **"newFile"** will be uploaded to the S3-Bucket. The created S3-Key will be set as content of **"file"**.

When you pass the attachment property during an update, it will replace the old content. In order to keep previous uploaded files, you have to pass them along with new files like so:
```json
{
    "attachments":[{
        "path": "<Information about where you need the file to be used inside the whisp>",
        "file":{
            "oldFile": "<S3-Key-of-old-file>"
        }
    },
    {
        "path": "<Information about where you need the file to be used inside the whisp>",
        "file":{
            "newFile": "<binary>"
        }
    }]
}
```
### Download
When you query your attachments the result will look like this:
```json
{
    "attachments":[{
        "path": "<Information about where you need the file to be used inside the whisp>",
        "file": "<S3-Key>"
    }]
}
```

To get the Binary of your file, send a **GET**-Request to `<whispr-url>/file/<S3-Key>`.