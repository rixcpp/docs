# Basic PDF

This example shows how to create a simple PDF file with `rix/pdf`.

The example uses the public Rix facade:

```cpp id="m8q4xa"
#include <rix.hpp>
```

and accesses PDF through:

```cpp id="n5v9qc"
rix.pdf
```

Use this example when you want the smallest complete PDF generation flow.

## Create the file

```bash id="k7x2ma"
mkdir -p ~/rix-pdf-basic-example
cd ~/rix-pdf-basic-example
touch basic.cpp
```

Add:

```cpp id="p9c5xr"
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

  auto saved = rix.pdf.save(doc, "rix_pdf_basic.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "rix_pdf_basic.pdf");
  return 0;
}
```

Run it:

```bash id="q4m8vb"
vix run basic.cpp
```

If Rix is not available yet for single-file usage:

```bash id="x2n7pd"
vix install -g rix/rix
vix run basic.cpp
```

This creates:

```txt id="t8q5hm"
rix_pdf_basic.pdf
```

## What this example does

The example creates a PDF document:

```cpp id="b6x3rd"
auto doc = rix.pdf.document();
```

It adds a page:

```cpp id="z5v8ka"
auto &page = doc.add_page();
```

It writes two text lines:

```cpp id="c9q2mx"
page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");
```

Then it saves the file:

```cpp id="h7n4qc"
auto saved = rix.pdf.save(doc, "rix_pdf_basic.pdf");
```

## Create a document

Use:

```cpp id="d3x8vp"
auto doc = rix.pdf.document();
```

A document owns pages and metadata.

It does not create a file until you call:

```cpp id="j2m9wa"
rix.pdf.save(...)
```

or generate bytes with:

```cpp id="w8c5nr"
rix.pdf.write(...)
```

## Add a page

Use:

```cpp id="k5v7ma"
auto &page = doc.add_page();
```

A page is the drawing surface.

You can add text, paragraphs, headings, lines, rectangles, tables, and images.

## Use margin helpers

The example uses:

```cpp id="r6q9xd"
page.x_left()
page.y_top()
```

These helpers place content inside the page margins.

Common page helpers are:

```cpp id="p2n8fc"
page.x_left()
page.x_right()
page.y_top()
page.y_bottom()
page.content_width()
page.content_height()
```

Use them instead of hardcoding positions when possible.

## Draw text

Use:

```cpp id="y4m6qv"
page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");
```

The first argument is the X position.

The second argument is the Y position.

The third argument is the text.

## Draw another line

To draw lower on the page, subtract from the Y position:

```cpp id="f9x3ka"
page.text(
    page.x_left(),
    page.y_top() - 30.0F,
    "This PDF was generated through the unified Rix facade.");
```

PDF coordinates use points.

One inch is 72 points.

## Save the PDF

Use:

```cpp id="m7c5vx"
auto saved = rix.pdf.save(doc, "rix_pdf_basic.pdf");
```

`save` returns a status.

Always check it:

```cpp id="q3p8za"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

## Print success

After a successful save:

```cpp id="v8n2hr"
rix.debug.print("created:", "rix_pdf_basic.pdf");
```

This is useful for examples and small tools.

For real Vix application logging, prefer the Vix logging system.

## Complete flow

The basic PDF flow is:

```txt id="n7x4hd"
create document
add page
draw content
save file
check errors
```

In code:

```cpp id="d6k8rc"
auto doc = rix.pdf.document();

auto &page = doc.add_page();

page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");

auto saved = rix.pdf.save(doc, "basic.pdf");
```

## Add a title

You can add document metadata:

```cpp id="g5m9xq"
auto doc = rix.pdf.document();

doc.set_title("Basic PDF")
    .set_author("Rix");
```

Then add visible content:

```cpp id="y3v8mb"
auto &page = doc.add_page();

page.text(
    page.x_left(),
    page.y_top(),
    "Basic PDF");
```

Metadata is not visible page content.

If you want a title visible on the page, draw it as text or heading.

## Use a heading

```cpp id="f4q7vd"
auto y = page.heading(
    page.x_left(),
    page.y_top(),
    "Basic PDF",
    1);
```

`heading` returns the next Y position after the heading.

You can continue below it:

```cpp id="w2x6qp"
y -= 10.0F;

page.text(
    page.x_left(),
    y,
    "Generated with rix.pdf");
```

## Basic PDF with heading

```cpp id="n6c9hd"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Basic PDF")
      .set_author("Rix");

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Basic PDF",
      1);

  y -= 10.0F;

  page.text(
      page.x_left(),
      y,
      "Generated through the public Rix facade.");

  auto saved = rix.pdf.save(doc, "basic-heading.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "basic-heading.pdf");
  return 0;
}
```

Run:

```bash id="j8q5kc"
vix run basic.cpp
```

## Write bytes instead of saving

If you want PDF bytes in memory, use:

```cpp id="r7x3vm"
auto bytes = rix.pdf.write(doc);
```

Example:

```cpp id="p6m8xb"
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

Use `write` for HTTP responses, storage adapters, or custom output handling.

Use `save` for writing directly to disk.

## Use `make_text` for the shortest text PDF

For a very simple text PDF:

```cpp id="t9q2za"
auto saved = rix.pdf.make_text(
    "hello.pdf",
    "Hello from rix.pdf",
    "Rix PDF");
```

Complete example:

```cpp id="x4v7nd"
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

Use `make_text` when you only need a simple text document.

Use `document()` when you need more control.

## Save to another folder

Create the output folder first:

```bash id="c8p4zn"
mkdir -p output
```

Then save:

```cpp id="e6n9vb"
auto saved = rix.pdf.save(doc, "output/basic.pdf");
```

If the folder does not exist, saving can fail.

## Use in a Vix project

Create a project:

```bash id="d5m9ka"
vix new rix-pdf-basic --app
cd rix-pdf-basic
```

Add Rix:

```bash id="m3q7xp"
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt id="k8v2hd"
deps = [
  "rix/rix",
]
```

A minimal `vix.app` can look like this:

```txt id="p9n4qc"
name = "rix-pdf-basic"
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

```txt id="v6x8mr"
src/main.cpp
```

Build and run:

```bash id="c4q9vb"
vix build
vix run
```

## Single-file usage

For examples, tests, and quick experiments:

```bash id="x7m5kd"
vix run basic.cpp
```

If needed:

```bash id="q2n8vc"
vix install -g rix/rix
vix run basic.cpp
```

For project usage, prefer:

```bash id="w5p9xa"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="a8r4qn"
deps = [
  "rix/rix",
]
```

## Use only PDF with the facade

If you want the `rix.*` facade style but only want PDF mounted, define the feature macro before including `rix.hpp`:

```cpp id="s6v3xp"
#define RIX_ENABLE_PDF
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix.pdf");

  auto saved = rix.pdf.save(doc, "basic.pdf");

  return saved.ok() ? 0 : 1;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

If you also want debug output:

```cpp id="h9m6qa"
#define RIX_ENABLE_PDF
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix.pdf");

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

## Use the independent package

For independent usage, install:

```bash id="n8c5vd"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="r9x2km"
deps = [
  "rix/pdf",
]
```

Then include:

```cpp id="f6q8mb"
#include <rix/pdf.hpp>
```

Example:

```cpp id="j4v7xc"
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

  auto saved = pdf.save(doc, "basic.pdf");

  return saved.ok() ? 0 : 1;
}
```

The examples in this documentation prefer the public facade:

```cpp id="z5v9ha"
#include <rix.hpp>
```

and:

```cpp id="m2q8vc"
rix.pdf
```

## Common mistakes

### Forgetting to install Rix

If `rix.hpp` is not found, install Rix first.

For a project:

```bash id="c7x9qa"
vix add rix/rix
vix install
```

For single-file usage:

```bash id="d4v8nr"
vix install -g rix/rix
```

### Putting Rix in `packages`

Wrong:

```txt id="v9n2kx"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="h5q7mc"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Forgetting to add a page

Wrong:

```cpp id="q6p9xa"
auto doc = rix.pdf.document();

doc.set_title("Basic PDF");

rix.pdf.save(doc, "basic.pdf");
```

This can still produce a blank document, but most examples should add visible content:

```cpp id="k4m9xd"
auto &page = doc.add_page();
```

### Expecting metadata to be visible

This sets metadata:

```cpp id="x8q4vd"
doc.set_title("Basic PDF");
```

This draws visible content:

```cpp id="n9m5xa"
page.heading(
    page.x_left(),
    page.y_top(),
    "Basic PDF",
    1);
```

Use both when you want a document title and a visible title.

### Not checking save errors

Wrong:

```cpp id="a5v8kc"
rix.pdf.save(doc, "basic.pdf");
```

Correct:

```cpp id="m3q7xd"
auto saved = rix.pdf.save(doc, "basic.pdf");

if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

### Saving to a missing folder

This can fail:

```cpp id="b8p4qy"
rix.pdf.save(doc, "output/basic.pdf");
```

Create the folder first:

```bash id="k2m9vc"
mkdir -p output
```

## What you should remember

Create a document:

```cpp id="r5q8xa"
auto doc = rix.pdf.document();
```

Add a page:

```cpp id="d2v8rc"
auto &page = doc.add_page();
```

Draw text:

```cpp id="b5x9ma"
page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");
```

Save:

```cpp id="r4q8md"
auto saved = rix.pdf.save(doc, "basic.pdf");
```

Check errors:

```cpp id="y7m2ka"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());
}
```

For project usage:

```bash id="f7q3ma"
vix add rix/rix
vix install
```

and keep:

```txt id="n9x2qc"
deps = [
  "rix/rix",
]
```

## Next step

Continue with PDF text.

Next: [Text](./text)
