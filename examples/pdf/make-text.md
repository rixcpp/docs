# Make Text

This example shows how to generate a simple text PDF with `rix.pdf.make_text`.

The example uses the public Rix facade:

```cpp id="q8m4xa"
#include <rix.hpp>
```

and accesses PDF through:

```cpp id="n5v9qc"
rix.pdf
```

Use this example when you only need a quick PDF with a title and plain text content.

## Create the file

```bash id="k7x2ma"
mkdir -p ~/rix-pdf-make-text-example
cd ~/rix-pdf-make-text-example
touch make_text.cpp
```

Add:

```cpp id="p9c5xr"
#include <rix.hpp>

int main()
{
  auto saved = rix.pdf.make_text(
      "rix_pdf_make_text.pdf",
      "This file was generated with the high-level rix.pdf.make_text helper.",
      "Rix PDF");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "rix_pdf_make_text.pdf");
  return 0;
}
```

Run it:

```bash id="q4m8vb"
vix run make_text.cpp
```

If Rix is not available yet for single-file usage:

```bash id="x2n7pd"
vix install -g rix/rix
vix run make_text.cpp
```

This creates:

```txt id="t8q5hm"
rix_pdf_make_text.pdf
```

## What this example does

The example calls:

```cpp id="b6x3rd"
rix.pdf.make_text(...)
```

`make_text` creates a document, adds a page, writes the title and text content, and saves the PDF file.

It is the shortest PDF workflow in `rix/pdf`.

## Function shape

Use:

```cpp id="z5v8ka"
auto saved = rix.pdf.make_text(
    "output.pdf",
    "Text content",
    "Optional title");
```

The arguments are:

```txt id="c9q2mx"
output file path
text content
optional title
```

The result is a PDF status.

## Save path

The first argument is the output file path:

```cpp id="h7n4qc"
"rix_pdf_make_text.pdf"
```

The path must not be empty.

If the file is inside a folder, the folder must already exist.

Example:

```bash id="d3x8vp"
mkdir -p output
```

Then:

```cpp id="j2m9wa"
auto saved = rix.pdf.make_text(
    "output/hello.pdf",
    "Hello from rix.pdf",
    "Rix PDF");
```

## Text content

The second argument is the content written inside the PDF:

```cpp id="w8c5nr"
"This file was generated with the high-level rix.pdf.make_text helper."
```

Use it for short plain-text content.

For complex layout, use `rix.pdf.document()` instead.

## Optional title

The third argument is optional:

```cpp id="k5v7ma"
"Rix PDF"
```

When provided, it is used as the document title and visible heading.

You can also call `make_text` without a title:

```cpp id="r6q9xd"
auto saved = rix.pdf.make_text(
    "hello.pdf",
    "Hello from rix.pdf");
```

## Check errors

`make_text` returns a status.

Always check it:

```cpp id="p2n8fc"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

On success:

```cpp id="y4m6qv"
rix.debug.print("created:", "rix_pdf_make_text.pdf");
```

## Complete minimal example

```cpp id="f9x3ka"
#include <rix.hpp>

int main()
{
  auto saved = rix.pdf.make_text(
      "hello.pdf",
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

  rix.debug.print("created:", "hello.pdf");
  return 0;
}
```

Run:

```bash id="m7c5vx"
vix run make_text.cpp
```

## Without a title

```cpp id="q3p8za"
#include <rix.hpp>

int main()
{
  auto saved = rix.pdf.make_text(
      "plain.pdf",
      "This PDF has text content without a visible title.");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "plain.pdf");
  return 0;
}
```

Run:

```bash id="v8n2hr"
vix run make_text.cpp
```

## With a title

```cpp id="a6q9mx"
#include <rix.hpp>

int main()
{
  auto saved = rix.pdf.make_text(
      "with-title.pdf",
      "This PDF includes a title and body text.",
      "Generated Text PDF");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "with-title.pdf");
  return 0;
}
```

The title is used for metadata and visible content.

## When to use `make_text`

Use `make_text` when you need:

```txt id="r4v8kb"
a quick text-only PDF
a small generated note
a simple export
a small report summary
a minimal example
```

It is useful when the document does not need custom layout.

## When not to use `make_text`

Use `rix.pdf.document()` when you need:

```txt id="x9m2pd"
multiple pages
tables
drawings
images
custom metadata
custom text styles
manual positioning
several sections
```

Example:

```cpp id="c5w9qa"
auto doc = rix.pdf.document();

auto &page = doc.add_page();

page.heading(
    page.x_left(),
    page.y_top(),
    "Custom PDF",
    1);

auto saved = rix.pdf.save(doc, "custom.pdf");
```

## `make_text` vs `document`

`make_text` is short:

```cpp id="z8q2vm"
auto saved = rix.pdf.make_text(
    "hello.pdf",
    "Hello from rix.pdf",
    "Rix PDF");
```

`document` gives more control:

```cpp id="n7x4hd"
auto doc = rix.pdf.document();

doc.set_title("Rix PDF");

auto &page = doc.add_page();

page.heading(
    page.x_left(),
    page.y_top(),
    "Rix PDF",
    1);

page.paragraph(
    page.x_left(),
    page.y_top() - 50.0F,
    page.content_width(),
    "Hello from rix.pdf");

auto saved = rix.pdf.save(doc, "hello.pdf");
```

Choose `make_text` for speed.

Choose `document` for layout control.

## Error example

An empty path fails:

```cpp id="d6k8rc"
#include <rix.hpp>

int main()
{
  auto saved = rix.pdf.make_text(
      "",
      "This should fail.",
      "Invalid path");

  if (saved.failed())
  {
    rix.debug.eprint(
        "expected pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 0;
  }

  return 1;
}
```

Run:

```bash id="g5m9xq"
vix run make_text.cpp
```

The failure is expected because the output path is empty.

## Missing folder example

This can fail if `output/` does not exist:

```cpp id="y3v8mb"
auto saved = rix.pdf.make_text(
    "output/hello.pdf",
    "Hello from rix.pdf",
    "Rix PDF");
```

Create the folder first:

```bash id="f4q7vd"
mkdir -p output
```

Then run again.

## Use in a Vix project

Create a project:

```bash id="w2x6qp"
vix new rix-pdf-make-text --app
cd rix-pdf-make-text
```

Add Rix:

```bash id="n6c9hd"
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt id="j8q5kc"
deps = [
  "rix/rix",
]
```

A minimal `vix.app` can look like this:

```txt id="r7x3vm"
name = "rix-pdf-make-text"
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

```txt id="p6m8xb"
src/main.cpp
```

Build and run:

```bash id="t9q2za"
vix build
vix run
```

## Single-file usage

For examples, tests, and quick experiments:

```bash id="x4v7nd"
vix run make_text.cpp
```

If needed:

```bash id="p4q8zb"
vix install -g rix/rix
vix run make_text.cpp
```

For project usage, prefer:

```bash id="v2k9qc"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="c8w5rp"
deps = [
  "rix/rix",
]
```

## Use only PDF with the facade

If you want the `rix.*` facade style but only want PDF mounted, define the feature macro before including `rix.hpp`:

```cpp id="z4v8qa"
#define RIX_ENABLE_PDF
#include <rix.hpp>

int main()
{
  auto saved = rix.pdf.make_text(
      "hello.pdf",
      "Hello from rix.pdf",
      "Rix PDF");

  return saved.ok() ? 0 : 1;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

If you also want debug output:

```cpp id="q8k5mv"
#define RIX_ENABLE_PDF
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  auto saved = rix.pdf.make_text(
      "hello.pdf",
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

  rix.debug.print("created:", "hello.pdf");
  return 0;
}
```

## Use the independent package

For independent usage, install:

```bash id="s6n4vm"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="v8q3md"
deps = [
  "rix/pdf",
]
```

Then include:

```cpp id="h5v8qp"
#include <rix/pdf.hpp>
```

Example:

```cpp id="d9m5qx"
#include <rix/pdf.hpp>

int main()
{
  auto pdf = rixlib::pdf::module();

  auto saved = pdf.make_text(
      "hello.pdf",
      "Hello from rix/pdf",
      "Rix PDF");

  return saved.ok() ? 0 : 1;
}
```

The examples in this documentation prefer the public facade:

```cpp id="m8x2vc"
#include <rix.hpp>
```

and:

```cpp id="a2r7kb"
rix.pdf
```

## Common mistakes

### Forgetting to install Rix

If `rix.hpp` is not found, install Rix first.

For a project:

```bash id="c8n3vy"
vix add rix/rix
vix install
```

For single-file usage:

```bash id="n6x9qa"
vix install -g rix/rix
```

### Putting Rix in `packages`

Wrong:

```txt id="y5q2md"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="b4v8qc"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Using `make_text` for complex layout

`make_text` is for simple text PDFs.

For layout, tables, drawings, or custom styles, use:

```cpp id="p3x7rn"
auto doc = rix.pdf.document();
```

### Saving to an empty path

This fails:

```cpp id="h9n2ka"
rix.pdf.make_text(
    "",
    "Hello",
    "Rix PDF");
```

Use a real path:

```cpp id="q6v8mx"
rix.pdf.make_text(
    "hello.pdf",
    "Hello",
    "Rix PDF");
```

### Saving to a missing folder

This can fail:

```cpp id="t5c8vp"
rix.pdf.make_text(
    "output/hello.pdf",
    "Hello",
    "Rix PDF");
```

Create the folder first:

```bash id="r8q5wc"
mkdir -p output
```

### Not checking save errors

Wrong:

```cpp id="x4m9vd"
rix.pdf.make_text(
    "hello.pdf",
    "Hello",
    "Rix PDF");
```

Correct:

```cpp id="f7q3ma"
auto saved = rix.pdf.make_text(
    "hello.pdf",
    "Hello",
    "Rix PDF");

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

Use `make_text` for a simple text PDF:

```cpp id="n9x2qc"
auto saved = rix.pdf.make_text(
    "hello.pdf",
    "Hello from rix.pdf",
    "Rix PDF");
```

Check errors:

```cpp id="c5v8na"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());
}
```

Use `document()` for custom layout:

```cpp id="m6q4rd"
auto doc = rix.pdf.document();
```

For project usage:

```bash id="v2k8xm"
vix add rix/rix
vix install
```

and keep:

```txt id="q9c5rd"
deps = [
  "rix/rix",
]
```

## Next step

Continue with PDF error handling.

Next: [Error handling](./error-handling)
