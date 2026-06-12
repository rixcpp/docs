# Metadata

This page explains how to add metadata to PDF documents with `rix/pdf`.

The examples use the public Rix facade:

```cpp id="v8q3mx"
#include <rix.hpp>
```

and access PDF through:

```cpp id="f4m7zp"
rix.pdf
```

PDF metadata helps describe a generated document. It can include the title, author, subject, creator, and keywords.

## Basic metadata example

Create a file:

```bash id="n7x2qd"
mkdir -p ~/rix-pdf-metadata
cd ~/rix-pdf-metadata
touch metadata.cpp
```

Add:

```cpp id="k9p4ha"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Rix PDF Metadata Example")
      .set_author("Rix")
      .set_subject("PDF metadata")
      .set_keywords("rix,pdf,vix,cpp");

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Metadata",
      1);

  y -= 10.0F;

  page.paragraph(
      page.x_left(),
      y,
      page.content_width(),
      "This PDF includes title, author, subject, creator, and keyword metadata.");

  auto saved = rix.pdf.save(doc, "metadata.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "metadata.pdf");
  return 0;
}
```

Run it:

```bash id="c5n8va"
vix run metadata.cpp
```

If Rix is not available yet for single-file usage:

```bash id="x6r4tm"
vix install -g rix/rix
vix run metadata.cpp
```

This creates:

```txt id="s8m2kp"
metadata.pdf
```

## What metadata is

Metadata is information about the PDF document.

It is not the visible page content.

Visible content is added with pages:

```cpp id="q2h9fv"
auto &page = doc.add_page();

page.text(
    page.x_left(),
    page.y_top(),
    "Visible text");
```

Metadata is added to the document itself:

```cpp id="j7d5rc"
doc.set_title("Document title");
doc.set_author("Rix");
```

PDF viewers may display this information in document properties.

## Available metadata fields

`rix/pdf` supports these metadata fields:

```txt id="t6z9bf"
title
author
subject
creator
keywords
```

Use them to describe generated reports, invoices, exports, receipts, documents, and application output.

## Set the title

Use:

```cpp id="p5w8qa"
doc.set_title("Rix PDF Metadata Example");
```

The title describes the document.

Example:

```cpp id="q8f6mx"
auto doc = rix.pdf.document();

doc.set_title("Monthly Report");
```

## Set the author

Use:

```cpp id="m3c7nv"
doc.set_author("Rix");
```

The author can be a person, application, organization, or service.

Example:

```cpp id="d9t2ka"
doc.set_author("Vix.cpp Application");
```

## Set the subject

Use:

```cpp id="h6p4xd"
doc.set_subject("PDF metadata");
```

The subject explains what the document is about.

Example:

```cpp id="z7k8qt"
doc.set_subject("Generated report");
```

## Set the creator

Use:

```cpp id="r6m3hc"
doc.set_creator("my-app");
```

The creator identifies the software or tool that created the PDF.

By default, the creator is:

```txt id="b4p8wd"
rix/pdf
```

If the creator is set to an empty value, it is normalized back to the default creator.

## Set keywords

Use:

```cpp id="y9g2sv"
doc.set_keywords("rix,pdf,vix,cpp");
```

Keywords should be short and useful.

Example:

```cpp id="w5q7lm"
doc.set_keywords("report,invoice,export");
```

## Chain metadata setters

The document metadata setters are chainable.

```cpp id="n2v8jr"
doc.set_title("Rix PDF Metadata Example")
    .set_author("Rix")
    .set_subject("PDF metadata")
    .set_keywords("rix,pdf,vix,cpp");
```

This is the recommended style when setting several metadata fields together.

## Metadata with visible content

Metadata does not create visible content.

If you want the title to appear on the page, also write it as a heading or text:

```cpp id="h8q5mb"
auto doc = rix.pdf.document();

doc.set_title("Monthly Report")
    .set_author("Rix");

auto &page = doc.add_page();

page.heading(
    page.x_left(),
    page.y_top(),
    "Monthly Report",
    1);
```

The metadata title is for the PDF info dictionary.

The heading is visible on the page.

## Read metadata

Access metadata with:

```cpp id="m4v9sx"
const auto &metadata = doc.metadata();
```

Example:

```cpp id="k3y6bd"
const auto &metadata = doc.metadata();

rix.debug.print("title:", metadata.title());
rix.debug.print("author:", metadata.author());
rix.debug.print("subject:", metadata.subject());
rix.debug.print("creator:", metadata.creator());
rix.debug.print("keywords:", metadata.keywords());
```

## Update metadata directly

You can update metadata through the metadata object:

```cpp id="s6v9kp"
doc.metadata().set_title("Updated title");
doc.metadata().set_author("Updated author");
```

The document helpers are usually cleaner:

```cpp id="x2k7rq"
doc.set_title("Updated title")
    .set_author("Updated author");
```

## Clear metadata

Use the metadata object to clear user-provided metadata:

```cpp id="v5c8tn"
doc.metadata().clear();
```

This clears:

```txt id="a3f9md"
title
author
subject
keywords
```

The creator is reset to:

```txt id="c8w4na"
rix/pdf
```

## Check whether metadata is empty

Use:

```cpp id="j3p6qa"
doc.metadata().empty()
```

Example:

```cpp id="y4x8vc"
if (doc.metadata().empty())
{
  rix.debug.print("metadata is empty");
}
```

The default creator does not make metadata non-empty.

## Metadata in a report

```cpp id="u9k5hw"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Project Report")
      .set_author("Rix")
      .set_subject("Generated project report")
      .set_keywords("rix,report,pdf");

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Project Report",
      1);

  y -= 10.0F;

  page.paragraph(
      page.x_left(),
      y,
      page.content_width(),
      "This document uses metadata for document properties "
      "and visible headings for page content.");

  auto saved = rix.pdf.save(doc, "project-report.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "project-report.pdf");
  return 0;
}
```

Run:

```bash id="e2d8jw"
vix run metadata.cpp
```

## Metadata with `make_text`

The high-level `make_text` helper accepts an optional title:

```cpp id="g8n4vq"
auto saved = rix.pdf.make_text(
    "hello.pdf",
    "Hello from rix.pdf",
    "Rix PDF");
```

The title is used as document metadata and as the visible heading.

Use `make_text` when you only need a simple text PDF.

Use `document()` when you need more control over metadata and content.

## Metadata with tables

```cpp id="m8b5qc"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Table Report")
      .set_author("Rix")
      .set_subject("Generated table")
      .set_keywords("table,pdf,rix");

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Table Report",
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

  auto saved = rix.pdf.save(doc, "table-report.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "table-report.pdf");
  return 0;
}
```

## Metadata with generated exports

For generated exports, metadata can identify the source:

```cpp id="q7r3fs"
doc.set_title("CSV Export")
    .set_author("my-app")
    .set_subject("Generated CSV report as PDF")
    .set_creator("my-app")
    .set_keywords("csv,export,pdf");
```

This is useful when PDF files are produced automatically by a backend service.

## Metadata and file names

The metadata title and output file name are separate.

```cpp id="d4z9tp"
doc.set_title("Monthly Report");

auto saved = rix.pdf.save(doc, "report-2026-06.pdf");
```

The title describes the document.

The file name describes the saved file path.

They can be the same, but they do not have to be.

## Write metadata to bytes

Metadata is included when writing PDF bytes:

```cpp id="h5x2vm"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(bytes.error()),
      bytes.error().message());

  return 1;
}
```

Use `write` when another part of your application will handle the bytes.

Use `save` when you want to write directly to a PDF file.

## Save the PDF

Use:

```cpp id="y2s6pa"
auto saved = rix.pdf.save(doc, "metadata.pdf");
```

Always check errors:

```cpp id="p7w4nd"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

## Use in a Vix project

Create a Vix application:

```bash id="k9m4xr"
vix new pdf-metadata --app
cd pdf-metadata
```

Add Rix:

```bash id="v2n8yc"
vix add rix/rix
vix install
```

In `vix.app`, make sure Rix is listed under `deps`:

```txt id="j8k5qa"
deps = [
  "rix/rix",
]
```

A small `vix.app` can look like this:

```txt id="m6f3zx"
name = "pdf-metadata"
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

Then use metadata in `src/main.cpp`:

```cpp id="z9n4kc"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Metadata example")
      .set_author("Rix")
      .set_subject("PDF metadata")
      .set_keywords("rix,pdf");

  auto &page = doc.add_page();

  page.heading(
      page.x_left(),
      page.y_top(),
      "Metadata example",
      1);

  auto saved = rix.pdf.save(doc, "metadata.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "metadata.pdf");
  return 0;
}
```

Build and run:

```bash id="q2v7md"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments:

```bash id="f5p9za"
vix run metadata.cpp
```

If Rix is installed globally for single-file usage:

```bash id="x6n8hw"
vix install -g rix/rix
vix run metadata.cpp
```

For project usage, prefer:

```bash id="a9m5jd"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="k3z7ms"
deps = [
  "rix/rix",
]
```

## Use only PDF with the facade

If you want the `rix.*` facade style but only want PDF mounted, define the feature macro before including `rix.hpp`:

```cpp id="c4p8vx"
#define RIX_ENABLE_PDF
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Metadata example")
      .set_author("Rix");

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix.pdf");

  return rix.pdf.save(doc, "metadata.pdf").ok() ? 0 : 1;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Use the independent package

For independent usage, install:

```bash id="z4b7rq"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="h7q3nk"
deps = [
  "rix/pdf",
]
```

Then include:

```cpp id="m8x2fd"
#include <rix/pdf.hpp>
```

Use this style when a project only needs PDF and does not need the full unified Rix facade.

For most application documentation, prefer:

```cpp id="r4v6yb"
#include <rix.hpp>
```

## Common mistakes

### Expecting metadata to appear on the page

Metadata is not visible page content.

This sets document metadata:

```cpp id="n9c2mp"
doc.set_title("Monthly Report");
```

To show the title on the page, also add a heading:

```cpp id="a5t8vd"
page.heading(
    page.x_left(),
    page.y_top(),
    "Monthly Report",
    1);
```

### Forgetting to add a page

Metadata alone can be written, but most documents should have visible content:

```cpp id="d2k9fw"
auto &page = doc.add_page();
```

### Not checking save errors

Wrong:

```cpp id="q6h4pn"
rix.pdf.save(doc, "metadata.pdf");
```

Better:

```cpp id="t7v3kc"
auto saved = rix.pdf.save(doc, "metadata.pdf");

if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

### Confusing title and file name

This is the PDF metadata title:

```cpp id="v5r8xy"
doc.set_title("Monthly Report");
```

This is the output path:

```cpp id="e8m3qd"
rix.pdf.save(doc, "report.pdf");
```

They are related, but not the same thing.

### Setting empty creator

If the creator is empty, it is reset to the default creator:

```txt id="h3k7zm"
rix/pdf
```

Use a real value if your application should identify itself:

```cpp id="k6m9xc"
doc.set_creator("my-app");
```

### Confusing `deps` and `packages`

For a Vix project, do not put Rix packages in `packages`.

Wrong:

```txt id="j7p2sa"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="x8d5nr"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

## What you should remember

Create a document:

```cpp id="w6n4xt"
auto doc = rix.pdf.document();
```

Set metadata:

```cpp id="h2v8mc"
doc.set_title("Title")
    .set_author("Rix")
    .set_subject("PDF metadata")
    .set_keywords("rix,pdf,vix,cpp");
```

Set the creator:

```cpp id="q3c9zf"
doc.set_creator("my-app");
```

Add visible content separately:

```cpp id="y9q5xb"
auto &page = doc.add_page();

page.heading(
    page.x_left(),
    page.y_top(),
    "Title",
    1);
```

Save:

```cpp id="p2m8ka"
auto saved = rix.pdf.save(doc, "metadata.pdf");
```

Check errors:

```cpp id="n5z4rs"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());
}
```

For a Vix project, install Rix:

```bash id="b8t6ha"
vix add rix/rix
vix install
```

and use:

```txt id="v9d2qn"
deps = [
  "rix/rix",
]
```

## Next step

Learn how to handle PDF errors.

Next: [Errors](./errors)
