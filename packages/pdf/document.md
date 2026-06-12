# Document

This page explains how to create and manage a PDF document with `rix/pdf`.

The examples use the public Rix facade:

```cpp id="x2f8rq"
#include <rix.hpp>
```

and access PDF through:

```cpp id="m7q4np"
rix.pdf
```

A PDF document is the root object. It owns pages and metadata. Pages contain the visible content.

## Basic document

Create a file:

```bash id="h5y9vm"
mkdir -p ~/rix-pdf-document
cd ~/rix-pdf-document
touch document.cpp
```

Add:

```cpp id="q8z1td"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from a Rix PDF document");

  auto saved = rix.pdf.save(doc, "document.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "document.pdf");
  return 0;
}
```

Run it:

```bash id="s4q7tw"
vix run document.cpp
```

If Rix is not available yet for single-file usage:

```bash id="l9p6vy"
vix install -g rix/rix
vix run document.cpp
```

## Create a document

Use:

```cpp id="k6fr5n"
auto doc = rix.pdf.document();
```

This creates a document with default settings:

```txt id="a9z2xk"
page size: A4
margins: default margins
pages: none
metadata: empty user metadata
```

A document does not automatically create a page.

You add pages explicitly:

```cpp id="c3d7wp"
auto &page = doc.add_page();
```

## Create a document with page settings

You can create a document with a default page size and margins:

```cpp id="m2w5vf"
auto doc = rix.pdf.document(
    rixlib::pdf::PageSize::A4(),
    rixlib::pdf::Margins::one_inch());
```

Every page created with `add_page()` uses these defaults.

```cpp id="k0q8rd"
auto &page = doc.add_page();
```

## Page size

Page sizes use PDF points.

One point is 1/72 inch.

Common page sizes:

```cpp id="k7x4ve"
rixlib::pdf::PageSize::A4()
rixlib::pdf::PageSize::A3()
rixlib::pdf::PageSize::Letter()
rixlib::pdf::PageSize::Legal()
```

Example:

```cpp id="v5f9bn"
auto doc = rix.pdf.document(
    rixlib::pdf::PageSize::Letter());
```

## Landscape pages

Use `as_landscape()` when you want a landscape page size:

```cpp id="n2r8kp"
auto doc = rix.pdf.document(
    rixlib::pdf::PageSize::A4().as_landscape());
```

Use `as_portrait()` when you want portrait:

```cpp id="w8t2cm"
auto size = rixlib::pdf::PageSize::A4().as_portrait();
```

## Custom page size

Create a custom page size with points:

```cpp id="z3m5gr"
auto size = rixlib::pdf::PageSize::custom(
    500.0F,
    700.0F);
```

Or use inch helpers:

```cpp id="q1r7sd"
auto size = rixlib::pdf::PageSize::from_inches(
    8.5F,
    11.0F);
```

Or millimeter helpers:

```cpp id="u6c8ha"
auto size = rixlib::pdf::PageSize::from_millimeters(
    210.0F,
    297.0F);
```

## Margins

Use default margins:

```cpp id="u9v3kq"
auto doc = rix.pdf.document();
```

Use one-inch margins:

```cpp id="j7cp4d"
auto doc = rix.pdf.document(
    rixlib::pdf::PageSize::A4(),
    rixlib::pdf::Margins::one_inch());
```

Use no margins:

```cpp id="u4zw9k"
auto doc = rix.pdf.document(
    rixlib::pdf::PageSize::A4(),
    rixlib::pdf::Margins::none());
```

Use custom margins in inches:

```cpp id="f9y5lc"
auto margins = rixlib::pdf::Margins::from_inches(
    1.0F,
    1.0F,
    0.75F,
    0.75F);
```

The order is:

```txt id="xp8n2s"
top
bottom
left
right
```

Use custom margins in millimeters:

```cpp id="t5q4ra"
auto margins = rixlib::pdf::Margins::from_millimeters(
    20.0F,
    20.0F,
    20.0F,
    20.0F);
```

## Add a page

Use:

```cpp id="a2b9tf"
auto &page = doc.add_page();
```

This uses the document default page size and margins.

Example:

```cpp id="h4px0s"
auto doc = rix.pdf.document();

auto &page = doc.add_page();

page.text(
    page.x_left(),
    page.y_top(),
    "First page");
```

## Add a page with custom size

Use:

```cpp id="c8s0mh"
auto &page = doc.add_page(
    rixlib::pdf::PageSize::Letter());
```

This page uses the custom size and the document default margins.

## Add a page with custom size and margins

Use:

```cpp id="f6n5rw"
auto &page = doc.add_page(
    rixlib::pdf::PageSize::A4(),
    rixlib::pdf::Margins::from_millimeters(
        20.0F,
        20.0F,
        20.0F,
        20.0F));
```

This is useful when one page needs different layout rules.

## Multiple pages

Add several pages:

```cpp id="p8g1wd"
auto doc = rix.pdf.document();

auto &first = doc.add_page();

first.text(
    first.x_left(),
    first.y_top(),
    "First page");

auto &second = doc.add_page();

second.text(
    second.x_left(),
    second.y_top(),
    "Second page");
```

Save:

```cpp id="t2b4mc"
auto saved = rix.pdf.save(doc, "multi-page.pdf");
```

## Page count

Use:

```cpp id="f4x6az"
doc.page_count()
```

Example:

```cpp id="b3j5td"
rix.debug.print("pages:", doc.page_count());
```

Check whether the document has no pages:

```cpp id="z9x4db"
if (doc.empty())
{
  rix.debug.print("document has no pages");
}
```

## Access pages

Access a page by index:

```cpp id="a6w9nd"
auto &page = doc.page(0);
```

Indexes are zero-based.

Use this only when you know the page exists.

Example:

```cpp id="g2j7xs"
if (doc.page_count() > 0)
{
  auto &page = doc.page(0);

  page.text(
      page.x_left(),
      page.y_top() - 40.0F,
      "Added later");
}
```

## Clear pages

Remove all pages:

```cpp id="f7v4kb"
doc.clear_pages();
```

After this:

```txt id="h9nt2p"
doc.page_count() == 0
doc.empty() == true
```

## Metadata

A document stores metadata.

Common metadata fields:

```txt id="w4f8jc"
title
author
subject
creator
keywords
```

Set metadata with chainable helpers:

```cpp id="g5c8nr"
doc.set_title("Rix PDF Document")
    .set_author("Rix")
    .set_subject("Document generation")
    .set_keywords("rix,pdf,vix,cpp");
```

You can also set creator:

```cpp id="p1m9kx"
doc.set_creator("my-app");
```

If the creator is empty, it is normalized back to the default creator.

## Metadata example

```cpp id="r8v5sb"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Rix PDF Document")
      .set_author("Rix")
      .set_subject("Document metadata")
      .set_keywords("rix,pdf,vix,cpp");

  auto &page = doc.add_page();

  page.heading(
      page.x_left(),
      page.y_top(),
      "Document metadata",
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

Run:

```bash id="s6c2vk"
vix run document.cpp
```

## Read metadata

Access metadata:

```cpp id="b4x2ve"
const auto &metadata = doc.metadata();

rix.debug.print("title:", metadata.title());
rix.debug.print("author:", metadata.author());
```

Mutable access is also available:

```cpp id="z6h8yv"
doc.metadata().set_title("Updated title");
```

The chainable helpers are usually clearer:

```cpp id="x9z3am"
doc.set_title("Updated title");
```

## Default page settings

Read the default page size:

```cpp id="m9g4cs"
const auto &size = doc.default_page_size();

rix.debug.print("width:", size.width());
rix.debug.print("height:", size.height());
```

Read the default margins:

```cpp id="c2k8jd"
const auto &margins = doc.default_margins();

rix.debug.print("left:", margins.left());
rix.debug.print("right:", margins.right());
```

Update defaults:

```cpp id="p5v7zn"
doc.set_default_page_size(
    rixlib::pdf::PageSize::Letter());

doc.set_default_margins(
    rixlib::pdf::Margins::one_inch());
```

Pages added after the update use the new defaults.

## Complete multi-page example

```cpp id="c4b8uy"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document(
      rixlib::pdf::PageSize::A4(),
      rixlib::pdf::Margins::one_inch());

  doc.set_title("Multi-page document")
      .set_author("Rix");

  auto &first = doc.add_page();

  first.heading(
      first.x_left(),
      first.y_top(),
      "First page",
      1);

  first.paragraph(
      first.x_left(),
      first.y_top() - 50.0F,
      first.content_width(),
      "This is the first page of a generated PDF document.");

  auto &second = doc.add_page(
      rixlib::pdf::PageSize::A4().as_landscape());

  second.heading(
      second.x_left(),
      second.y_top(),
      "Second page",
      1);

  second.paragraph(
      second.x_left(),
      second.y_top() - 50.0F,
      second.content_width(),
      "This page uses a landscape A4 page size.");

  auto saved = rix.pdf.save(doc, "multi-page.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "multi-page.pdf");
  rix.debug.print("pages:", doc.page_count());

  return 0;
}
```

Run:

```bash id="u8x5fc"
vix run document.cpp
```

## Save the document

Use:

```cpp id="c7x2rg"
auto saved = rix.pdf.save(doc, "document.pdf");
```

Always check errors:

```cpp id="w1h8yt"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

## Write the document to memory

Use:

```cpp id="q5e7cm"
auto bytes = rix.pdf.write(doc);
```

Example:

```cpp id="p3g9sa"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(bytes.error()),
      bytes.error().message());

  return 1;
}

rix.debug.print("bytes:", bytes.value().size());
```

Use `write` when you need the generated PDF bytes instead of a file.

## Empty documents

If a document has no pages, the writer can still generate a valid PDF by adding a blank default page during serialization.

Even so, it is clearer to add pages explicitly:

```cpp id="j9w2bh"
auto &page = doc.add_page();
```

Do this when the output should contain visible content.

## Use in a Vix project

Create a Vix application:

```bash id="y2q7vp"
vix new pdf-document --app
cd pdf-document
```

Add Rix:

```bash id="q6k8rm"
vix add rix/rix
vix install
```

In `vix.app`, make sure Rix is listed under `deps`:

```txt id="r6s8pd"
deps = [
  "rix/rix",
]
```

A small `vix.app` can look like this:

```txt id="l1m8qa"
name = "pdf-document"
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

```cpp id="v8c9ha"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Document example");

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix.pdf");

  auto saved = rix.pdf.save(doc, "document.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "document.pdf");
  return 0;
}
```

Build and run:

```bash id="k0v3wp"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments:

```bash id="u4e8dc"
vix run document.cpp
```

If Rix is installed globally for single-file usage:

```bash id="b8k2ws"
vix install -g rix/rix
vix run document.cpp
```

For project usage, prefer:

```bash id="c5d9hm"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="n7w3zf"
deps = [
  "rix/rix",
]
```

## Use only PDF with the facade

If you want the `rix.*` facade style but only want PDF mounted, define the feature macro before including `rix.hpp`:

```cpp id="x6h9vc"
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

  return rix.pdf.save(doc, "document.pdf").ok() ? 0 : 1;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Use the independent package

For independent usage, install:

```bash id="q2z5mu"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="d9t4fx"
deps = [
  "rix/pdf",
]
```

Then include:

```cpp id="n3b6hw"
#include <rix/pdf.hpp>
```

Use this style when a project only needs PDF and does not need the full unified Rix facade.

For most application documentation, prefer:

```cpp id="s7k8yf"
#include <rix.hpp>
```

## Common mistakes

### Forgetting to add a page

Wrong:

```cpp id="x3w9tp"
auto doc = rix.pdf.document();

page.text(0.0F, 0.0F, "Hello");
```

Correct:

```cpp id="c8v5mk"
auto doc = rix.pdf.document();

auto &page = doc.add_page();

page.text(
    page.x_left(),
    page.y_top(),
    "Hello");
```

### Forgetting to save the document

Creating pages does not write a file.

Wrong:

```cpp id="u2m7fd"
auto doc = rix.pdf.document();
doc.add_page();
```

Correct:

```cpp id="s8x5nh"
auto saved = rix.pdf.save(doc, "document.pdf");
```

### Not checking save errors

Wrong:

```cpp id="w8q6md"
rix.pdf.save(doc, "document.pdf");
```

Better:

```cpp id="s1n6yb"
auto saved = rix.pdf.save(doc, "document.pdf");

if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

### Using invalid page indexes

Wrong:

```cpp id="v5a8sp"
auto &page = doc.page(0);
```

when the document has no pages.

Better:

```cpp id="u8j5lc"
if (doc.page_count() > 0)
{
  auto &page = doc.page(0);
}
```

### Confusing `deps` and `packages`

For a Vix project, do not put Rix packages in `packages`.

Wrong:

```txt id="u7c9mp"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="q7k3rv"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

## What you should remember

Create a document:

```cpp id="q9r2vs"
auto doc = rix.pdf.document();
```

Create a document with defaults:

```cpp id="v4p6xm"
auto doc = rix.pdf.document(
    rixlib::pdf::PageSize::A4(),
    rixlib::pdf::Margins::one_inch());
```

Add a page:

```cpp id="w3h7zt"
auto &page = doc.add_page();
```

Add metadata:

```cpp id="h8m5qa"
doc.set_title("Title")
    .set_author("Rix");
```

Save:

```cpp id="g4q9fd"
auto saved = rix.pdf.save(doc, "document.pdf");
```

Check errors:

```cpp id="j7t2cb"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());
}
```

For a Vix project, install Rix:

```bash id="f5k2ns"
vix add rix/rix
vix install
```

and use:

```txt id="f6v8nw"
deps = [
  "rix/rix",
]
```

## Next step

Learn how to work with pages.

Next: [Page](./text)
