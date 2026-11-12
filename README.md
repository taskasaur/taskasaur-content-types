# Taskasaur content types

A content type describes file contents, not a plugin's private database. Multiple
plugins can support the same type. Untyped files remain valid files.

Edit `registry.yaml`, run `npm install && npm run generate && npm run check`, and
open a pull request including both YAML and generated JSON. Declare MIME types,
extensions and the smallest useful required fields. Keep additional fields open
for other plugins. Never include credentials or runtime commands. Incompatible
contracts need a new type ID. New MIME strings here are application conventions,
not a claim of IANA registration.

The application consumes the checked JSON snapshot. This folder is the prepared
source of the independent `taskasaur-content-types` repository.
