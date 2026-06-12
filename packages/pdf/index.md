# PDF

`rix/pdf` is the Rix package for creating simple PDF documents from C++.

It provides a small document API for pages, text, paragraphs, headings, tables, drawing primitives, metadata, images, and PDF writing.

The examples on this page use the public Rix facade:

```cpp id="f4q8lw"
#include <rix.hpp>
```

and access PDF through:

```cpp id="m2k9xr"
rix.pdf
```

## What `rix/pdf` provides

`rix/pdf` provides application-level PDF generation for Vix.cpp and Rix projects.

It can be used to create:

```txt id="q9p2am"
simple PDF files
text documents
reports
tables
generated documents
metadata-enabled PDF files
basic drawings
documents with JPEG images
```

The goal is to keep common PDF generation simple while hiding low-level PDF writer details.

## Basic example

Create a file:

```bash id="o7w4ks"
mkdir -p ~/rix-pdf-example
cd ~/rix-pdf-example
touch pdf.cpp
```

Add:

```cpp id="g2wm5d"
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

```bash id="b6h3en"
vix run pdf.cpp
```

If Rix is not available yet for single-file usage:

```bash id="th9f4x"
vix install -g rix/rix
vix run pdf.cpp
```

This creates:

```txt id="f1a7dv"
rix_pdf_basic.pdf
```

## Install

For normal usage through the unified facade, install:

```bash id="y6p8qz"
vix add rix/rix
vix install
```

In `vix.app`, declare:

```txt id="a3fr8q"
deps = [
  "rix/rix",
]
```

If you want to use only the independent PDF package, install:

```bash id="j8a2vx"
vix add rix/pdf
vix install
```

and declare:

```txt id="t5q0pc"
deps = [
  "rix/pdf",
]
```

For most documentation examples, prefer the facade package:

```cpp id="ko8m6n"
#include <rix.hpp>
```

## Create a document

Use:

```cpp id="na3x0e"
auto doc = rix.pdf.document();
```

This creates a PDF document with default page settings.

Then add a page:

```cpp id="l0g9qr"
auto &page = doc.add_page();
```

A document owns its pages and metadata.

The PDF writer serializes the document when you call `save` or `write`.

## Add text

Use:

```cpp id="n6vk0q"
page.text(x, y, value);
```

Example:

```cpp id="s5gqja"
page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");
```

`x_left()` and `y_top()` are convenient positions inside the page margins.

## Add a heading

Use:

```cpp id="tz7a5x"
auto y = page.heading(
    page.x_left(),
    page.y_top(),
    "Rix PDF",
    1);
```

The heading function returns the next Y position after the heading.

You can continue drawing below it:

```cpp id="j4p2da"
y -= 10.0F;

page.text(
    page.x_left(),
    y,
    "Document content starts here.");
```

## Add a paragraph

Use:

```cpp id="wm6bpr"
page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "Long text goes here.");
```

A paragraph wraps text inside the provided width.

Example:

```cpp id="b2dtgs"
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
    "Rix gives Vix C++ projects a unified userland facade. "
    "The PDF module keeps the public API simple while the writer internals stay hidden.");
```

## Text alignment

Use `rixlib::pdf::Align` when drawing aligned text or paragraphs:

```cpp id="h7wy4r"
page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "This paragraph is centered.",
    rixlib::pdf::Align::Center);
```

Available alignment values:

```cpp id="d9f2hk"
rixlib::pdf::Align::Left
rixlib::pdf::Align::Center
rixlib::pdf::Align::Right
rixlib::pdf::Align::Justify
```

## Text style

Use `rixlib::pdf::TextStyle` to control font, size, color, and line height.

Example:

```cpp id="k7cp4d"
page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "This paragraph uses blue text.",
    rixlib::pdf::Align::Left,
    rixlib::pdf::TextStyle{
        rixlib::pdf::Font::Helvetica,
        12.0F,
        rixlib::pdf::Color::blue_color()});
```

Common helpers:

```cpp id="eg3j5h"
rixlib::pdf::TextStyle::normal()
rixlib::pdf::TextStyle::heading()
rixlib::pdf::TextStyle::small()
```

## Colors

Use `rixlib::pdf::Color` for text, shapes, and table styles.

Common colors:

```cpp id="p4tvf7"
rixlib::pdf::Color::black()
rixlib::pdf::Color::white()
rixlib::pdf::Color::red_color()
rixlib::pdf::Color::green_color()
rixlib::pdf::Color::blue_color()
rixlib::pdf::Color::gray()
rixlib::pdf::Color::light_gray()
```

Create a color from hexadecimal RGB:

```cpp id="u8yfa1"
auto color = rixlib::pdf::Color::from_hex(0x2C3E50);
```

## Page size and margins

Create a document with custom page settings:

```cpp id="x5e8qj"
auto doc = rix.pdf.document(
    rixlib::pdf::PageSize::A4(),
    rixlib::pdf::Margins::one_inch());
```

Common page sizes:

```cpp id="t4rxwy"
rixlib::pdf::PageSize::A4()
rixlib::pdf::PageSize::A3()
rixlib::pdf::PageSize::Letter()
rixlib::pdf::PageSize::Legal()
```

Create custom sizes:

```cpp id="oh3gpy"
auto size = rixlib::pdf::PageSize::from_inches(8.5F, 11.0F);
```

Margins:

```cpp id="gy3pqf"
rixlib::pdf::Margins::one_inch()
rixlib::pdf::Margins::none()
rixlib::pdf::Margins::from_inches(1.0F, 1.0F, 1.0F, 1.0F)
rixlib::pdf::Margins::from_millimeters(20.0F, 20.0F, 20.0F, 20.0F)
```

## Units

PDF coordinates use points.

One point is 1/72 inch.

Helpers:

```cpp id="wyn3pe"
rixlib::pdf::inches(1.0F)
rixlib::pdf::millimeters(10.0F)
rixlib::pdf::centimeters(2.0F)
```

Example:

```cpp id="h2gm9a"
page.text(
    rixlib::pdf::inches(1.0F),
    rixlib::pdf::inches(10.0F),
    "Positioned with inch units");
```

## Add a table

Use `rixlib::pdf::Table`.

Example:

```cpp id="iw9d8o"
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
```

Tables are useful for generated reports and simple tabular documents.

## Draw shapes

A page can draw simple primitives:

```cpp id="c5yzq1"
page.line(
    page.x_left(),
    y,
    page.x_right(),
    y,
    1.5F,
    rixlib::pdf::Color::blue_color());

page.rect(
    page.x_left(),
    y - 70.0F,
    140.0F,
    50.0F);

page.fill_rect(
    page.x_left() + 170.0F,
    y - 70.0F,
    140.0F,
    50.0F,
    rixlib::pdf::Color::light_gray());

page.circle(
    page.x_left() + 70.0F,
    y - 160.0F,
    35.0F,
    1.0F,
    rixlib::pdf::Color::red_color());
```

Useful drawing methods:

```cpp id="lp2juv"
line
rect
fill_rect
fill_stroke_rect
circle
hrule
```

## Add metadata

Document metadata can be set through chainable helpers:

```cpp id="r7b3we"
auto doc = rix.pdf.document();

doc.set_title("Rix PDF Metadata Example")
    .set_author("Rix")
    .set_subject("PDF metadata")
    .set_keywords("rix,pdf,vix,cpp");
```

Metadata can include:

```txt id="e6d0m4"
title
author
subject
creator
keywords
```

## Save a PDF

Use:

```cpp id="q1ocv2"
auto saved = rix.pdf.save(doc, "output.pdf");
```

Check the result:

```cpp id="ztf7bd"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

`save` returns a status object, not an exception.

## Write PDF bytes

Use:

```cpp id="aj4rv7"
auto bytes = rix.pdf.write(doc);
```

Example:

```cpp id="mh3s1t"
auto data = rix.pdf.write(doc);

if (data.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(data.error()),
      data.error().message());

  return 1;
}

rix.debug.print("pdf bytes:", data.value().size());
```

Use `write` when you want the PDF content as a string of bytes.

Use `save` when you want to write directly to a file.

## High-level text helper

Use:

```cpp id="fn2c3k"
auto saved = rix.pdf.make_text(
    "hello.pdf",
    "Hello from rix.pdf",
    "Rix PDF");
```

This creates a simple text PDF with an optional title.

It is the fastest way to generate a small document.

## Error handling

PDF operations return explicit result or status objects.

Common pattern:

```cpp id="n5a2lo"
auto saved = rix.pdf.save(doc, "output.pdf");

if (saved.failed())
{
  const auto &error = saved.error();

  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(error),
      error.message());

  return 1;
}
```

PDF errors have stable codes and messages.

Use the code for programmatic decisions.

Use the message for diagnostics.

## PDF error helpers

Error helpers are available through:

```cpp id="zw6e7a"
rix.pdf.error
```

Example:

```cpp id="i1necp"
auto saved = rix.pdf.save(doc, "");

if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());
}
```

Useful helpers:

```cpp id="u2k7xh"
rix.pdf.error.to_string(error)
rix.pdf.error.ok(error)
rix.pdf.error.failed(error)
rix.pdf.error.is(error, code)
```

## JPEG images

`rix/pdf` can load JPEG images:

```cpp id="y5fq39"
auto image = rix.pdf.image.load_jpeg("photo.jpg");

if (image.failed())
{
  rix.debug.eprint(
      "image error:",
      rix.pdf.error.to_string(image.error()),
      image.error().message());

  return 1;
}

page.image_fit(
    image.value(),
    page.x_left(),
    page.y_top() - 250.0F,
    300.0F,
    200.0F);
```

The first implementation supports JPEG images.

## Complete text document example

```cpp id="j2ypz9"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Rix PDF Text Example");
  doc.set_author("Rix");

  auto &page = doc.add_page();

  auto y = page.y_top();

  y = page.heading(
      page.x_left(),
      y,
      "Rix PDF",
      1);

  y -= 10.0F;

  y = page.paragraph(
      page.x_left(),
      y,
      page.content_width(),
      "Rix gives Vix C++ projects a unified userland facade. "
      "The PDF module keeps the public API simple while the writer internals stay hidden.");

  y -= 20.0F;

  page.paragraph(
      page.x_left(),
      y,
      page.content_width(),
      "This paragraph is centered to show text alignment.",
      rixlib::pdf::Align::Center,
      rixlib::pdf::TextStyle{
          rixlib::pdf::Font::Helvetica,
          12.0F,
          rixlib::pdf::Color::blue_color()});

  auto saved = rix.pdf.save(doc, "rix_pdf_text.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "rix_pdf_text.pdf");
  return 0;
}
```

Run it:

```bash id="r8j0bm"
vix run pdf.cpp
```

## Complete table example

```cpp id="h3d6xq"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Rix PDF Table Example");

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

  table.add_row({
      "Grace",
      "Systems",
      "PDF"});

  page.table(
      page.x_left(),
      y,
      table);

  auto saved = rix.pdf.save(doc, "rix_pdf_table.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "rix_pdf_table.pdf");
  return 0;
}
```

## Use in a Vix project

Create a Vix application:

```bash id="d9veha"
vix new pdf-app --app
cd pdf-app
```

Add Rix:

```bash id="n2xp74"
vix add rix/rix
vix install
```

In `vix.app`, make sure Rix is listed under `deps`:

```txt id="c5vs2l"
deps = [
  "rix/rix",
]
```

A small `vix.app` can look like this:

```txt id="emq6n4"
name = "pdf-app"
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

```cpp id="r4ak3b"
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

```bash id="x1z5mp"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments:

```bash id="a1x7qd"
vix run pdf.cpp
```

If Rix is installed globally for single-file usage:

```bash id="pr9m5e"
vix install -g rix/rix
vix run pdf.cpp
```

For project usage, prefer:

```bash id="d4k5mx"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="uf6x9j"
deps = [
  "rix/rix",
]
```

## Facade usage

The recommended documentation style is:

```cpp id="z2kg9v"
#include <rix.hpp>
```

Then:

```cpp id="n6m8op"
auto doc = rix.pdf.document();
auto saved = rix.pdf.save(doc, "output.pdf");
```

This keeps PDF available through the same public object as the other Rix packages:

```cpp id="b8kv0d"
rix.csv
rix.debug
rix.auth
rix.pdf
```

## Independent package usage

If your project only needs PDF, install:

```bash id="d5jq7k"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="jb9yx8"
deps = [
  "rix/pdf",
]
```

Then include:

```cpp id="kb5n4m"
#include <rix/pdf.hpp>
```

Use this style when you do not need the unified `rix.*` facade.

For most application documentation, prefer:

```cpp id="p6q2aw"
#include <rix.hpp>
```

## Lightweight facade usage

If you want the `rix.*` facade style but only want PDF mounted, define the feature macro before including `rix.hpp`:

```cpp id="h9sp2m"
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

## Common mistakes

### Forgetting to save the document

Creating a document is not enough:

```cpp id="k6c2py"
auto doc = rix.pdf.document();
doc.add_page();
```

Save it:

```cpp id="i0fez3"
auto saved = rix.pdf.save(doc, "output.pdf");
```

### Not checking save errors

Wrong:

```cpp id="lg7cs2"
rix.pdf.save(doc, "output.pdf");
```

Better:

```cpp id="z7g0ms"
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

### Using an empty output path

This fails:

```cpp id="o9qa3p"
rix.pdf.save(doc, "");
```

Use a valid path:

```cpp id="qp7ka4"
rix.pdf.save(doc, "output.pdf");
```

### Confusing page coordinates

PDF coordinates use points.

Use helpers when you want readable units:

```cpp id="c1y7zt"
rixlib::pdf::inches(1.0F)
rixlib::pdf::millimeters(20.0F)
```

### Forgetting `deps`

For a Vix project, do not put Rix packages in `packages`.

Use:

```txt id="d5mc7a"
deps = [
  "rix/rix",
]
```

`packages` is for CMake package discovery.

`deps` is for Vix Registry packages.

## What you should remember

Use the facade:

```cpp id="x7u2pj"
#include <rix.hpp>
```

Create a document:

```cpp id="a4l0dj"
auto doc = rix.pdf.document();
```

Add a page:

```cpp id="y7q2xc"
auto &page = doc.add_page();
```

Add text:

```cpp id="z6k8rc"
page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");
```

Save the document:

```cpp id="o0w5qa"
auto saved = rix.pdf.save(doc, "output.pdf");
```

Check errors:

```cpp id="dv5h1o"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());
}
```

Use `make_text` for the fastest simple PDF:

```cpp id="g2ft8v"
rix.pdf.make_text(
    "hello.pdf",
    "Hello from rix.pdf",
    "Rix PDF");
```

For a Vix project, install Rix:

```bash id="vz7wjs"
vix add rix/rix
vix install
```

and use:

```txt id="x3ps4d"
deps = [
  "rix/rix",
]
```

## Next step

Learn the fastest PDF workflow.

Next: [Quick Start](./quick-start)
