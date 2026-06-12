# Contributing

Thank you for your interest in contributing to Rix.

Rix is the official userland package layer for Vix.cpp. It provides optional libraries such as auth, CSV, debug helpers, PDF generation, and future packages for Vix.cpp applications.

This guide explains how to contribute to Rix packages, examples, documentation, tests, and package design.

## The short version

Use Vix commands:

```bash id="q8m4xa"
vix install
vix build
vix tests
```

For package dependencies, use `deps` in `vix.app`:

```txt id="n5v9qc"
deps = [
  "rix/rix",
]
```

Do not put Rix packages in `packages`.

Keep Rix packages:

```txt id="k7x2ma"
optional
focused
stable
independent
easy to use from Vix.cpp projects
```

## Project goals

Rix exists to keep Vix.cpp focused.

Vix.cpp owns:

```txt id="p9c5xr"
runtime
CLI
project workflow
build workflow
registry workflow
application foundation
service and deployment workflow
```

Rix owns optional userland libraries:

```txt id="q4m8vb"
auth
csv
debug
pdf
future packages
```

A contribution should respect that separation.

## What Rix is

Rix is an official package namespace and collection for optional Vix.cpp libraries.

Rix packages are installed through the Vix Registry:

```bash id="x2n7pd"
vix add rix/rix
vix install
```

They are used through `deps`:

```txt id="t8q5hm"
deps = [
  "rix/rix",
]
```

## What Rix is not

Rix is not a CLI.

Rix is not a runtime.

Rix is not the package manager.

Rix is not Vix Core.

Rix is not a standard library built into Vix.cpp.

Rix packages are optional libraries used inside Vix.cpp projects.

## Package model

Every Rix package should follow one stable model:

```txt id="b6x3rd"
Registry package  -> rix/name
Header            -> <rix/name.hpp>
Facade access     -> rix.name
Namespace         -> rixlib::name
```

Examples:

```txt id="z5v8ka"
rix/auth   -> <rix/auth.hpp>   -> rix.auth   -> rixlib::auth
rix/csv    -> <rix/csv.hpp>    -> rix.csv    -> rixlib::csv
rix/debug  -> <rix/debug.hpp>  -> rix.debug  -> rixlib::debug
rix/pdf    -> <rix/pdf.hpp>    -> rix.pdf    -> rixlib::pdf
```

The unified facade package is:

```txt id="c9q2mx"
rix/rix
```

It provides:

```cpp id="h7n4qc"
#include <rix.hpp>
```

and:

```cpp id="d3x8vp"
rix.auth
rix.csv
rix.debug
rix.pdf
```

## Contribution areas

You can contribute by improving:

```txt id="j2m9wa"
package APIs
bug fixes
tests
examples
documentation
README files
registry metadata
error messages
security notes
package design
```

Start small when possible.

A focused fix is easier to review than a large mixed change.

## Before contributing

Make sure the project builds:

```bash id="w8c5nr"
vix install
vix build
```

Run tests:

```bash id="k5v7ma"
vix tests
```

Run relevant examples:

```bash id="r6q9xd"
vix run examples/01_basic.cpp
```

Use Vix commands for Rix projects.

Do not use direct CMake or Ninja commands unless you are specifically debugging build internals.

## Repository setup

Clone the repository:

```bash id="p2n8fc"
git clone https://github.com/rixcpp/rix.git
cd rix
```

Install dependencies:

```bash id="y4m6qv"
vix install
```

Build:

```bash id="f9x3ka"
vix build
```

Run tests:

```bash id="m7c5vx"
vix tests
```

## Branch naming

Use short branch names.

Examples:

```txt id="q3p8za"
fix/pdf-save-error
docs/auth-security
feat/csv-options
test/debug-format
```

Keep one topic per branch.

## Commit style

Use clear commit messages.

Examples:

```txt id="v8n2hr"
fix(pdf): handle empty output path
docs(auth): add session security notes
test(csv): cover row filter options
feat(debug): add format append helper
```

Good commit messages explain the package and the reason.

## Code style

Keep code simple and explicit.

Prefer readable APIs over clever abstractions.

Use C++20.

Use clear names.

Keep public APIs small.

Keep implementation details hidden.

Prefer explicit result types for expected failures.

## Include style

Public includes should use Rix package headers.

Facade usage:

```cpp id="a6q9mx"
#include <rix.hpp>
```

Independent package usage:

```cpp id="r4v8kb"
#include <rix/pdf.hpp>
#include <rix/csv.hpp>
#include <rix/debug.hpp>
#include <rix/auth.hpp>
```

Do not require users to include internal headers for normal workflows.

## Namespace style

Use package namespaces:

```cpp id="x9m2pd"
namespace rixlib::pdf
{
}
```

Examples:

```cpp id="c5w9qa"
rixlib::auth
rixlib::csv
rixlib::debug
rixlib::pdf
```

The global facade object exposes modules:

```cpp id="z8q2vm"
rix.auth
rix.csv
rix.debug
rix.pdf
```

## Public API design

Public APIs should make common workflows short.

Good:

```cpp id="n7x4hd"
auto doc = rix.pdf.document();

auto &page = doc.add_page();

page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");

auto saved = rix.pdf.save(doc, "hello.pdf");
```

Avoid making users start from internals.

Less good as a first API:

```cpp id="d6k8rc"
PdfObjectWriter writer;
XrefTable xref;
FontRegistry fonts;
```

Internals can exist, but the common public API should stay simple.

## Error handling

Expected failures should use explicit result or status objects.

For operations that return values:

```cpp id="g5m9xq"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(bytes.error()),
      bytes.error().message());

  return 1;
}

const auto &data = bytes.value();
```

For operations that only succeed or fail:

```cpp id="y3v8mb"
auto saved = rix.pdf.save(doc, "output.pdf");

if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

Never call `value()` before checking success.

## Error codes

Packages with domain failures should expose stable error codes.

Examples:

```cpp id="f4q7vd"
rixlib::auth::AuthErrorCode
rixlib::pdf::PdfErrorCode
```

Error helpers should be exposed through package modules:

```cpp id="w2x6qp"
rix.auth.error.to_string(error)
rix.auth.error.is(error, code)

rix.pdf.error.to_string(error)
rix.pdf.error.is(error, code)
```

Use stable error codes for application decisions.

Use error messages for diagnostics.

## Security-sensitive code

Be careful with packages related to auth, passwords, sessions, tokens, crypto, or user data.

Do not log:

```txt id="n6c9hd"
plain-text passwords
password hashes
raw tokens
session ids
private keys
secrets
```

Auth changes should keep safe defaults.

Security-sensitive code should have tests and documentation.

## Debug output

`rix.debug` is useful for examples, tests, formatting, printing, and inspection.

For real Vix application logs, prefer:

```cpp id="j8q5kc"
vix::log
```

Do not design production application logging around:

```cpp id="r7x3vm"
rix.debug.log
```

Use debug helpers for examples and small tools.

## Dependencies

Rix packages belong in `deps`.

Correct:

```txt id="p6m8xb"
deps = [
  "rix/pdf",
]
```

Wrong:

```txt id="t9q2za"
packages = [
  "rix/pdf",
]
```

`deps` is for Vix Registry dependencies.

`packages` is for CMake package discovery.

## Adding dependencies

If a package needs another Rix package, add it explicitly.

Example:

```txt id="x4v7nd"
deps = [
  "rix/debug",
]
```

Independent packages should avoid depending on `rix/rix` unless there is a strong reason.

If a package only needs one feature, depend on that package directly.

## Facade changes

When adding a package to the unified facade, make sure:

```txt id="p4q8zb"
the independent package works first
the facade member name follows rix.name
the package has a stable public module
feature macros still work
default facade behavior still works
docs are updated
examples are updated
tests are added
```

## Feature macros

The facade supports feature macros.

If no feature macro is defined, all mounted modules are enabled.

If one or more feature macros are defined, only selected modules are mounted.

Examples:

```cpp id="v2k9qc"
#define RIX_ENABLE_PDF
#include <rix.hpp>
```

```cpp id="c8w5rp"
#define RIX_ENABLE_CSV
#define RIX_ENABLE_DEBUG
#include <rix.hpp>
```

Available macros include:

```txt id="z4v8qa"
RIX_ENABLE_AUTH
RIX_ENABLE_CSV
RIX_ENABLE_DEBUG
RIX_ENABLE_PDF
```

When adding a new facade module, add its feature macro and test it.

## Documentation style

Docs should start with the facade when possible:

```cpp id="q8k5mv"
#include <rix.hpp>
```

and:

```cpp id="s6n4vm"
rix.pdf
rix.auth
rix.csv
rix.debug
```

Then show independent usage later:

```cpp id="v8q3md"
#include <rix/pdf.hpp>

auto pdf = rixlib::pdf::module();
```

This keeps the public docs consistent.

## Documentation should avoid `/tmp`

Use home-folder examples:

```bash id="h5v8qp"
mkdir -p ~/rix-example
cd ~/rix-example
```

Do not use `/tmp` in docs unless there is a specific reason.

Some systems or user environments may not behave the same with `/tmp`.

## Example style

Examples should be complete and runnable.

Good example:

```cpp id="d9m5qx"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix.pdf");

  auto saved = rix.pdf.save(doc, "hello.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "hello.pdf");
  return 0;
}
```

Run examples with:

```bash id="m8x2vc"
vix run example.cpp
```

If Rix is not available globally:

```bash id="a2r7kb"
vix install -g rix/rix
vix run example.cpp
```

## Vix project examples

For project examples, use:

```bash id="c8n3vy"
vix new my-app --app
cd my-app
vix add rix/rix
vix install
vix build
vix run
```

Show `deps` clearly:

```txt id="n6x9qa"
deps = [
  "rix/rix",
]
```

Do not put Rix packages in `packages`.

## Tests

Add tests for code changes.

Tests should cover:

```txt id="y5q2md"
basic success path
invalid input
edge cases
error codes
public headers
version helpers
result handling
facade usage when relevant
independent usage when relevant
```

Run:

```bash id="b4v8qc"
vix tests
```

## Examples

Add examples when a feature needs explanation.

Examples should show real usage, not internals first.

For PDF:

```txt id="p3x7rn"
examples/pdf/basic
examples/pdf/text
examples/pdf/table
examples/pdf/drawing
examples/pdf/error-handling
```

For auth:

```txt id="h9n2ka"
examples/auth/memory-register-login
examples/auth/password-hash
examples/auth/session-refresh-logout
examples/auth/token-issue
```

For CSV and debug:

```txt id="q6v8mx"
examples/csv
examples/debug
```

## README updates

Update the README when a contribution changes public behavior.

A README should explain:

```txt id="t5c8vp"
what the package does
how to install it
how to include it
a basic example
facade usage
independent usage
error handling when relevant
license
repository link
```

Start with public usage.

Do not start with internals.

## Changelog updates

If the repository uses a changelog, update it for user-facing changes.

Group changes by type:

```txt id="r8q5wc"
Added
Changed
Fixed
Deprecated
Removed
Security
```

Keep entries short and clear.

## Pull request checklist

Before opening a pull request, check:

```txt id="x4m9vd"
vix install passes
vix build passes
vix tests passes
examples still run
docs are updated
README is updated if needed
public API is stable and simple
errors are explicit
sensitive values are not logged
Rix packages are in deps, not packages
```

## Pull request description

A good pull request description includes:

```txt id="f7q3ma"
what changed
why it changed
how it was tested
any API impact
any documentation impact
any security impact
```

Example:

```md id="n9x2qc"
## Summary

Fixes PDF save error handling for empty output paths.

## Testing

- vix build
- vix tests
- vix run examples/pdf/error_handling.cpp

## Notes

No breaking API changes.
```

## Reviewing contributions

Reviews should focus on:

```txt id="c5v8na"
correctness
API simplicity
error handling
test coverage
docs clarity
security implications
Vix/Rix separation
backward compatibility
```

Prefer specific feedback.

Avoid broad rewrites unless they improve the public API or correctness.

## Backward compatibility

Avoid breaking public APIs without a strong reason.

If a breaking change is necessary:

```txt id="m6q4rd"
explain why
update docs
update examples
update tests
consider a migration note
use a version bump that reflects the change
```

Keep application code stable.

## Adding a new package

Before adding a new Rix package, check:

```txt id="v2k8xm"
Does it solve one clear problem?
Is it optional?
Does it belong outside Vix Core?
Can it work independently?
Can it later mount into rix/rix?
Does it follow rix/name?
Does it expose <rix/name.hpp>?
Does it use namespace rixlib::name?
Does it have a simple module?
Does it have examples and tests?
```

If the answer is yes, it fits the Rix model.

## New package structure

A new package can use this shape:

```txt id="q9c5rd"
name/
  CMakeLists.txt
  README.md
  LICENSE
  vix.json
  include/
    rix/
      name.hpp
      name/
        Version.hpp
        NameModule.hpp
        core/
        detail/
  src/
    NameModule.cpp
  examples/
    01_basic.cpp
  tests/
    name_tests.cpp
```

## Package header

Every package should expose:

```cpp id="k8m4xa"
#include <rix/name.hpp>
```

Example shape:

```cpp id="h5n7vc"
#ifndef RIXCPP_NAME_INCLUDE_RIX_NAME_HPP_INCLUDED
#define RIXCPP_NAME_INCLUDE_RIX_NAME_HPP_INCLUDED

#include <rix/name/NameModule.hpp>
#include <rix/name/Version.hpp>

namespace rixlib::name
{
  [[nodiscard]] inline constexpr NameModule module() noexcept
  {
    return NameModule{};
  }
}

#endif
```

## Version helpers

Packages should expose version helpers.

Example:

```cpp id="x9q2va"
rix.name.version()
rix.name.version_major()
rix.name.version_minor()
rix.name.version_patch()
rix.name.version_number()
```

Independent package namespace:

```cpp id="d6m8qc"
rixlib::name::version()
rixlib::name::version_major()
rixlib::name::version_minor()
rixlib::name::version_patch()
rixlib::name::version_number()
```

## Release checklist

Before a release:

```txt id="z4x7mq"
update version
update changelog
run vix install
run vix build
run vix tests
run examples
check docs
check README
tag release
publish registry metadata
test install from a clean project
```

After publishing, verify:

```bash id="y8m3ka"
vix registry sync
vix add rix/name
vix install
```

## Security issues

Do not open a public issue for sensitive security problems.

Report security problems privately through the project maintainer contact or the repository security policy if one is available.

Security-sensitive reports may include:

```txt id="s5v9qa"
auth bypass
password hashing issues
token leakage
session validation issues
secret exposure
unsafe defaults
```

## Common mistakes

### Putting Rix dependencies in `packages`

Wrong:

```txt id="p7n4xm"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="w3q8kc"
deps = [
  "rix/rix",
]
```

### Using direct CMake commands in docs

Prefer Vix commands:

```bash id="r6x2vd"
vix build
vix tests
vix run
```

### Starting docs from internals

Start from public usage:

```cpp id="a8k5qx"
#include <rix.hpp>

auto doc = rix.pdf.document();
```

Then document internals later if needed.

### Calling Rix a runtime

Rix is not the runtime.

Vix.cpp owns runtime behavior.

### Calling Rix a package manager

Rix is not the package manager.

Vix owns the package workflow.

### Logging secrets

Do not log:

```txt id="f2v7mc"
passwords
password hashes
tokens
session ids
private keys
secrets
```

### Using `/tmp` in docs

Prefer:

```bash id="c9m4vx"
mkdir -p ~/rix-example
```

over:

```bash id="m8q2za"
mkdir -p /tmp/rix-example
```

## What you should remember

Use Vix commands:

```bash id="n5v8qc"
vix install
vix build
vix tests
```

Use `deps` for Rix packages:

```txt id="q7x4ma"
deps = [
  "rix/rix",
]
```

Follow the Rix package model:

```txt id="h6q9vx"
Registry package  -> rix/name
Header            -> <rix/name.hpp>
Facade access     -> rix.name
Namespace         -> rixlib::name
```

Keep packages independent.

Keep public APIs small.

Use explicit results for expected failures.

Document facade usage first.

Do not log sensitive values.

## Next step

Read the package model and package checklist.

Next: [Package model](./guides/package-model)
