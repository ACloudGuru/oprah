# Oprah

## Dependencies

- node 6.10.3

## Usage

### Config

Config specified in `config/default.yaml` will be applied to all environments unless an override file is specified.

If an override file is specified in `config/[stage].yaml`, the override file will be merged with the default config values.

### Secrets

Required secrets can be specified in `secret/required.yaml`. Every key specified in this file will prompt the user for a value when `configure.sh` is run.

```
populateConfig({
  defaultPath,
  overridePath,
  ssmPath,
  variables = {}
})
```

```
populateSecret({
  requiredPath,
  ssmPath,
  keyId,
  noninteractive
})
```

```
readCfOutputs({
  stackName
})
```

```
runServerless({
  serverlessYamlDirectory,
  stage
})
```
