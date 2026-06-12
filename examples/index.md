# Examples

This section contains practical Rix examples.

The examples use the public Rix facade:

```cpp
#include <rix.hpp>
```

and access packages through:

```cpp
rix.csv
rix.debug
rix.auth
rix.pdf
```

Rix examples are written to show how the packages are used from application code, not only how the internal package APIs are structured.

## What the examples cover

The examples are organized by package.

| Package     | What it shows                                                   |
| ----------- | --------------------------------------------------------------- |
| `rix/auth`  | Registration, login, password hashing, sessions, tokens         |
| `rix/csv`   | Parsing CSV text, writing CSV output, options                   |
| `rix/debug` | Printing, formatting, inspection, simple debugging helpers      |
| `rix/pdf`   | Creating PDF documents, text, tables, drawing, metadata, saving |

## Running examples

Most examples can be run as simple files:

```bash
vix run examples/auth/memory-register-login.cpp
```

If Rix is not available globally for single-file usage:

```bash
vix install -g rix/rix
vix run examples/auth/memory-register-login.cpp
```

For a Vix project, prefer project dependencies:

```bash
vix add rix/rix
vix install
```

and keep Rix in `vix.app`:

```txt
deps = [
  "rix/rix",
]
```

## Example style

The examples prefer the unified facade:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");
  return 0;
}
```

This style is used because it matches the public Rix API:

```txt
rix.<package>.<feature>
```

For example:

```cpp
rix.csv.parse(...)
rix.debug.print(...)
rix.auth.memory()
rix.pdf.document()
```

## Auth examples

The auth examples show the high-level authentication API through:

```cpp
rix.auth
```

Available examples:

- [Memory register and login](./auth/memory-register-login)
- [Password hashing](./auth/password-hash)
- [Session refresh and logout](./auth/session-refresh-logout)
- [Token issue](./auth/token-issue)

## CSV examples

The CSV examples show how to parse and write CSV data through:

```cpp
rix.csv
```

Typical usage:

```cpp
const auto table = rix.csv.parse("name,language\nAda,C++\n");
```

Continue with:

- [CSV examples](./csv)

## Debug examples

The debug examples show simple output helpers through:

```cpp
rix.debug
```

Common helpers:

```cpp
rix.debug.print(...)
rix.debug.eprint(...)
rix.debug.format(...)
rix.debug.inspect(...)
```

For logging in real Vix applications, prefer the Vix logging system.

Continue with:

- [Debug examples](./debug)

## PDF examples

The PDF examples show how to generate documents through:

```cpp
rix.pdf
```

Common helpers:

```cpp
rix.pdf.document()
rix.pdf.save(...)
rix.pdf.write(...)
rix.pdf.make_text(...)
```

Available examples:

- [Basic PDF](./pdf/basic)
- [Text](./pdf/text)
- [Tables](./pdf/table)
- [Drawing](./pdf/drawing)
- [Metadata](./pdf/metadata)
- [Make text](./pdf/make-text)
- [Error handling](./pdf/error-handling)

## Use examples in a project

Create a project:

```bash
vix new rix-examples --app
cd rix-examples
```

Add Rix:

```bash
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt
deps = [
  "rix/rix",
]
```

Then use the facade in `src/main.cpp`:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");

  const auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n");

  rix.debug.print("rows:", table.size());

  return 0;
}
```

Build and run:

```bash
vix build
vix run
```

## Single-file usage

For small examples and experiments, a single file is enough.

Create a file:

```bash
mkdir -p ~/rix-examples
cd ~/rix-examples
touch main.cpp
```

Add:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello from Rix");
  return 0;
}
```

Run:

```bash
vix run main.cpp
```

If needed, install Rix globally first:

```bash
vix install -g rix/rix
vix run main.cpp
```

## Facade-only examples

The examples normally use:

```cpp
#include <rix.hpp>
```

This mounts all available Rix packages by default.

If you want a lighter facade, define only the packages you need before including `rix.hpp`.

Example:

```cpp
#define RIX_ENABLE_CSV
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse("name\nAda\n");

  rix.debug.print("rows:", table.size());

  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Independent package examples

You can also use a package independently.

For example, with PDF only:

```bash
vix add rix/pdf
vix install
```

Then:

```cpp
#include <rix/pdf.hpp>

int main()
{
  auto pdf = rixlib::pdf::module();

  auto doc = pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix/pdf");

  return pdf.save(doc, "hello.pdf").ok() ? 0 : 1;
}
```

For most examples in this documentation, prefer the unified facade:

```cpp
#include <rix.hpp>
```

## Common mistakes

### Forgetting to install Rix

If the compiler cannot find `rix.hpp`, install the package first.

For a project:

```bash
vix add rix/rix
vix install
```

For single-file usage:

```bash
vix install -g rix/rix
```

### Putting Rix packages in `packages`

Wrong:

```txt
packages = [
  "rix/rix",
]
```

Correct:

```txt
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Using internal package APIs first

The examples prefer:

```cpp
rix.auth.memory()
rix.pdf.document()
rix.csv.parse(...)
rix.debug.print(...)
```

Use direct package headers only when you intentionally want independent package usage.

### Ignoring explicit errors

Packages such as `rix/auth` and `rix/pdf` return explicit results or statuses.

Check failures before using values:

```cpp
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

## What you should remember

Use the public facade:

```cpp
#include <rix.hpp>
```

Use packages through:

```cpp
rix.csv
rix.debug
rix.auth
rix.pdf
```

For project usage:

```bash
vix add rix/rix
vix install
```

and:

```txt
deps = [
  "rix/rix",
]
```

For single-file usage:

```bash
vix install -g rix/rix
vix run main.cpp
```

## Next step

Start with the auth examples.

Next: [Memory register and login](./auth/memory-register-login)
