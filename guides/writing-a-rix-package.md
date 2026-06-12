# Writing a Rix Package

This guide explains how to design and write a Rix package.

A Rix package is an optional userland library for Vix.cpp projects.

It should be usable independently and, when stable, mountable through the unified Rix facade.

## The short version

A Rix package should follow this model:

```txt id="x7m4qa"
Registry package  -> rix/name
Header            -> <rix/name.hpp>
Facade access     -> rix.name
Namespace         -> rixlib::name
```

Example for a package named `pdf`:

```txt id="q8v2kc"
Registry package  -> rix/pdf
Header            -> <rix/pdf.hpp>
Facade access     -> rix.pdf
Namespace         -> rixlib::pdf
```

The package should be installable with:

```bash id="m5n9xa"
vix add rix/name
vix install
```

and used from `vix.app` through:

```txt id="c4q8vd"
deps = [
  "rix/name",
]
```

## What a Rix package should be

A Rix package should be:

```txt id="p9x3ma"
optional
focused
stable
independent
usable from Vix projects
installable through the Vix Registry
compatible with the unified Rix facade
```

A package should solve one clear userland problem.

Examples:

```txt id="z6v8qc"
rix/auth   -> authentication helpers
rix/csv    -> CSV parsing and writing
rix/debug  -> debug printing, formatting, inspection
rix/pdf    -> PDF generation
```

## What a Rix package should not be

A Rix package should not be:

```txt id="d3x7vp"
a CLI
a runtime
a package manager
a replacement for Vix.cpp
part of Vix Core
a standard library built into Vix.cpp
```

Rix packages are libraries.

Vix.cpp owns the project workflow, build workflow, runtime, registry commands, services, and deployment.

## Naming rules

Use the stable Rix naming model.

For a package named `json`:

```txt id="k8q5rd"
Registry package  -> rix/json
Header            -> <rix/json.hpp>
Facade access     -> rix.json
Namespace         -> rixlib::json
```

Avoid unstable naming styles:

```txt id="h5n7vc"
@rix/json
rix_json
RixJson
vix/json
jsonlib
```

Use:

```txt id="x9q2va"
rix/json
<rix/json.hpp>
rix.json
rixlib::json
```

## Repository shape

A package repository can use this structure:

```txt id="d6m8qc"
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

Example for `rix/pdf`:

```txt id="z4x7mq"
pdf/
  include/
    rix/
      pdf.hpp
      pdf/
        PdfModule.hpp
        Version.hpp
        core/
        document/
        writer/
  src/
    PdfModule.cpp
  examples/
    01_basic.cpp
  tests/
    pdf_tests.cpp
```

## Public header

Every independent package should expose one main public header:

```cpp id="y8m3ka"
#include <rix/name.hpp>
```

Example:

```cpp id="s5v9qa"
#include <rix/pdf.hpp>
```

This header should include the public package API.

It should not force users to include many internal headers for normal usage.

## Namespace

Use:

```cpp id="p7n4xm"
namespace rixlib::name
{
}
```

Example:

```cpp id="w3q8kc"
namespace rixlib::pdf
{
}
```

Public types should live inside the package namespace.

Example:

```cpp id="r6x2vd"
rixlib::pdf::Document
rixlib::pdf::Page
rixlib::pdf::Table
rixlib::pdf::Color
```

## Public module

Each package should expose a public module object.

Example shape:

```cpp id="a8k5qx"
namespace rixlib::name
{
  class NameModule
  {
  public:
    std::string version() const;
  };

  [[nodiscard]] inline constexpr NameModule module() noexcept
  {
    return NameModule{};
  }
}
```

For `rix/pdf`, this becomes:

```cpp id="f2v7mc"
namespace rixlib::pdf
{
  class PdfModule
  {
  public:
    Document document() const;
    PdfStatus save(const Document &document, std::string_view path) const;
  };

  [[nodiscard]] inline constexpr PdfModule module() noexcept
  {
    return PdfModule{};
  }
}
```

Independent usage:

```cpp id="c9m4vx"
#include <rix/pdf.hpp>

int main()
{
  auto pdf = rixlib::pdf::module();

  auto doc = pdf.document();

  return pdf.save(doc, "hello.pdf").ok() ? 0 : 1;
}
```

## Facade mounting

When the package API is stable, it can be mounted into `rix/rix`.

Facade access should follow:

```cpp id="m8q2za"
rix.name
```

Example:

```cpp id="n5v8qc"
rix.pdf.document()
rix.csv.parse(...)
rix.auth.memory()
rix.debug.print(...)
```

The facade should expose the common workflow.

Advanced types can stay in the package namespace.

## Independent first

A package should work independently before it is mounted into the facade.

First, this should work:

```cpp id="q7x4ma"
#include <rix/name.hpp>

int main()
{
  auto mod = rixlib::name::module();
  return 0;
}
```

Then the facade can later expose:

```cpp id="h6q9vx"
#include <rix.hpp>

int main()
{
  rix.name;
  return 0;
}
```

This keeps each package reusable.

## Dependency in `vix.app`

Rix packages are Vix Registry dependencies.

They belong in `deps`.

Correct:

```txt id="v8n3qb"
deps = [
  "rix/name",
]
```

Wrong:

```txt id="k4m9xd"
packages = [
  "rix/name",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

## Package manifest

A package should have a clear manifest.

Example shape:

```json id="x3m7qa"
{
  "name": "rix/name",
  "version": "0.1.0",
  "description": "Short description of the package.",
  "license": "MIT",
  "repository": "https://github.com/rixcpp/name"
}
```

Use the real package name and repository.

Keep the package name stable after publishing.

## CMake target

A package should expose a stable CMake target.

Example:

```txt id="n9q5vx"
rix::name
```

For PDF:

```txt id="d2v8rc"
rix::pdf
```

For the unified facade:

```txt id="b5x9ma"
rix::rix
```

Keep target names predictable.

## Version header

Each package should expose version helpers.

Example:

```cpp id="r4q8md"
namespace rixlib::name
{
  inline constexpr int VERSION_MAJOR = 0;
  inline constexpr int VERSION_MINOR = 1;
  inline constexpr int VERSION_PATCH = 0;

  [[nodiscard]] std::string version();
  [[nodiscard]] int version_major() noexcept;
  [[nodiscard]] int version_minor() noexcept;
  [[nodiscard]] int version_patch() noexcept;
  [[nodiscard]] int version_number() noexcept;
}
```

The public module can expose the same helpers:

```cpp id="y7m2ka"
rix.name.version()
rix.name.version_major()
rix.name.version_minor()
rix.name.version_patch()
```

This helps diagnostics and compatibility checks.

## Error model

Packages that can fail should use explicit results.

Do not hide normal expected failures behind exceptions.

Example:

```cpp id="f7q3ma"
auto result = rix.name.do_work(input);

if (result.failed())
{
  rix.debug.eprint(
      "error:",
      rix.name.error.to_string(result.error()),
      result.error().message());

  return 1;
}
```

For operations that return a value, use a result type.

For operations that only succeed or fail, use a status type.

## Result type

A result type should store either a value or an error.

Example shape:

```cpp id="n9x2qc"
template <typename T>
class NameResult
{
public:
  static NameResult success(T value);
  static NameResult failure(NameError error);

  bool ok() const noexcept;
  bool failed() const noexcept;

  const T &value() const;
  T &value();

  const NameError &error() const noexcept;
};
```

Use it for APIs such as:

```cpp id="c5v8na"
NameResult<Document>
NameResult<std::string>
NameResult<User>
```

## Status type

A status type should represent success or failure without a value.

Example shape:

```cpp id="m6q4rd"
class NameStatus
{
public:
  static NameStatus success();
  static NameStatus failure(NameError error);

  bool ok() const noexcept;
  bool failed() const noexcept;

  const NameError &error() const noexcept;
};
```

Use it for APIs such as:

```cpp id="v2k8xm"
save()
validate()
write_to_file()
logout()
```

## Error codes

Use stable error codes.

Example:

```cpp id="q9c5rd"
enum class NameErrorCode
{
  None,
  InvalidInput,
  InvalidState,
  FileOpenFailed,
  FileWriteFailed,
  Unknown
};
```

Expose:

```cpp id="k8m4xa"
to_string(NameErrorCode code)
```

and module helpers:

```cpp id="h5n7vc"
rix.name.error.to_string(error)
rix.name.error.is(error, NameErrorCode::InvalidInput)
```

Stable codes help applications make decisions.

Messages help developers understand what happened.

## Keep internals hidden

Public API should be small.

Implementation details should stay in:

```txt id="x9q2va"
detail/
internal/
writer/
adapter/
```

Only expose what applications need.

For example, `rix/pdf` can expose:

```cpp id="d6m8qc"
rix.pdf.document()
rix.pdf.save(...)
rix.pdf.write(...)
```

while keeping low-level serialization details behind the writer layer.

## Header design

Public headers should be clean.

Prefer:

```cpp id="z4x7mq"
#include <rix/name.hpp>
```

for normal users.

Use deeper headers for advanced users:

```cpp id="y8m3ka"
#include <rix/name/core/Type.hpp>
#include <rix/name/detail/Internal.hpp>
```

Do not require internal includes for the basic workflow.

## Example package header

```cpp id="s5v9qa"
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

#endif // RIXCPP_NAME_INCLUDE_RIX_NAME_HPP_INCLUDED
```

Use include guards with stable names.

## Example module header

```cpp id="p7n4xm"
#ifndef RIXCPP_NAME_INCLUDE_RIX_NAME_NAMEMODULE_HPP_INCLUDED
#define RIXCPP_NAME_INCLUDE_RIX_NAME_NAMEMODULE_HPP_INCLUDED

#include <rix/name/Version.hpp>

#include <string>

namespace rixlib::name
{
  class NameModule
  {
  public:
    [[nodiscard]] std::string version() const;
    [[nodiscard]] int version_major() const noexcept;
    [[nodiscard]] int version_minor() const noexcept;
    [[nodiscard]] int version_patch() const noexcept;
    [[nodiscard]] int version_number() const noexcept;
  };
}

#endif // RIXCPP_NAME_INCLUDE_RIX_NAME_NAMEMODULE_HPP_INCLUDED
```

## Example module source

```cpp id="w3q8kc"
#include <rix/name/NameModule.hpp>

namespace rixlib::name
{
  std::string NameModule::version() const
  {
    return rixlib::name::version();
  }

  int NameModule::version_major() const noexcept
  {
    return rixlib::name::version_major();
  }

  int NameModule::version_minor() const noexcept
  {
    return rixlib::name::version_minor();
  }

  int NameModule::version_patch() const noexcept
  {
    return rixlib::name::version_patch();
  }

  int NameModule::version_number() const noexcept
  {
    return rixlib::name::version_number();
  }
}
```

## README requirements

A package README should include:

```txt id="r6x2vd"
what the package does
how to install it
how to include it
a basic example
facade usage if supported
independent usage
error handling if relevant
license
repository link
```

Start with a simple example.

Do not start with internals.

## Basic README example

````md id="a8k5qx"
# rix/name

`rix/name` is a Rix package for ...

## Install

```bash
vix add rix/name
vix install
```
````

## Use

```cpp
#include <rix/name.hpp>

int main()
{
  auto mod = rixlib::name::module();
  return 0;
}
```

````

## Examples

Every package should have examples.

Example layout:

```txt id="f2v7mc"
examples/
  01_basic.cpp
  02_errors.cpp
  03_options.cpp
````

Examples should compile with Vix commands.

Use:

```bash id="c9m4vx"
vix run examples/01_basic.cpp
```

or from a project:

```bash id="m8q2za"
vix build
vix run
```

## Tests

A package should have tests.

Example layout:

```txt id="n5v8qc"
tests/
  name_tests.cpp
```

Run tests with:

```bash id="q7x4ma"
vix tests
```

Tests should cover:

```txt id="h6q9vx"
basic workflow
invalid input
error codes
edge cases
version helpers
public headers
independent package usage
```

## Documentation

Docs should start from the public API.

Recommended docs:

```txt id="v8n3qb"
index.md
quick-start.md
installation.md
api-reference.md
errors.md
examples.md
```

For larger packages:

```txt id="k4m9xd"
configuration.md
advanced-usage.md
security.md
adapters.md
```

## API reference

The API reference should list public types and methods.

Do not document every private detail.

A useful API reference includes:

```txt id="x3m7qa"
module class
core public types
result and status types
error codes
configuration types
version helpers
main functions
```

## Design principle

A Rix package should keep complexity inside the package.

The public API should stay simple.

Good:

```cpp id="n9q5vx"
auto doc = rix.pdf.document();
auto saved = rix.pdf.save(doc, "hello.pdf");
```

Less good as a first public API:

```cpp id="d2v8rc"
PdfObjectWriter writer;
XrefTable xref;
FontRegistry fonts;
```

Low-level APIs can exist, but the common workflow should be short.

## Public API checklist

Before publishing, check:

```txt id="b5x9ma"
Can the package be installed with vix add rix/name?
Does it belong in deps?
Does it have <rix/name.hpp>?
Does it use namespace rixlib::name?
Does it expose rixlib::name::module()?
Does it have a simple public module?
Does it return explicit results for expected failures?
Does it have version helpers?
Does it have examples?
Does it have tests?
Can it be used independently?
Can it be mounted into rix/rix later?
```

## Facade checklist

Before mounting into `rix/rix`, check:

```txt id="r4q8md"
Is the independent package stable?
Is the facade member name short?
Does it follow rix.name?
Does it expose the common workflow?
Does it avoid exposing internals first?
Does it work with feature macros?
Does it compile when only that feature is enabled?
Does it compile when all features are enabled?
```

## Feature macro support

If the package is mounted into the facade, add a feature macro.

Example:

```cpp id="y7m2ka"
#define RIX_ENABLE_NAME
#include <rix.hpp>
```

If no feature macro is defined, all currently mounted modules are enabled.

If at least one feature macro is defined, only selected modules are mounted.

Example:

```cpp id="f7q3ma"
#define RIX_ENABLE_PDF
#define RIX_ENABLE_DEBUG
#include <rix.hpp>
```

## Facade member example

A facade can mount a package like this:

```cpp id="n9x2qc"
class Rix
{
public:
#ifdef RIX_ENABLE_NAME
  rixlib::name::NameModule name{};
#endif
};
```

In the real facade, keep default behavior in mind:

```txt id="c5v8na"
no feature macro -> enable all mounted modules
one or more feature macros -> enable selected modules only
```

## Package versioning

Use semantic versioning.

For early packages:

```txt id="m6q4rd"
0.1.0
0.2.0
0.3.0
```

Patch versions should fix bugs.

Minor versions can add APIs.

Breaking changes should be handled carefully, especially after users start depending on the package.

## Release checklist

Before release:

```txt id="v2k8xm"
update version
update CHANGELOG
run vix build
run vix tests
run examples
check README
check docs
tag release
publish registry metadata
sync registry
test install from a clean project
```

Use Vix commands:

```bash id="q9c5rd"
vix build
vix tests
```

After publishing, verify:

```bash id="k8m4xa"
vix registry sync
vix add rix/name
vix install
```

## Dependency rules

A Rix package should keep dependencies minimal.

If it depends on another Rix package, add it explicitly.

Example:

```txt id="h5n7vc"
deps = [
  "rix/debug",
]
```

Avoid pulling the full facade from an independent package unless there is a strong reason.

Independent packages should not depend on `rix/rix` by default.

## When a package should depend on Vix

A package can depend on Vix when it directly needs Vix runtime APIs.

Example:

```txt id="x9q2va"
HTTP integration
WebSocket integration
Vix application adapters
Vix-specific middleware
```

If the package is a general utility, keep it independent from Vix runtime when possible.

## Package categories

A package can be:

```txt id="d6m8qc"
pure utility package
application-level package
Vix integration package
adapter package
facade package
```

Examples:

```txt id="z4x7mq"
rix/csv    -> utility package
rix/pdf    -> application-level package
rix/auth   -> application-level package
rix/rix    -> facade package
```

## Security-sensitive packages

If a package handles security-sensitive behavior, document it clearly.

Examples:

```txt id="y8m3ka"
auth
tokens
sessions
password hashing
crypto adapters
```

Security docs should include:

```txt id="s5v9qa"
safe defaults
what not to log
configuration warnings
production recommendations
limitations
threat model notes when useful
```

For auth, do not log:

```txt id="p7n4xm"
plain-text passwords
password hashes
raw tokens
session ids
```

## Error handling examples

Every package with explicit errors should show failure examples.

Example:

```cpp id="w3q8kc"
auto result = mod.do_work("");

if (result.failed())
{
  rix.debug.eprint(
      "expected error:",
      mod.error.to_string(result.error()),
      result.error().message());

  return 0;
}
```

This teaches users the correct pattern.

## Common mistakes

### Starting from the facade before the package works independently

The independent package should work first:

```cpp id="r6x2vd"
#include <rix/name.hpp>

auto mod = rixlib::name::module();
```

Then mount it into:

```cpp id="a8k5qx"
#include <rix.hpp>

rix.name
```

### Putting Rix dependencies in `packages`

Wrong:

```txt id="f2v7mc"
packages = [
  "rix/name",
]
```

Correct:

```txt id="c9m4vx"
deps = [
  "rix/name",
]
```

### Exposing internals as the first API

Avoid making users start from low-level internals.

Start with:

```cpp id="m8q2za"
auto mod = rixlib::name::module();
```

or:

```cpp id="n5v8qc"
rix.name
```

### Making the package too broad

A package should have one clear responsibility.

Avoid one package doing unrelated things.

Better:

```txt id="q7x4ma"
rix/csv
rix/pdf
rix/auth
```

than:

```txt id="h6q9vx"
rix/tools
rix/misc
rix/everything
```

### Calling the package part of Vix Core

Rix packages are optional userland packages.

They are not built into Vix Core.

Users install them through the registry.

### Forgetting examples

A package without examples is hard to adopt.

Add at least one basic example.

### Forgetting errors

If an operation can fail, return an explicit result or status and document the pattern.

## What you should remember

A Rix package follows one model:

```txt id="v8n3qb"
Registry package  -> rix/name
Header            -> <rix/name.hpp>
Facade access     -> rix.name
Namespace         -> rixlib::name
```

Use `deps` in `vix.app`:

```txt id="k4m9xd"
deps = [
  "rix/name",
]
```

Expose a simple module:

```cpp id="x3m7qa"
auto mod = rixlib::name::module();
```

Keep the common workflow short.

Keep internals hidden.

Use explicit results for expected failures.

Make the independent package work before mounting it into the facade.

## Next step

Continue with the package checklist.

Next: [Package checklist](./package-model)
