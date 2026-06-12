# Text

This example shows how to write headings, paragraphs, and aligned text with `rix/pdf`.

The example uses the public Rix facade:

```cpp id="q8m4xa"
#include <rix.hpp>
```

and accesses PDF through:

```cpp id="n5v9qc"
rix.pdf
```

Use this example when you want to create a PDF with styled text content.

## Create the file

```bash id="k7x2ma"
mkdir -p ~/rix-pdf-text-example
cd ~/rix-pdf-text-example
touch text.cpp
```

Add:

```cpp id="p9c5xr"
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

```bash id="q4m8vb"
vix run text.cpp
```

If Rix is not available yet for single-file usage:

```bash id="x2n7pd"
vix install -g rix/rix
vix run text.cpp
```

This creates:

```txt id="t8q5hm"
rix_pdf_text.pdf
```

## What this example does

The example creates a PDF document:

```cpp id="b6x3rd"
auto doc = rix.pdf.document();
```

It sets document metadata:

```cpp id="z5v8ka"
doc.set_title("Rix PDF Text Example");
doc.set_author("Rix");
```

It adds a page:

```cpp id="c9q2mx"
auto &page = doc.add_page();
```

It draws a heading:

```cpp id="h7n4qc"
auto y = page.heading(
    page.x_left(),
    page.y_top(),
    "Rix PDF",
    1);
```

It draws a wrapped paragraph:

```cpp id="d3x8vp"
y = page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "Rix gives Vix C++ projects a unified userland facade.");
```

Then it saves the file:

```cpp id="j2m9wa"
auto saved = rix.pdf.save(doc, "rix_pdf_text.pdf");
```

## Text coordinates

PDF coordinates are expressed in points.

One inch is 72 points.

The example uses page helpers instead of hardcoded positions:

```cpp id="w8c5nr"
page.x_left()
page.y_top()
page.content_width()
```

These helpers keep content inside the page margins.

## Draw one line of text

Use:

```cpp id="k5v7ma"
page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");
```

This draws one line at the given X and Y position.

## Draw a heading

Use:

```cpp id="r6q9xd"
auto y = page.heading(
    page.x_left(),
    page.y_top(),
    "Rix PDF",
    1);
```

The last argument is the heading level.

Common levels are:

```txt id="p2n8fc"
1
2
3
4
5
6
```

`heading` returns the next Y position after the heading.

This makes it easy to continue below:

```cpp id="y4m6qv"
y -= 10.0F;
```

## Draw a paragraph

Use:

```cpp id="f9x3ka"
auto y = page.paragraph(
    page.x_left(),
    page.y_top(),
    page.content_width(),
    "This paragraph will wrap inside the available content width.");
```

The arguments are:

```txt id="m7c5vx"
x position
starting y position
available width
text content
```

`paragraph` wraps text and returns the Y position after the paragraph.

## Continue below a paragraph

Because `paragraph` returns the next Y position, you can continue drawing below it:

```cpp id="q3p8za"
auto y = page.paragraph(
    page.x_left(),
    page.y_top(),
    page.content_width(),
    "First paragraph.");

y -= 20.0F;

page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "Second paragraph.");
```

This is the normal pattern for multi-section text pages.

## Align text

Use `Align` values:

```cpp id="v8n2hr"
rixlib::pdf::Align::Left
rixlib::pdf::Align::Center
rixlib::pdf::Align::Right
rixlib::pdf::Align::Justify
```

Example:

```cpp id="a6q9mx"
page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "Centered text",
    rixlib::pdf::Align::Center);
```

## Draw aligned text on one line

Use `text_aligned`:

```cpp id="r4v8kb"
page.text_aligned(
    page.x_left(),
    page.y_top(),
    page.content_width(),
    "Centered title",
    rixlib::pdf::Align::Center);
```

This is useful for titles, footers, and page labels.

## Style text

Use `TextStyle` when you want to control font, size, color, and line height.

```cpp id="x9m2pd"
rixlib::pdf::TextStyle{
    rixlib::pdf::Font::Helvetica,
    12.0F,
    rixlib::pdf::Color::blue_color()}
```

Example:

```cpp id="c5w9qa"
page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "Blue paragraph",
    rixlib::pdf::Align::Left,
    rixlib::pdf::TextStyle{
        rixlib::pdf::Font::Helvetica,
        12.0F,
        rixlib::pdf::Color::blue_color()});
```

## Common text styles

Use the built-in factories:

```cpp id="z8q2vm"
rixlib::pdf::TextStyle::normal()
rixlib::pdf::TextStyle::heading()
rixlib::pdf::TextStyle::small()
```

Example:

```cpp id="n7x4hd"
page.text(
    page.x_left(),
    page.y_top(),
    "Small note",
    rixlib::pdf::TextStyle::small());
```

## Fonts

Standard PDF fonts are available through `rixlib::pdf::Font`.

Examples:

```cpp id="d6k8rc"
rixlib::pdf::Font::Helvetica
rixlib::pdf::Font::HelveticaBold
rixlib::pdf::Font::Times
rixlib::pdf::Font::Courier
```

Use them in a text style:

```cpp id="g5m9xq"
auto style = rixlib::pdf::TextStyle{
    rixlib::pdf::Font::HelveticaBold,
    14.0F,
    rixlib::pdf::Color::black()};
```

## Colors

Use built-in colors:

```cpp id="y3v8mb"
rixlib::pdf::Color::black()
rixlib::pdf::Color::gray()
rixlib::pdf::Color::blue_color()
rixlib::pdf::Color::red_color()
rixlib::pdf::Color::green_color()
```

Use a hex color:

```cpp id="f4q7vd"
auto color = rixlib::pdf::Color::from_hex(0x2C3E50);
```

Then:

```cpp id="w2x6qp"
auto style = rixlib::pdf::TextStyle{
    rixlib::pdf::Font::Helvetica,
    12.0F,
    color};
```

## Complete text page example

```cpp id="n6c9hd"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Text Page")
      .set_author("Rix");

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Text Page",
      1);

  y -= 12.0F;

  y = page.paragraph(
      page.x_left(),
      y,
      page.content_width(),
      "This is a wrapped paragraph. It uses the content width so text stays inside the page margins.");

  y -= 18.0F;

  page.text_aligned(
      page.x_left(),
      y,
      page.content_width(),
      "Centered line",
      rixlib::pdf::Align::Center,
      rixlib::pdf::TextStyle{
          rixlib::pdf::Font::HelveticaBold,
          14.0F,
          rixlib::pdf::Color::blue_color()});

  auto saved = rix.pdf.save(doc, "text-page.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "text-page.pdf");
  return 0;
}
```

Run:

```bash id="j8q5kc"
vix run text.cpp
```

## Add a page number

Use:

```cpp id="r7x3vm"
page.page_number(1);
```

With total pages:

```cpp id="p6m8xb"
page.page_number(1, 3);
```

Example:

```cpp id="t9q2za"
page.page_number(
    1,
    1,
    page.y_bottom(),
    rixlib::pdf::TextStyle::small());
```

## Create a simple text PDF with `make_text`

For the shortest workflow, use:

```cpp id="x4v7nd"
auto saved = rix.pdf.make_text(
    "hello.pdf",
    "This file was generated with rix.pdf.make_text.",
    "Rix PDF");
```

Complete example:

```cpp id="p4q8zb"
#include <rix.hpp>

int main()
{
  auto saved = rix.pdf.make_text(
      "hello.pdf",
      "This file was generated with rix.pdf.make_text.",
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

Use `make_text` for simple text-only PDFs.

Use `document()` when you need headings, multiple paragraphs, styling, tables, drawings, images, or metadata.

## Save the document

Use:

```cpp id="v2k9qc"
auto saved = rix.pdf.save(doc, "text.pdf");
```

Check errors:

```cpp id="c8w5rp"
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

```cpp id="z4v8qa"
auto bytes = rix.pdf.write(doc);
```

Example:

```cpp id="q8k5mv"
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

## Use in a Vix project

Create a project:

```bash id="d5m9ka"
vix new rix-pdf-text --app
cd rix-pdf-text
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
name = "rix-pdf-text"
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
vix run text.cpp
```

If needed:

```bash id="q2n8vc"
vix install -g rix/rix
vix run text.cpp
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

  auto saved = rix.pdf.save(doc, "text.pdf");

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

  auto saved = rix.pdf.save(doc, "text.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "text.pdf");
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
      "Hello from rix/pdf.");

  auto saved = pdf.save(doc, "text.pdf");

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

### Forgetting that Y moves downward by subtraction

To draw lower on the page, subtract from Y:

```cpp id="q6p9xa"
y -= 20.0F;
```

Then draw:

```cpp id="k4m9xd"
page.text(
    page.x_left(),
    y,
    "Next line");
```

### Expecting metadata to be visible

This sets document metadata:

```cpp id="x8q4vd"
doc.set_title("Rix PDF Text Example");
```

This draws visible text:

```cpp id="n9m5xa"
page.heading(
    page.x_left(),
    page.y_top(),
    "Rix PDF Text Example",
    1);
```

Use both when you want both metadata and visible content.

### Calling `value()` before checking success

Wrong:

```cpp id="a5v8kc"
auto bytes = rix.pdf.write(doc);

rix.debug.print(bytes.value().size());
```

Correct:

```cpp id="m3q7xd"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  return 1;
}

rix.debug.print(bytes.value().size());
```

### Not checking save errors

Wrong:

```cpp id="b8p4qy"
rix.pdf.save(doc, "text.pdf");
```

Correct:

```cpp id="k2m9vc"
auto saved = rix.pdf.save(doc, "text.pdf");

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

Create a document:

```cpp id="r5q8xa"
auto doc = rix.pdf.document();
```

Add a page:

```cpp id="d2v8rc"
auto &page = doc.add_page();
```

Draw a heading:

```cpp id="b5x9ma"
auto y = page.heading(
    page.x_left(),
    page.y_top(),
    "Rix PDF",
    1);
```

Draw a paragraph:

```cpp id="r4q8md"
y = page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "Text content.");
```

Save:

```cpp id="y7m2ka"
auto saved = rix.pdf.save(doc, "text.pdf");
```

Check errors:

```cpp id="f7q3ma"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());
}
```

For project usage:

```bash id="n9x2qc"
vix add rix/rix
vix install
```

and keep:

```txt id="c5v8na"
deps = [
  "rix/rix",
]
```

## Next step

Continue with PDF tables.

Next: [Tables](./table)
