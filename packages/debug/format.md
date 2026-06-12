# Format

This page explains the formatting helpers provided by `rix/debug`.

The examples use the public Rix facade:

```cpp id="xa8uur"
#include <rix.hpp>
```

and access formatting through:

```cpp id="qfqn8w"
rix.debug.format
```

Formatting is useful when you want to build a string with placeholders before printing it, storing it, returning it, or passing it to another API.

For production application logs, prefer the Vix logging system.

## Basic example

Create a file:

```bash id="sm7hdp"
mkdir -p ~/rix-debug-format
cd ~/rix-debug-format
touch format.cpp
```

Add:

```cpp id="n8imlf"
#include <rix.hpp>

#include <string>

int main()
{
  const std::string one =
      rix.debug.format("Hello, {}", "Ada");

  const std::string two =
      rix.debug.format(
          "{0} builds on {1}",
          "Rix",
          "Vix.cpp");

  const std::string three =
      rix.debug.format(
          "{{ package }} = {}",
          "rix/debug");

  rix.debug.print(one);
  rix.debug.print(two);
  rix.debug.print(three);

  return 0;
}
```

Run it:

```bash id="hkwq17"
vix run format.cpp
```

If Rix is not available yet for single-file usage:

```bash id="r9h32j"
vix install -g rix/rix
vix run format.cpp
```

## Expected output

The output should look like this:

```txt id="gqgimf"
Hello, Ada
Rix builds on Vix.cpp
{ package } = rix/debug
```

## `rix.debug.format`

Use:

```cpp id="vyn8q6"
rix.debug.format(...)
```

to create a formatted string.

Example:

```cpp id="f8enjp"
const auto message =
    rix.debug.format("Package: {}", "rix/debug");

rix.debug.print(message);
```

Output:

```txt id="w5bxg2"
Package: rix/debug
```

`format` returns a `std::string`.

It does not print by itself.

## Automatic placeholders

Use `{}` to insert arguments in order:

```cpp id="jn2jqs"
const auto message =
    rix.debug.format("{} uses {}", "Rix", "C++");
```

Output:

```txt id="xebvh3"
Rix uses C++
```

Each `{}` consumes the next argument.

Example:

```cpp id="x9lz3b"
const auto message =
    rix.debug.format(
        "name: {}, language: {}, rows: {}",
        "Ada",
        "C++",
        3);
```

Output:

```txt id="n92lvd"
name: Ada, language: C++, rows: 3
```

## Explicit placeholders

Use `{0}`, `{1}`, and other numeric indexes when the position should be explicit:

```cpp id="ggp326"
const auto message =
    rix.debug.format("{0} + {0} = {1}", "C++", "Vix.cpp");
```

Output:

```txt id="y6tdam"
C++ + C++ = Vix.cpp
```

Explicit indexes are useful when the same value appears more than once.

## Do not mix placeholder styles

Do not mix automatic placeholders and explicit placeholders in the same format string.

Wrong:

```cpp id="hs4tt3"
rix.debug.format("{} {0}", "Rix");
```

Use automatic placeholders:

```cpp id="v0jnj1"
rix.debug.format("{} {}", "Rix", "Debug");
```

or explicit placeholders:

```cpp id="wwu6zm"
rix.debug.format("{0} {1}", "Rix", "Debug");
```

## Escaped braces

Use double opening braces and double closing braces when you need literal braces:

```cpp id="es4w0j"
const auto message =
    rix.debug.format("{{ package }} = {}", "rix/debug");
```

Output:

```txt id="vmu6wo"
{ package } = rix/debug
```

This is useful when printing template-like text, configuration blocks, or examples.

## Unsupported format specifiers

`rix.debug.format` intentionally keeps formatting small.

It does not support format specifiers such as:

```txt id="qeo82w"
{:>10}
{:.2f}
{:04d}
```

Wrong:

```cpp id="e8ag3c"
rix.debug.format("{:.2f}", 3.14159);
```

Use simple placeholders:

```cpp id="kjvuc7"
rix.debug.format("value: {}", 3.14159);
```

For advanced formatting, use another formatting library or normal C++ formatting tools where appropriate.

## Format different value types

`rix.debug.format` uses the Rix rendering pipeline.

You can format strings, numbers, booleans, and other supported printable values.

```cpp id="lve7gf"
const auto message =
    rix.debug.format(
        "name: {}, rows: {}, ready: {}",
        "Ada",
        3,
        true);

rix.debug.print(message);
```

Output shape:

```txt id="em2x4w"
name: Ada, rows: 3, ready: true
```

## Append formatted output

Use:

```cpp id="yzff8m"
rix.debug.format.append(...)
```

to append formatted text to an existing string.

Example:

```cpp id="gur4sm"
std::string out = "Rix: ";

rix.debug.format.append(
    out,
    "{}",
    "debug");

rix.debug.print(out);
```

Output:

```txt id="ouvjuu"
Rix: debug
```

Append is useful when you are building a longer string in steps.

## Replace a string with formatted output

Use:

```cpp id="vabhdv"
rix.debug.format.to(...)
```

to replace an existing string with formatted output.

Example:

```cpp id="jnbqsh"
std::string out = "old value";

rix.debug.format.to(
    out,
    "Package: {}",
    "rix/debug");

rix.debug.print(out);
```

Output:

```txt id="orws1v"
Package: rix/debug
```

The previous content of `out` is cleared.

## `format` vs `print`

Use `format` when you need a string:

```cpp id="illmrw"
const auto message =
    rix.debug.format("rows: {}", 3);

rix.debug.print(message);
```

Use `print` when you only want to write values immediately:

```cpp id="wpcvfd"
rix.debug.print("rows:", 3);
```

`print` separates values with spaces.

`format` replaces placeholders and returns a string.

## `format` vs `sprint`

Use `format` when you want placeholder-based formatting:

```cpp id="rj3vvp"
const auto message =
    rix.debug.format("Package: {}", "rix/debug");
```

Use `sprint` when you want the same rendering style as `print`, but returned as a string:

```cpp id="mntk5x"
const auto line =
    rix.debug.sprint("Package:", "rix/debug");
```

Both return `std::string`.

The difference is the style:

```txt id="ehq1b9"
format -> placeholder replacement
sprint -> print-style value joining
```

## Complete append example

```cpp id="f7u613"
#include <rix.hpp>

#include <string>

int main()
{
  std::string output;

  rix.debug.format.append(
      output,
      "package: {}\n",
      "rix/debug");

  rix.debug.format.append(
      output,
      "status: {}\n",
      "ready");

  rix.debug.format.append(
      output,
      "rows: {}\n",
      3);

  rix.debug.print(output);

  return 0;
}
```

Run:

```bash id="z9uu1r"
vix run format.cpp
```

Expected output:

```txt id="w4cbt0"
package: rix/debug
status: ready
rows: 3
```

## Complete replace example

```cpp id="bu4guz"
#include <rix.hpp>

#include <string>

int main()
{
  std::string message;

  rix.debug.format.to(
      message,
      "Hello, {}",
      "Rix");

  rix.debug.print(message);

  rix.debug.format.to(
      message,
      "Package: {}",
      "rix/debug");

  rix.debug.print(message);

  return 0;
}
```

Run:

```bash id="s7e43v"
vix run format.cpp
```

Expected output:

```txt id="g0sihy"
Hello, Rix
Package: rix/debug
```

## Formatting errors

Invalid format strings can throw `rixlib::format_error`.

Examples of invalid usage:

```cpp id="hgj4vv"
rix.debug.format("{", "Rix");
rix.debug.format("}", "Rix");
rix.debug.format("{2}", "Rix");
rix.debug.format("{} {0}", "Rix");
rix.debug.format("{:.2f}", 3.14);
```

For examples and small tools, keep format strings simple.

For user-provided format strings, handle errors explicitly.

Example:

```cpp id="xbfe56"
try
{
  const auto message =
      rix.debug.format("{} {}", "Rix", "Debug");

  rix.debug.print(message);
}
catch (const rixlib::format_error &error)
{
  rix.debug.eprint("format error:", error.what());
  return 1;
}
```

## Format CSV output messages

Formatting is useful when reporting CSV results:

```cpp id="atddyo"
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix\n");

  const auto message =
      rix.debug.format("loaded {} rows", table.size());

  rix.debug.print(message);

  return 0;
}
```

## Format Auth errors

Formatting can help create readable Auth diagnostics:

```cpp id="knlch7"
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();

  auto login = auth.login({
      "ada@example.com",
      "wrong-password"});

  if (login.failed())
  {
    const auto &error = login.error();

    const auto message =
        rix.debug.format(
            "auth error: {}: {}",
            rix.auth.error.to_string(error),
            error.message());

    rix.debug.eprint(message);
    return 1;
  }

  return 0;
}
```

Do not format or print authentication secrets in production.

Avoid printing:

```txt id="s1ikt4"
plain-text passwords
password hashes
session ids
raw token values
```

## Format PDF messages

Formatting is useful when reporting generated files:

```cpp id="x8yc6s"
#include <rix.hpp>

int main()
{
  auto saved = rix.pdf.make_text(
      "hello.pdf",
      "Hello from rix.pdf",
      "Rix PDF");

  if (saved.failed())
  {
    const auto message =
        rix.debug.format(
            "pdf error: {}: {}",
            rix.pdf.error.to_string(saved.error()),
            saved.error().message());

    rix.debug.eprint(message);
    return 1;
  }

  rix.debug.print(
      rix.debug.format("created: {}", "hello.pdf"));

  return 0;
}
```

## Use in a Vix project

Create a Vix application:

```bash id="dtlb84"
vix new debug-format --app
cd debug-format
```

Add Rix:

```bash id="s3ox7j"
vix add rix/rix
vix install
```

In `vix.app`, make sure Rix is listed under `deps`:

```txt id="itbg1h"
deps = [
  "rix/rix",
]
```

A small `vix.app` can look like this:

```txt id="qh8lbf"
name = "debug-format"
type = "executable"
standard = "c++20"
output_dir = "bin"

sources = [
  "src/main.cpp",
]

include_dirs = [
  "include",
  "src",
]

deps = [
  "rix/rix",
]

packages = [
  "vix",
]

links = [
  "vix::vix",
]
```

Then use formatting in `src/main.cpp`:

```cpp id="mnpgn7"
#include <rix.hpp>

int main()
{
  const auto message =
      rix.debug.format("Package: {}", "rix/debug");

  rix.debug.print(message);

  return 0;
}
```

Build and run:

```bash id="vc6st5"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments:

```bash id="zz1mzb"
vix run format.cpp
```

If Rix is installed globally for single-file usage:

```bash id="uqra0u"
vix install -g rix/rix
vix run format.cpp
```

For project usage, prefer:

```bash id="vwv04e"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="lcjd6x"
deps = [
  "rix/rix",
]
```

## Use only Debug with the facade

If you want the `rix.*` facade style but only want Debug mounted, define the feature macro before including `rix.hpp`:

```cpp id="tnqgg2"
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  const auto message =
      rix.debug.format("Hello, {}", "Rix");

  rix.debug.print(message);

  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Use the independent package

For independent usage, install:

```bash id="z8wv8e"
vix add rix/debug
vix install
```

In `vix.app`:

```txt id="lzewj6"
deps = [
  "rix/debug",
]
```

Then include the independent package header:

```cpp id="yo6psj"
#include <rix/debug.hpp>
```

Use this style when a project only needs Debug and does not need the full unified Rix facade.

For most application documentation, prefer:

```cpp id="oxx493"
#include <rix.hpp>
```

## Logging note

`rix.debug.format` creates strings.

It is useful for examples and local diagnostics.

For real application logs, prefer the Vix logging system.

Use this rule:

```txt id="qzoe9d"
rix.debug -> examples, local diagnostics, quick tools
Vix logging -> production logs, service logs, request logs
```

## Common mistakes

### Expecting `print` to replace placeholders

Wrong:

```cpp id="vq86yy"
rix.debug.print("Package: {}", "rix/debug");
```

Use `format`:

```cpp id="wcs4t2"
rix.debug.print(
    rix.debug.format("Package: {}", "rix/debug"));
```

### Mixing automatic and explicit placeholders

Wrong:

```cpp id="ocka42"
rix.debug.format("{} {0}", "Rix");
```

Use one style:

```cpp id="un7h9t"
rix.debug.format("{} {}", "Rix", "Debug");
```

or:

```cpp id="bzpcr2"
rix.debug.format("{0} {1}", "Rix", "Debug");
```

### Using unsupported format specifiers

Wrong:

```cpp id="ig68fk"
rix.debug.format("{:.2f}", 3.14159);
```

Use simple placeholders:

```cpp id="a80u3d"
rix.debug.format("value: {}", 3.14159);
```

### Forgetting escaped braces

Wrong:

```cpp id="tmze1j"
rix.debug.format("{ package } = {}", "rix/debug");
```

Use:

```cpp id="l6dwv0"
rix.debug.format("{{ package }} = {}", "rix/debug");
```

### Formatting secrets

Do not format or print:

```txt id="lqijj8"
plain-text passwords
password hashes
session ids
raw token values
```

This matters especially with `rix/auth`.

### Forgetting `deps`

For a Vix project, do not put Rix packages in `packages`.

Use:

```txt id="wkrhzt"
deps = [
  "rix/rix",
]
```

`packages` is for CMake package discovery.

`deps` is for Vix Registry packages.

## What you should remember

Format a string:

```cpp id="k4cgrw"
auto message = rix.debug.format("Hello, {}", "Rix");
```

Use automatic placeholders:

```cpp id="cpd33d"
rix.debug.format("{} uses {}", "Rix", "C++");
```

Use explicit placeholders:

```cpp id="xw9n68"
rix.debug.format("{0} + {0} = {1}", "C++", "Vix.cpp");
```

Escape braces:

```cpp id="bq56ej"
rix.debug.format("{{ package }} = {}", "rix/debug");
```

Append:

```cpp id="b8q2nq"
rix.debug.format.append(out, "{}", "debug");
```

Replace:

```cpp id="p7tkya"
rix.debug.format.to(out, "Package: {}", "rix/debug");
```

Use simple placeholders only.

For a Vix project, install Rix:

```bash id="ujuy60"
vix add rix/rix
vix install
```

and use:

```txt id="h7c5y2"
deps = [
  "rix/rix",
]
```

## Next step

Learn inspection.

Next: [Inspect](./inspect)
