[![Build Status][travis-image]][travis-url]
[![Codacy Badge][codacy-image]][codacy-url]
[![NPM Status][npm-image]][npm-url]
[![GitHub license][license-image]][license-url]
[![dependencies Status][dependencies-image]][dependencies-url]
[![LGTM Status][lgtm-image]][lgtm-url]

# 🐝 Oprah

Node module to push configuration and encrypted secrets to AWS.

## Installation

```
# Via yarn
$ yarn add oprah

# Via npm
$ npm install oprah
```

## Usage

1. At the root of your application add configuration file called `oprah.yml`.

```
service: oprah-service
provider: ssm

config:
  path: /${stage}/oprah/config
  defaults:
    DB_NAME: my-database
    DB_HOST: 3200
  required:
    DB_TABLE: "some database table name for ${stage}"

secret:
  path: /${stage}/oprah/secret
  required:
    DB_PASSWORD: "secret database password"
```

2. Use `oprah` CLI tool to push your keys to AWS parameter store.

```
$ oprah stage <stage> --interactive
```

### Config File

Following is the configuration file will all possible options:


```
service: oprah-service
provider: ssm                                 # Only supports ssm for now.

cfOutputs:                                    # Outputs from cloudformation stacks that needs to be pushed to ssm.
  - some-cloudformation-stack

config:
  path: /${stage}/oprah/config                # Base path for params to be added to
  defaults:                                   # Default parameters. Can be overwritten in different environments.
    DB_NAME: my-database
    DB_HOST: 3200
  production:                                 # If keys are deployed to production stage, its value will be overwritten by following
    DB_NAME: my-production-database
  required:                                   # Keys mentioned below will be prompted to be entered.
    DB_TABLE: "some database table name for ${stage}"

secret:
  keyId: some-arn-of-kms-key-to-use .         # If not specified, default key will be used to encrypt variables.
  path: /${stage}/oprah/secret                # Base path for params to be added to
  required:
    DB_PASSWORD: "secret database password" . # Parameter to encrypt and add to. Will be encrypted using KMS.
                                              # Above key will be added to /${stage}/oprah/secret/DB_PASSWORD
                                              # Value in quote will be displayed as explanation in prompt during interactive run.
```

### CLI

Following is the usage of `oprah` CLI.

```
Usage: oprah [options] [command]

Options:
  -V, --version          output the version number
  -s, --stage [stage]    Specify stage to run on. (required)
  -c, --config [config]  Path to oprah configuration (default: "oprah.yml")
  -h, --help             output usage information

Commands:
  run [options]          Verify or populate all remote configurations and secrets.
  init                   Initialize oprah. Only required to run once.
  list                   List all remote configurations and secrets.

```

### License

Feel free to use the code, it's released using the MIT license.

[travis-image]: https://travis-ci.org/ACloudGuru/oprah.svg?branch=master
[travis-url]: https://travis-ci.org/ACloudGuru/oprah
[dependencies-image]:https://david-dm.org/ACloudGuru/oprah/status.svg
[dependencies-url]:https://david-dm.org/ACloudGuru/oprah
[npm-image]:https://img.shields.io/npm/v/oprah.svg
[npm-url]:https://www.npmjs.com/package/oprah
[codacy-image]:https://api.codacy.com/project/badge/Grade/6464d14b26214357ba838d2cdbdfcb8e
[codacy-url]:https://www.codacy.com/app/subash.adhikari/oprah?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ACloudGuru/oprah&amp;utm_campaign=Badge_Grade
[license-image]:https://img.shields.io/github/license/ACloudGuru/oprah.svg
[license-url]:https://github.com/ACloudGuru/oprah/blob/master/LICENSE
[lgtm-image]:https://img.shields.io/lgtm/grade/javascript/g/ACloudGuru/oprah.svg?logo=lgtm&logoWidth=18
[lgtm-url]:https://lgtm.com/projects/g/ACloudGuru/oprah/context:javascript

