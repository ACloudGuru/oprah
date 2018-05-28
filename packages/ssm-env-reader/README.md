# SSM Reader

Reads all environment variables with the prefix SSM and evaluates all SSM paths

Populates the lambda event with the SSM values.

The values for the SSM variables are cached for `1 minute`

## Examples
In serverless.yml

```yml
provider:
  name: aws
  iamRoleStatements:
    - Effect: "Allow"
      Action: "ssm:GetParameters"
      Resource: arn:aws:ssm:${env:AWS_REGION}:${env:AWS_ACCOUNT_ID}:parameter/*

functions:
  graphql:
    handler: src/graphql/index.handler
    events:
      - http:
          path: graphql
          method: post
          cors: true
    environment:
        SSM_USER_TOKEN: /path/to/userTokenInSSM
        SSM_GOOGLE_API_KEY: /path/to/googleAPIKey
```
```js
'use strict';

const { ssmEnvReader } = require('@a-cloud-guru/ssm-env-reader');

const handler = (event, context, cb) => {
    const USER_TOKEN = event.ssm.USER_TOKEN;
    console.log(USER_TOKEN) // 'dXNlcnRva2Vu'

    const GOOGLE_API_KEY = event.ssm.GOOGLE_API_KEY;
    console.log(GOOGLE_API_KEY) // 'Z29vZ2xlYXBpa2V5'
};

module.exports = {
    handler: ssmEnvReader(handler)
}
```
