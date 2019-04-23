# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [v2.5.0](2019-04-23)

### Added
- `-m, --missing` To prompt only missing values in interactive mode

## [v2.4.0](2019-02-12)

### Fixed
- `cfOutputs` allow CloudFormation stack outputs to be pushed to the parameter store

## [v2.3.1](2019-02-04)

### Added
- `import` & `export` command to import/export key values from specified provider

## [v2.3.0](2019-02-01)

### Changed
- `run` command now runs both `init` and `configure`.

## [v2.2.1](2019-01-31)

### Fixed
- Terminate process with exit code 1 on errors

## [v2.2.0](2019-01-29)

### Changed
- Retains DynamoDB by default to prevent accidental deletion

## [v2.1.0](2019-01-29)

### Changed
- Mask secrets when parameters are listed

## [v2.0.0](2019-01-24)

### Added
- Add support to DynamoDB provider

## [v1.0.0] (-----)

### Added
- Initial Release
