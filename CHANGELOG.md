# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-02

### Added
- Initial release
- `readFile()` and `readFileSync()` for reading TOON files
- `writeFile()` and `writeFileSync()` for writing TOON files
- `parse()` for parsing TOON strings
- `stringify()` for converting objects to TOON format
- Support for simple key-value pairs
- Support for nested objects
- Support for inline arrays
- Support for boolean, number, string, and null types
- BOM (Byte Order Mark) handling
- Custom EOL (End of Line) support
- `throws` option for silent error handling
- `finalEOL` option to control trailing newline
- Custom indentation size support
- Custom delimiter support for arrays (comma, tab, pipe)
- Callback and Promise API support
- Comprehensive test suite