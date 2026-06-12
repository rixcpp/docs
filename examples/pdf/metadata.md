# Metadata

This example shows how to add PDF metadata with `rix/pdf`.

The example uses the public Rix facade:

```cpp id="q8m4xa"
#include <rix.hpp>
```

and accesses PDF through:

```cpp id="n5v9qc"
rix.pdf
```

Use this example when you want a generated PDF to include title, author, subject, creator, and keywords.

## Create the file

```bash id="k7x2ma"
mkdir -p ~/rix-pdf-metadata-example
cd ~/rix-pdf-metadata-example
touch metadata.cpp
```

Add:

```cpp id="p9c5xr"
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

  auto saved = rix.pdf.save(doc, "rix_pdf_metadata.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "rix_pdf_metadata.pdf");
  return 0;
}
```

Run it:

```bash id="q4m8vb"
vix run metadata.cpp
```

If Rix is not available yet for single-file usage:

```bash id="x2n7pd"
vix install -g rix/rix
vix run metadata.cpp
```

This creates:

```txt id="t8q5hm"
rix_pdf_metadata.pdf
```

## What this example does

The example creates a PDF document:

```cpp id="b6x3rd"
auto doc = rix.pdf.document();
```

It sets metadata:

```cpp id="z5v8ka"
doc.set_title("Rix PDF Metadata Example")
    .set_author("Rix")
    .set_subject("PDF metadata")
    .set_keywords("rix,pdf,vix,cpp");
```

It adds visible page content:

```cpp id="c9q2mx"
auto &page = doc.add_page();
```

Then it saves the document:

```cpp id="h7n4qc"
auto saved = rix.pdf.save(doc, "rix_pdf_metadata.pdf");
```

## Metadata is document information

PDF metadata is information stored in the PDF file.

It can describe the document, but it is not visible page content by itself.

Metadata can include:

```txt id="d3x8vp"
title
author
subject
creator
keywords
```

If you want text to appear on the page, draw it with:

```cpp id="j2m9wa"
page.text(...)
page.heading(...)
page.paragraph(...)
```

## Set the title

Use:

```cpp id="w8c5nr"
doc.set_title("Rix PDF Metadata Example");
```

The title describes the document.

If you also want a visible title, draw it on the page:

```cpp id="k5v7ma"
page.heading(
    page.x_left(),
    page.y_top(),
    "Rix PDF Metadata Example",
    1);
```

## Set the author

Use:

```cpp id="r6q9xd"
doc.set_author("Rix");
```

The author describes who created the document or who owns the content.

## Set the subject

Use:

```cpp id="p2n8fc"
doc.set_subject("PDF metadata");
```

The subject is a short description of what the document is about.

## Set keywords

Use:

```cpp id="y4m6qv"
doc.set_keywords("rix,pdf,vix,cpp");
```

Keywords are useful for search, indexing, and document organization.

Use a stable comma-separated string.

## Set the creator

The default creator is:

```txt id="f9x3ka"
rix/pdf
```

You can override it:

```cpp id="m7c5vx"
doc.set_creator("my-app");
```

If the creator is set to an empty value, it is normalized back to:

```txt id="q3p8za"
rix/pdf
```

## Chain metadata setters

Document metadata setters return the document, so they can be chained:

```cpp id="v8n2hr"
doc.set_title("Report")
    .set_author("Rix")
    .set_subject("Generated report")
    .set_creator("my-app")
    .set_keywords("report,rix,pdf");
```

This is the preferred style for simple metadata setup.

## Metadata with visible content

Metadata is not enough if you want the reader to see a title inside the page.

Use both:

```cpp id="a6q9mx"
doc.set_title("Monthly Report")
    .set_author("Rix");

auto &page = doc.add_page();

page.heading(
    page.x_left(),
    page.y_top(),
    "Monthly Report",
    1);
```

The metadata title describes the file.

The page heading appears in the PDF content.

## Complete metadata report

```cpp id="r4v8kb"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Generated Report")
      .set_author("Rix")
      .set_subject("PDF metadata example")
      .set_creator("rix/pdf")
      .set_keywords("rix,pdf,metadata,report");

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Generated Report",
      1);

  y -= 15.0F;

  page.paragraph(
      page.x_left(),
      y,
      page.content_width(),
      "This document includes metadata and visible page content.");

  auto saved = rix.pdf.save(doc, "generated-report.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "generated-report.pdf");
  return 0;
}
```

Run:

```bash id="x9m2pd"
vix run metadata.cpp
```

## Access metadata directly

You can access the metadata object:

```cpp id="c5w9qa"
auto &metadata = doc.metadata();
```

Then set values:

```cpp id="z8q2vm"
metadata.set_title("Direct metadata");
metadata.set_author("Rix");
metadata.set_subject("Direct metadata access");
metadata.set_keywords("rix,pdf");
```

For normal usage, prefer document helpers:

```cpp id="n7x4hd"
doc.set_title(...)
doc.set_author(...)
doc.set_subject(...)
doc.set_keywords(...)
```

## Read metadata

You can read metadata values:

```cpp id="d6k8rc"
rix.debug.print("title:", doc.metadata().title());
rix.debug.print("author:", doc.metadata().author());
rix.debug.print("subject:", doc.metadata().subject());
rix.debug.print("creator:", doc.metadata().creator());
rix.debug.print("keywords:", doc.metadata().keywords());
```

This is useful in tests, diagnostics, and adapters.

## Clear metadata

Use:

```cpp id="g5m9xq"
doc.metadata().clear();
```

This clears user-provided metadata and resets the creator to:

```txt id="y3v8mb"
rix/pdf
```

Example:

```cpp id="f4q7vd"
doc.set_title("Temporary")
    .set_author("Rix");

doc.metadata().clear();
```

After clearing, title and author are empty again.

## Check if metadata is empty

Use:

```cpp id="w2x6qp"
if (doc.metadata().empty())
{
  rix.debug.print("metadata is empty");
}
```

The default creator does not make metadata non-empty.

`empty()` checks whether user-provided metadata such as title, author, subject, and keywords is empty.

## Metadata and saving

Metadata is written when the document is saved:

```cpp id="n6c9hd"
auto saved = rix.pdf.save(doc, "metadata.pdf");
```

It is also included when the document is written to bytes:

```cpp id="j8q5kc"
auto bytes = rix.pdf.write(doc);
```

Both paths use the same document model.

## Save the document

Use:

```cpp id="r7x3vm"
auto saved = rix.pdf.save(doc, "metadata.pdf");
```

Check errors:

```cpp id="p6m8xb"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

## Write bytes instead of saving

Use:

```cpp id="t9q2za"
auto bytes = rix.pdf.write(doc);
```

Example:

```cpp id="x4v7nd"
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

Use `write` for HTTP responses or custom output handling.

Use `save` for direct file output.

## Metadata for generated reports

A report usually sets at least:

```cpp id="p4q8zb"
doc.set_title("Daily Report")
    .set_author("My App")
    .set_subject("Daily system report")
    .set_keywords("report,daily,pdf");
```

Then draws visible content:

```cpp id="v2k9qc"
auto &page = doc.add_page();

page.heading(
    page.x_left(),
    page.y_top(),
    "Daily Report",
    1);
```

Use metadata for file identity.

Use page content for the reader.

## Metadata for invoices

```cpp id="c8w5rp"
doc.set_title("Invoice INV-001")
    .set_author("My Company")
    .set_subject("Customer invoice")
    .set_keywords("invoice,pdf,billing");
```

Then draw invoice content normally with text, tables, and lines.

## Metadata for exported data

```cpp id="z4v8qa"
doc.set_title("CSV Export")
    .set_author("Rix")
    .set_subject("Data export")
    .set_keywords("csv,export,rix,pdf");
```

This is useful when converting CSV or application data into a PDF report.

## Use in a Vix project

Create a project:

```bash id="f7q3ma"
vix new rix-pdf-metadata --app
cd rix-pdf-metadata
```

Add Rix:

```bash id="n9x2qc"
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt id="c5v8na"
deps = [
  "rix/rix",
]
```

A minimal `vix.app` can look like this:

```txt id="m6q4rd"
name = "rix-pdf-metadata"
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

```txt id="v2k8xm"
src/main.cpp
```

Build and run:

```bash id="q9c5rd"
vix build
vix run
```

## Single-file usage

For examples, tests, and quick experiments:

```bash id="k8m4xa"
vix run metadata.cpp
```

If needed:

```bash id="h5n7vc"
vix install -g rix/rix
vix run metadata.cpp
```

For project usage, prefer:

```bash id="x9q2va"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="d6m8qc"
deps = [
  "rix/rix",
]
```

## Use only PDF with the facade

If you want the `rix.*` facade style but only want PDF mounted, define the feature macro before including `rix.hpp`:

```cpp id="z4x7mq"
#define RIX_ENABLE_PDF
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Metadata only");

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Metadata example");

  auto saved = rix.pdf.save(doc, "metadata.pdf");

  return saved.ok() ? 0 : 1;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

If you also want debug output:

```cpp id="y8m3ka"
#define RIX_ENABLE_PDF
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Metadata only");

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Metadata example");

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

## Use the independent package

For independent usage, install:

```bash id="s5v9qa"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="p7n4xm"
deps = [
  "rix/pdf",
]
```

Then include:

```cpp id="w3q8kc"
#include <rix/pdf.hpp>
```

Example:

```cpp id="r6x2vd"
#include <rix/pdf.hpp>

int main()
{
  auto pdf = rixlib::pdf::module();

  auto doc = pdf.document();

  doc.set_title("Independent PDF")
      .set_author("Rix");

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix/pdf");

  auto saved = pdf.save(doc, "metadata.pdf");

  return saved.ok() ? 0 : 1;
}
```

The examples in this documentation prefer the public facade:

```cpp id="a8k5qx"
#include <rix.hpp>
```

and:

```cpp id="f2v7mc"
rix.pdf
```

## Common mistakes

### Forgetting to install Rix

If `rix.hpp` is not found, install Rix first.

For a project:

```bash id="c9m4vx"
vix add rix/rix
vix install
```

For single-file usage:

```bash id="m8q2za"
vix install -g rix/rix
```

### Putting Rix in `packages`

Wrong:

```txt id="n5v8qc"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="q7x4ma"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Expecting metadata to appear on the page

Metadata describes the file.

It does not draw visible text.

Wrong expectation:

```cpp id="h6q9vx"
doc.set_title("Report");
```

Visible page content requires:

```cpp id="v8n3qb"
page.heading(
    page.x_left(),
    page.y_top(),
    "Report",
    1);
```

### Forgetting to save after setting metadata

This only changes the document model:

```cpp id="k4m9xd"
doc.set_title("Report");
```

To create the PDF file:

```cpp id="x3m7qa"
rix.pdf.save(doc, "report.pdf");
```

### Not checking save errors

Wrong:

```cpp id="n9q5vx"
rix.pdf.save(doc, "metadata.pdf");
```

Correct:

```cpp id="d2v8rc"
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

### Confusing creator and author

`author` usually describes the author or owner of the document content.

`creator` usually describes the application or library that generated the PDF.

Example:

```cpp id="b5x9ma"
doc.set_author("Rix")
    .set_creator("rix/pdf");
```

## What you should remember

Create a document:

```cpp id="r4q8md"
auto doc = rix.pdf.document();
```

Set metadata:

```cpp id="y7m2ka"
doc.set_title("Rix PDF Metadata Example")
    .set_author("Rix")
    .set_subject("PDF metadata")
    .set_keywords("rix,pdf,vix,cpp");
```

Add visible content:

```cpp id="f7q3ma"
auto &page = doc.add_page();

page.heading(
    page.x_left(),
    page.y_top(),
    "Metadata",
    1);
```

Save:

```cpp id="n9x2qc"
auto saved = rix.pdf.save(doc, "metadata.pdf");
```

For project usage:

```bash id="m6q4rd"
vix add rix/rix
vix install
```

and keep:

```txt id="v2k8xm"
deps = [
  "rix/rix",
]
```

## Next step

Continue with `make_text`.

Next: [Make text](./make-text)
