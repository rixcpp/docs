# Inspect

This page explains the inspection helper provided by `rix/debug`.

The examples use the public Rix facade:

```cpp id="p4m7xq"
#include <rix.hpp>
```

and access inspection through:

```cpp id="v5d9ra"
rix.debug.inspect
```

Inspection is useful when you want a clearer development-time view of a value while writing examples, debugging small tools, or checking package behavior.

For production application logs, prefer the Vix logging system.

## Basic example

Create a file:

```bash id="q3f8ad"
mkdir -p ~/rix-debug-inspect
cd ~/rix-debug-inspect
touch inspect.cpp
```

Add:

```cpp id="ck9j3t"
#include <rix.hpp>

#include <string>

int main()
{
  const std::string package = "rix/debug";

  rix.debug.print("normal print:");
  rix.debug.print(package);

  rix.debug.print("----------------------------------------");
  rix.debug.print("inspect:");
  rix.debug.inspect(package);

  return 0;
}
```

Run it:

```bash id="m7b5lo"
vix run inspect.cpp
```

If Rix is not available yet for single-file usage:

```bash id="v2q9em"
vix install -g rix/rix
vix run inspect.cpp
```

## Expected output

The normal print output should look like this:

```txt id="t3ew2p"
normal print:
rix/debug
----------------------------------------
inspect:
```

The exact inspection output depends on the inspected value and the debug renderer.

## `rix.debug.inspect`

Use:

```cpp id="d5kr1s"
rix.debug.inspect(value);
```

Example:

```cpp id="r2evg7"
std::string package = "rix/debug";

rix.debug.inspect(package);
```

Use inspection when you want to see a value during development.

## Inspect strings

```cpp id="oc8g2n"
std::string name = "Ada";

rix.debug.inspect(name);
```

Inspection is useful when you want output that makes the value clearer than a normal print.

For normal user-facing output, use:

```cpp id="u0sl46"
rix.debug.print(name);
```

## Inspect numbers

```cpp id="m8nn67"
int rows = 3;
double ratio = 1.5;

rix.debug.inspect(rows);
rix.debug.inspect(ratio);
```

Use this while checking local values.

## Inspect booleans

```cpp id="h5hvqp"
bool ready = true;
bool failed = false;

rix.debug.inspect(ready);
rix.debug.inspect(failed);
```

This is useful in small examples and tests.

## Inspect formatted strings

Inspection works well with formatted output:

```cpp id="vo8bhq"
const auto message =
    rix.debug.format("Package: {}", "rix/debug");

rix.debug.inspect(message);
```

Use `format` to build the string.

Use `inspect` to view it during development.

## Inspect print-style strings

You can also inspect a string created with `sprint`:

```cpp id="ihf0lf"
const auto line =
    rix.debug.sprint("rows:", 3);

rix.debug.inspect(line);
```

`sprint` creates a string using the same rendering style as `print`.

`inspect` displays the value.

## Inspect CSV data

Inspection can help when checking parsed CSV values.

```cpp id="l6oc4z"
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix\n");

  rix.debug.print("rows:", table.size());

  if (!table.empty())
  {
    rix.debug.inspect(table[0][0]);
  }

  return 0;
}
```

For full table output, a normal loop is often clearer:

```cpp id="lflfdu"
for (const auto &row : table)
{
  for (const auto &field : row)
  {
    rix.debug.print(field);
  }
}
```

## Inspect Auth values carefully

Inspection can help while developing Auth examples, but avoid sensitive values.

Safe examples:

```cpp id="n4sitg"
auto auth = rix.auth.memory();

auto registered = auth.register_user({
    "ada@example.com",
    "correct-password"});

if (registered.ok())
{
  rix.debug.inspect(registered.value().email());
}
```

Avoid inspecting or printing:

```txt id="i1q7qc"
plain-text passwords
password hashes
session ids
raw token values
```

This matters especially in production, logs, screenshots, examples, and issue reports.

## Inspect Auth errors

Errors are safer to inspect than secrets.

Example:

```cpp id="l2t6lb"
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

    rix.debug.eprint(
        "auth error:",
        rix.auth.error.to_string(error),
        error.message());

    return 1;
  }

  return 0;
}
```

For Auth errors, `eprint` is usually clearer than `inspect`.

## Inspect PDF results

Inspection can be useful when checking PDF metadata or generated messages.

```cpp id="dy6oq9"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Rix PDF Inspect Example");

  rix.debug.inspect(doc.metadata().title());

  auto saved = rix.pdf.make_text(
      "inspect.pdf",
      "Hello from rix.pdf",
      "Rix PDF");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "inspect.pdf");

  return 0;
}
```

## `inspect` vs `print`

Use `print` for simple output:

```cpp id="j2ko41"
rix.debug.print("package:", "rix/debug");
```

Use `inspect` when you want to examine a value while developing:

```cpp id="d8e2ic"
rix.debug.inspect(package);
```

A simple rule:

```txt id="r44irs"
print   -> output a message
inspect -> examine a value
```

## `inspect` vs `format`

Use `format` to build text:

```cpp id="sqfitv"
const auto message =
    rix.debug.format("Package: {}", "rix/debug");
```

Use `inspect` to view a value:

```cpp id="c2y73a"
rix.debug.inspect(message);
```

They solve different problems.

## Complete example

```cpp id="j7vi9a"
#include <rix.hpp>

#include <string>

int main()
{
  const std::string package = "rix/debug";

  const auto formatted =
      rix.debug.format("Package: {}", package);

  const auto printed =
      rix.debug.sprint("Debug package:", package);

  rix.debug.print("normal output:");
  rix.debug.print(formatted);

  rix.debug.print("----------------------------------------");
  rix.debug.print("inspected values:");
  rix.debug.inspect(package);
  rix.debug.inspect(formatted);
  rix.debug.inspect(printed);

  return 0;
}
```

Run:

```bash id="i7f8f1"
vix run inspect.cpp
```

## Use in a Vix project

Create a Vix application:

```bash id="m5a9xj"
vix new debug-inspect --app
cd debug-inspect
```

Add Rix:

```bash id="z5hi4g"
vix add rix/rix
vix install
```

In `vix.app`, make sure Rix is listed under `deps`:

```txt id="drd7sc"
deps = [
  "rix/rix",
]
```

A small `vix.app` can look like this:

```txt id="k9h5mv"
name = "debug-inspect"
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

Then use inspection in `src/main.cpp`:

```cpp id="d4av7n"
#include <rix.hpp>

#include <string>

int main()
{
  const std::string package = "rix/debug";

  rix.debug.inspect(package);

  return 0;
}
```

Build and run:

```bash id="ykz3j7"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments:

```bash id="htn2gk"
vix run inspect.cpp
```

If Rix is installed globally for single-file usage:

```bash id="tmq67x"
vix install -g rix/rix
vix run inspect.cpp
```

For project usage, prefer:

```bash id="zbr3d2"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="stjb34"
deps = [
  "rix/rix",
]
```

## Use only Debug with the facade

If you want the `rix.*` facade style but only want Debug mounted, define the feature macro before including `rix.hpp`:

```cpp id="vpbqy7"
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

#include <string>

int main()
{
  std::string package = "rix/debug";

  rix.debug.inspect(package);

  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Use the independent package

For independent usage, install:

```bash id="cbgvha"
vix add rix/debug
vix install
```

In `vix.app`:

```txt id="mfeh2b"
deps = [
  "rix/debug",
]
```

Then include the independent package header:

```cpp id="go0u14"
#include <rix/debug.hpp>
```

Use this style when a project only needs Debug and does not need the full unified Rix facade.

For most application documentation, prefer:

```cpp id="d3c3ch"
#include <rix.hpp>
```

## Logging note

`rix.debug.inspect` is for development-time inspection.

It is not production logging.

For real application logs, prefer the Vix logging system.

Use this rule:

```txt id="yc1k82"
rix.debug.inspect -> examine values during development
Vix logging       -> application logs and runtime observability
```

## Common mistakes

### Using inspection as production logging

`inspect` is useful during development.

For deployed applications, prefer Vix logging.

### Inspecting secrets

Do not inspect:

```txt id="pae8n9"
plain-text passwords
password hashes
session ids
raw token values
private keys
API tokens
```

This matters especially with `rix/auth`.

### Expecting `inspect` to format messages

`inspect` examines one value.

For messages, use `print` or `format`.

```cpp id="lfm61t"
rix.debug.print("package:", "rix/debug");

const auto message =
    rix.debug.format("package: {}", "rix/debug");
```

### Forgetting `deps`

For a Vix project, do not put Rix packages in `packages`.

Use:

```txt id="m1qc80"
deps = [
  "rix/rix",
]
```

`packages` is for CMake package discovery.

`deps` is for Vix Registry packages.

## What you should remember

Inspect a value:

```cpp id="mz2h42"
rix.debug.inspect(value);
```

Use `print` for normal output:

```cpp id="isucqn"
rix.debug.print("package:", "rix/debug");
```

Use `format` to build strings:

```cpp id="rppwir"
auto message = rix.debug.format("Package: {}", "rix/debug");
```

Use inspection for development, examples, and local diagnostics.

Do not inspect secrets.

Prefer Vix logging for real application logs.

For a Vix project, install Rix:

```bash id="bx8uza"
vix add rix/rix
vix install
```

and use:

```txt id="yll733"
deps = [
  "rix/rix",
]
```

## Next step

Continue with the debug API reference.

Next: [API Reference](./api-reference)
