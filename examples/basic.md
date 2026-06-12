# Basic Example

This page shows a small Rix example using the public facade.

The example uses:

```cpp
#include <rix.hpp>
```

and accesses packages through:

```cpp
rix.debug
rix.csv
rix.pdf
```

The goal is to show the normal Rix style in one small file.

## Create the file

```bash
mkdir -p ~/rix-basic-example
cd ~/rix-basic-example
touch basic.cpp
```

Add:

```cpp
#include <rix.hpp>

int main()
{
  rix.debug.print("== Rix basic example ==");

  const auto table = rix.csv.parse(
      "name,language,project\n"
      "Ada,C++,Rix\n"
      "Gaspard,C++,Vix.cpp\n");

  rix.debug.print("rows:", table.size());

  auto doc = rix.pdf.document();

  doc.set_title("Rix Basic Example")
      .set_author("Rix");

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Rix Basic Example",
      1);

  y -= 20.0F;

  page.paragraph(
      page.x_left(),
      y,
      page.content_width(),
      "This PDF was generated from a small C++ program using the Rix facade.");

  auto saved = rix.pdf.save(doc, "basic.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "basic.pdf");
  return 0;
}
```

Run it:

```bash
vix run basic.cpp
```

If Rix is not available yet for single-file usage:

```bash
vix install -g rix/rix
vix run basic.cpp
```

This creates:

```txt
basic.pdf
```

## What this example does

The example uses `rix.debug` to print messages:

```cpp
rix.debug.print("== Rix basic example ==");
```

It uses `rix.csv` to parse CSV text:

```cpp
const auto table = rix.csv.parse(
    "name,language,project\n"
    "Ada,C++,Rix\n"
    "Gaspard,C++,Vix.cpp\n");
```

It uses `rix.pdf` to create a PDF document:

```cpp
auto doc = rix.pdf.document();
```

It saves the PDF with:

```cpp
auto saved = rix.pdf.save(doc, "basic.pdf");
```

## Use in a Vix project

Create a project:

```bash
vix new rix-basic --app
cd rix-basic
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

A minimal `vix.app` can look like this:

```txt
name = "rix-basic"
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

Put the example code in:

```txt
src/main.cpp
```

Build and run:

```bash
vix build
vix run
```

## Single-file usage

For examples, tests, and quick experiments, a single file is enough:

```bash
vix run basic.cpp
```

If needed:

```bash
vix install -g rix/rix
vix run basic.cpp
```

## Facade usage

The public Rix facade gives one entry point:

```cpp
rix
```

Packages are mounted as members:

```cpp
rix.csv
rix.debug
rix.auth
rix.pdf
```

This keeps examples simple:

```cpp
rix.debug.print("Hello from Rix");

auto doc = rix.pdf.document();

const auto table = rix.csv.parse("name\nAda\n");
```

## Use only selected packages

If you want a lighter facade, define feature macros before including `rix.hpp`.

Example:

```cpp
#define RIX_ENABLE_CSV
#define RIX_ENABLE_DEBUG
#define RIX_ENABLE_PDF
#include <rix.hpp>

int main()
{
  rix.debug.print("selected Rix packages");

  const auto table = rix.csv.parse("name\nAda\n");

  auto doc = rix.pdf.document();

  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Independent package usage

The examples normally use:

```cpp
#include <rix.hpp>
```

You can also use packages independently.

For PDF only:

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

For most application examples, prefer the unified facade.

## Common mistakes

### Forgetting to install Rix

If `rix.hpp` is not found, install Rix first.

For a project:

```bash
vix add rix/rix
vix install
```

For single-file usage:

```bash
vix install -g rix/rix
```

### Putting Rix in `packages`

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

### Calling `value()` before checking errors

For result-based APIs, check first:

```cpp
auto saved = rix.pdf.save(doc, "basic.pdf");

if (saved.failed())
{
  return 1;
}
```

Do not ignore failures when saving files, writing PDFs, loading images, or using auth operations.

## What you should remember

Use the facade:

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

Run a simple file:

```bash
vix run basic.cpp
```

For project usage:

```bash
vix add rix/rix
vix install
```

and keep:

```txt
deps = [
  "rix/rix",
]
```

## Next step

Continue with the auth examples.

Next: [Memory register and login](./auth/memory-register-login)
