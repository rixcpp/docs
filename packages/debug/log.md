# Log

This page explains the logging helper exposed by `rix/debug`.

The examples use the public Rix facade:

```cpp id="m7x2sq"
#include <rix.hpp>
```

and access the debug logger through:

```cpp id="gq81va"
rix.debug.log
```

Important:

`rix.debug.log` is a small development helper.

For real application logging, prefer the Vix logging system.

```txt id="z5f7xu"
rix.debug.log -> examples, quick tools, local diagnostics
vix::log      -> application logs, production logs, service diagnostics
```

## When to use `rix.debug.log`

Use `rix.debug.log` when you need a small formatted log-like output in examples or local tools.

It is useful for:

```txt id="fca7nn"
documentation examples
small command-line demos
local diagnostics
quick package tests
development-only output
```

Do not treat it as the main production logging API.

For Vix.cpp applications, prefer `vix::log`.

## Basic example

Create a file:

```bash id="dlm3o8"
mkdir -p ~/rix-debug-log
cd ~/rix-debug-log
touch log.cpp
```

Add:

```cpp id="qpc2gy"
#include <rix.hpp>

int main()
{
  rix.debug.log("loaded {} rows", 3);
  rix.debug.log.info("package {} is ready", "rix/debug");
  rix.debug.log.warn("slow path: {}", "csv import");
  rix.debug.log.error("failed to open {}", "missing.csv");

  return 0;
}
```

Run it:

```bash id="zwg0fd"
vix run log.cpp
```

If Rix is not available yet for single-file usage:

```bash id="v4e8im"
vix install -g rix/rix
vix run log.cpp
```

## Expected output

The output should look similar to this:

```txt id="ot56mi"
[debug] loaded 3 rows
[info] package rix/debug is ready
[warn] slow path: csv import
[error] failed to open missing.csv
```

The `error` level writes to stderr.

The other levels write to stdout.

## Default debug log

Calling `rix.debug.log(...)` writes a debug-level message:

```cpp id="kr2vrg"
rix.debug.log("loaded {} rows", 3);
```

Output:

```txt id="r4uoeu"
[debug] loaded 3 rows
```

Use this for local diagnostics.

## Info logs

Use:

```cpp id="k7hnlo"
rix.debug.log.info(...)
```

Example:

```cpp id="vz9r3a"
rix.debug.log.info("package {} is ready", "rix/debug");
```

Output:

```txt id="h1bgva"
[info] package rix/debug is ready
```

Use `info` for simple status messages in examples.

## Warning logs

Use:

```cpp id="jv9ca4"
rix.debug.log.warn(...)
```

Example:

```cpp id="qa2loo"
rix.debug.log.warn("slow path: {}", "csv import");
```

Output:

```txt id="p04j2t"
[warn] slow path: csv import
```

Use `warn` for local warnings.

## Error logs

Use:

```cpp id="z93nqu"
rix.debug.log.error(...)
```

Example:

```cpp id="f1h6i3"
rix.debug.log.error("failed to open {}", "missing.csv");
```

Output shape:

```txt id="y0dsuz"
[error] failed to open missing.csv
```

`error` writes to stderr.

## Formatting

`rix.debug.log` uses the same simple placeholder format as `rix.debug.format`.

Supported placeholders:

```txt id="wpx6ca"
{}      automatic argument indexing
{0}     explicit positional indexing
{{      escaped opening brace
}}      escaped closing brace
```

Example:

```cpp id="zytfq9"
rix.debug.log.info(
    "{0} builds on {1}",
    "Rix",
    "Vix.cpp");
```

Output:

```txt id="kgap92"
[info] Rix builds on Vix.cpp
```

## Do not mix placeholder styles

Wrong:

```cpp id="ha30l4"
rix.debug.log("{} {0}", "Rix");
```

Use automatic placeholders:

```cpp id="cjt9nr"
rix.debug.log("{} {}", "Rix", "Debug");
```

or explicit placeholders:

```cpp id="m1q6zp"
rix.debug.log("{0} {1}", "Rix", "Debug");
```

## Unsupported format specifiers

`rix.debug.log` does not support advanced format specifiers.

Wrong:

```cpp id="jyknd4"
rix.debug.log("value: {:.2f}", 3.14159);
```

Use simple placeholders:

```cpp id="gjay4h"
rix.debug.log("value: {}", 3.14159);
```

For advanced formatting, use another formatting tool or format the value before logging.

## Use `vix::log` for applications

For real Vix.cpp applications, prefer Vix logging.

Use Vix logging for:

```txt id="dw4op6"
HTTP request logs
service startup logs
deployment diagnostics
production logs
structured application logs
runtime observability
```

Use `rix.debug.log` only when you need a small helper for examples or local diagnostics.

A good rule:

```txt id="pn89ex"
If the message belongs to the running application, use vix::log.
If the message belongs to a small example, rix.debug.log is acceptable.
```

## Example with CSV

`rix.debug.log` can be useful in a small CSV example:

```cpp id="ohxu3q"
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix\n");

  rix.debug.log("loaded {} rows", table.size());

  for (const auto &row : table)
  {
    rix.debug.log.info("row has {} fields", row.size());
  }

  return 0;
}
```

Run:

```bash id="d7amb4"
vix run log.cpp
```

## Example with Auth errors

For Auth examples, `rix.debug.log.error` can show failures:

```cpp id="jvdv6j"
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

    rix.debug.log.error(
        "auth error: {}: {}",
        rix.auth.error.to_string(error),
        error.message());

    return 1;
  }

  return 0;
}
```

Do not log authentication secrets.

Avoid logging:

```txt id="q5hsp7"
plain-text passwords
password hashes
session ids
raw token values
```

## Example with PDF generation

`rix.debug.log` can report whether a PDF was created:

```cpp id="mhgacp"
#include <rix.hpp>

int main()
{
  auto saved = rix.pdf.make_text(
      "hello.pdf",
      "Hello from rix.pdf",
      "Rix PDF");

  if (saved.failed())
  {
    rix.debug.log.error(
        "pdf error: {}: {}",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.log.info("created {}", "hello.pdf");

  return 0;
}
```

## Prefer `rix.debug.print` for simple examples

For many documentation examples, `rix.debug.print` is enough:

```cpp id="hf61a1"
rix.debug.print("created:", "hello.pdf");
```

Use `rix.debug.log` only when the level prefix is useful:

```cpp id="bin09i"
rix.debug.log.info("created {}", "hello.pdf");
```

For simple output:

```txt id="sj3ab6"
rix.debug.print -> simpler
rix.debug.log   -> level-prefixed
```

## Use in a Vix project

Create a Vix application:

```bash id="q18tl4"
vix new debug-log --app
cd debug-log
```

Add Rix:

```bash id="f37ux7"
vix add rix/rix
vix install
```

In `vix.app`, make sure Rix is listed under `deps`:

```txt id="fdcb57"
deps = [
  "rix/rix",
]
```

A small `vix.app` can look like this:

```txt id="t45wrp"
name = "debug-log"
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

Then use the debug logger in `src/main.cpp`:

```cpp id="b6djcq"
#include <rix.hpp>

int main()
{
  rix.debug.log.info("package {} is ready", "rix/debug");
  return 0;
}
```

Build and run:

```bash id="dq1bsy"
vix build
vix run
```

For a real Vix application, move application logs to the Vix logging system.

## Single-file usage

For small scripts, examples, and experiments:

```bash id="xgzyx2"
vix run log.cpp
```

If Rix is installed globally for single-file usage:

```bash id="avq31k"
vix install -g rix/rix
vix run log.cpp
```

For project usage, prefer:

```bash id="ver37h"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="fd4n83"
deps = [
  "rix/rix",
]
```

## Use only Debug with the facade

If you want the `rix.*` facade style but only want Debug mounted, define the feature macro before including `rix.hpp`:

```cpp id="n7o8m3"
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  rix.debug.log.info("Hello from {}", "rix/debug");
  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Use the independent package

For independent usage, install:

```bash id="h8s8xj"
vix add rix/debug
vix install
```

In `vix.app`:

```txt id="bozk9g"
deps = [
  "rix/debug",
]
```

Then include the independent package header:

```cpp id="gz2f0q"
#include <rix/debug.hpp>
```

Use this style when a project only needs Debug and does not need the full unified Rix facade.

For most application documentation, prefer:

```cpp id="jcq3oi"
#include <rix.hpp>
```

## Common mistakes

### Using `rix.debug.log` as production logging

`rix.debug.log` is a development helper.

For deployed applications, prefer Vix logging.

### Logging secrets

Do not log:

```txt id="c62a13"
plain-text passwords
password hashes
session ids
raw token values
private keys
API tokens
```

This matters especially when using `rix/auth`.

### Expecting advanced format specifiers

Wrong:

```cpp id="t74i2g"
rix.debug.log.info("price: {:.2f}", 12.5);
```

Use simple placeholders:

```cpp id="n3p6o4"
rix.debug.log.info("price: {}", 12.5);
```

### Mixing automatic and explicit placeholders

Wrong:

```cpp id="wj985n"
rix.debug.log.info("{} {0}", "Rix");
```

Use one placeholder style per message.

### Forgetting `deps`

For a Vix project, do not put Rix packages in `packages`.

Use:

```txt id="nvgaje"
deps = [
  "rix/rix",
]
```

`packages` is for CMake package discovery.

`deps` is for Vix Registry packages.

## What you should remember

Use debug log for local examples:

```cpp id="na9v33"
rix.debug.log("loaded {} rows", 3);
```

Use levels:

```cpp id="s7q3n8"
rix.debug.log.info("ready: {}", true);
rix.debug.log.warn("slow path: {}", "import");
rix.debug.log.error("failed: {}", "missing file");
```

Use simple placeholders only.

Do not log secrets.

Prefer Vix logging for real application logs:

```txt id="e2n5qs"
rix.debug.log -> development helper
vix::log      -> application logging
```

For a Vix project, install Rix:

```bash id="n6g2un"
vix add rix/rix
vix install
```

and use:

```txt id="h3wkfo"
deps = [
  "rix/rix",
]
```

## Next step

Learn inspection.

Next: [Inspect](./inspect)
