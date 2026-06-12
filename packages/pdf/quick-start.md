# PDF Quick Start

This page shows the fastest way to create a PDF file with `rix/pdf`.

The examples use the public Rix facade:

```cpp id="q6s3ve"
#include <rix.hpp>
```

and access PDF through:

```cpp id="n9b4xm"
rix.pdf
```

`rix/pdf` is useful when a Vix.cpp or Rix project needs to generate simple PDF documents, reports, tables, or text files from C++.

## What you will build

You will create a small C++ file that:

```txt id="w5m0qa"
creates a PDF document
adds one page
writes text
saves the document to disk
checks save errors
runs with vix run
```

The output file will be:

```txt id="s2am8p"
hello.pdf
```

## Create a working folder

Create a small folder in your home directory:

```bash id="uw6r2y"
mkdir -p ~/rix-pdf-quick-start
cd ~/rix-pdf-quick-start
touch pdf.cpp
```

## Add the example

Open:

```txt id="p2s8xn"
pdf.cpp
```

Add:

```cpp id="n2m5yf"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix.pdf");

  page.text(
      page.x_left(),
      page.y_top() - 30.0F,
      "This PDF was generated through the unified Rix facade.");

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

## Run the file

Run:

```bash id="v23xqh"
vix run pdf.cpp
```

If Rix is not available yet for single-file usage:

```bash id="z8pr5n"
vix install -g rix/rix
vix run pdf.cpp
```

## Expected output

The terminal output should look like this:

```txt id="t1m7zp"
created: hello.pdf
```

The folder should now contain:

```txt id="x6hq0k"
pdf.cpp
hello.pdf
```

Open `hello.pdf` with your normal PDF viewer.

## Create a document

The first step is to create a document:

```cpp id="k0v9dr"
auto doc = rix.pdf.document();
```

A document owns pages and metadata.

It does not write itself to disk automatically.

You save it later with:

```cpp id="n7w4ob"
rix.pdf.save(doc, "hello.pdf");
```

## Add a page

Add a page with:

```cpp id="d1t9nc"
auto &page = doc.add_page();
```

The returned page is the drawing surface.

You use it to add text, paragraphs, headings, tables, drawings, and images.

## Write text

Use:

```cpp id="kp8r3h"
page.text(x, y, value);
```

Example:

```cpp id="i7a4pc"
page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");
```

`page.x_left()` gives the left content position inside margins.

`page.y_top()` gives the top content position inside margins.

## Add another line

To draw another line lower on the page, subtract from the Y position:

```cpp id="c4e1nv"
page.text(
    page.x_left(),
    page.y_top() - 30.0F,
    "Second line");
```

PDF coordinates use points.

One point is 1/72 inch.

## Save the document

Save with:

```cpp id="qlc7tx"
auto saved = rix.pdf.save(doc, "hello.pdf");
```

Always check the result:

```cpp id="wn3mv4"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

`save` returns a status object.

It does not throw for normal PDF errors.

## Fastest helper: `make_text`

For a very small text PDF, use:

```cpp id="fq5pz2"
auto saved = rix.pdf.make_text(
    "hello.pdf",
    "Hello from rix.pdf",
    "Rix PDF");
```

Complete example:

```cpp id="mg2vku"
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

```bash id="gr4nbc"
vix run pdf.cpp
```

Use `make_text` when you only need a simple text document.

Use `document()` when you need pages, headings, tables, drawings, images, or metadata.

## Add a title and paragraph

For a more document-like PDF:

```cpp id="wks9xq"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Rix PDF Quick Start");
  doc.set_author("Rix");

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Rix PDF",
      1);

  y -= 10.0F;

  page.paragraph(
      page.x_left(),
      y,
      page.content_width(),
      "Rix PDF lets C++ applications create simple generated documents "
      "through the unified Rix facade.");

  auto saved = rix.pdf.save(doc, "quick-start.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "quick-start.pdf");
  return 0;
}
```

Run:

```bash id="mm8cva"
vix run pdf.cpp
```

## Add a small table

Tables are useful for reports.

```cpp id="eb0l8w"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Rix PDF Table");

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Project table",
      1);

  y -= 20.0F;

  rixlib::pdf::Table table;

  table.set_column_widths({
      160.0F,
      160.0F,
      160.0F});

  table.add_header({
      "Name",
      "Language",
      "Project"});

  table.add_row({
      "Ada",
      "C++",
      "Rix"});

  table.add_row({
      "Gaspard",
      "C++",
      "Vix.cpp"});

  page.table(
      page.x_left(),
      y,
      table);

  auto saved = rix.pdf.save(doc, "table.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "table.pdf");
  return 0;
}
```

Run:

```bash id="ai6qv0"
vix run pdf.cpp
```

## Add metadata

Metadata is written into the PDF info dictionary.

```cpp id="d4m2tp"
auto doc = rix.pdf.document();

doc.set_title("Rix PDF Metadata")
    .set_author("Rix")
    .set_subject("PDF generation")
    .set_keywords("rix,pdf,vix,cpp");
```

Use metadata for generated reports and files that need a readable title or author.

## Write bytes instead of saving

Use `write` when you want the PDF bytes in memory:

```cpp id="if8xzy"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(bytes.error()),
      bytes.error().message());

  return 1;
}

rix.debug.print("pdf bytes:", bytes.value().size());
```

Use:

```cpp id="ywtxc6"
rix.pdf.save(doc, "output.pdf");
```

when you want a file.

Use:

```cpp id="h1wk9g"
rix.pdf.write(doc);
```

when another part of your application will handle the bytes.

## Use in a Vix project

Create a Vix application:

```bash id="s1r9ub"
vix new pdf-quick-start --app
cd pdf-quick-start
```

Add Rix:

```bash id="udf7by"
vix add rix/rix
vix install
```

In `vix.app`, make sure Rix is listed under `deps`:

```txt id="q7jwfi"
deps = [
  "rix/rix",
]
```

A small `vix.app` can look like this:

```txt id="w2gq7d"
name = "pdf-quick-start"
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

Then use PDF in `src/main.cpp`:

```cpp id="s8lzpj"
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

Build and run:

```bash id="ym23uk"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments:

```bash id="qx0r2b"
vix run pdf.cpp
```

If Rix is installed globally for single-file usage:

```bash id="m1w7zq"
vix install -g rix/rix
vix run pdf.cpp
```

For project usage, prefer:

```bash id="oe6ijb"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="u0pw8s"
deps = [
  "rix/rix",
]
```

## Use only PDF with the facade

If you want the `rix.*` facade style but only want PDF mounted, define the feature macro before including `rix.hpp`:

```cpp id="iq7pyn"
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

## Use the independent package

For independent usage, install:

```bash id="y3w0ql"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="ukpn1m"
deps = [
  "rix/pdf",
]
```

Then include:

```cpp id="f6r9wm"
#include <rix/pdf.hpp>
```

Use this style when a project only needs PDF and does not need the full unified Rix facade.

For most application documentation, prefer:

```cpp id="q1yz8e"
#include <rix.hpp>
```

## Common mistakes

### Forgetting to save the document

Wrong:

```cpp id="q9i4nu"
auto doc = rix.pdf.document();
doc.add_page();
```

Correct:

```cpp id="s5ruoy"
auto saved = rix.pdf.save(doc, "hello.pdf");
```

### Not checking errors

Wrong:

```cpp id="c7r9qk"
rix.pdf.save(doc, "hello.pdf");
```

Better:

```cpp id="nt8so5"
auto saved = rix.pdf.save(doc, "hello.pdf");

if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

### Saving to an empty path

This fails:

```cpp id="hl6v1a"
rix.pdf.save(doc, "");
```

Use a real output path:

```cpp id="fe69mv"
rix.pdf.save(doc, "hello.pdf");
```

### Drawing outside the visible page

This can make content invisible:

```cpp id="g3h1op"
page.text(0.0F, -50.0F, "Hidden text");
```

Use page helpers:

```cpp id="ywfa5b"
page.x_left()
page.y_top()
page.content_width()
```

### Forgetting `deps`

For a Vix project, do not put Rix packages in `packages`.

Use:

```txt id="td4w7c"
deps = [
  "rix/rix",
]
```

`packages` is for CMake package discovery.

`deps` is for Vix Registry packages.

## What you should remember

Create a document:

```cpp id="me6xcn"
auto doc = rix.pdf.document();
```

Add a page:

```cpp id="iewvx6"
auto &page = doc.add_page();
```

Write text:

```cpp id="kn3c2a"
page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");
```

Save:

```cpp id="v5azju"
auto saved = rix.pdf.save(doc, "hello.pdf");
```

Check errors:

```cpp id="fw9y1t"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());
}
```

Use `make_text` for the fastest simple PDF:

```cpp id="vlsqmw"
rix.pdf.make_text(
    "hello.pdf",
    "Hello from rix.pdf",
    "Rix PDF");
```

For a Vix project, install Rix:

```bash id="wm1hke"
vix add rix/rix
vix install
```

and use:

```txt id="czg60q"
deps = [
  "rix/rix",
]
```

## Next step

Learn how to create a PDF document.

Next: [Create Document](./document)
