# Text

This page explains how to write text with `rix/pdf`.

The examples use the public Rix facade:

```cpp id="p8k2xm"
#include <rix.hpp>
```

and access PDF through:

```cpp id="z6n4qa"
rix.pdf
```

Text is written on a page. A page provides helpers for normal text, aligned text, paragraphs, headings, and page numbers.

## Basic text example

Create a file:

```bash id="m7v3qd"
mkdir -p ~/rix-pdf-text
cd ~/rix-pdf-text
touch text.cpp
```

Add:

```cpp id="f9k1sw"
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
      "This is a second line of text.");

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

Run it:

```bash id="w4c9rb"
vix run text.cpp
```

If Rix is not available yet for single-file usage:

```bash id="q2t8nf"
vix install -g rix/rix
vix run text.cpp
```

## Write one line of text

Use:

```cpp id="j7n5hv"
page.text(x, y, value);
```

Example:

```cpp id="n6q2cp"
page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");
```

The first argument is the X position.

The second argument is the Y position.

The third argument is the text value.

## Use page helper positions

A page provides useful layout helpers:

```cpp id="b5y8xd"
page.x_left()
page.x_right()
page.y_top()
page.y_bottom()
page.content_width()
page.content_height()
```

For normal text, start with:

```cpp id="e3p9ak"
page.x_left()
page.y_top()
```

Example:

```cpp id="p1h7gm"
page.text(
    page.x_left(),
    page.y_top(),
    "Top-left content text");
```

## Move text down

To draw another line below, subtract from the Y position:

```cpp id="t4m6jk"
page.text(
    page.x_left(),
    page.y_top() - 30.0F,
    "Second line");
```

PDF coordinates use points.

One point is 1/72 inch.

## Use units

Instead of raw numbers, you can use unit helpers:

```cpp id="h8b6yc"
rixlib::pdf::inches(1.0F)
rixlib::pdf::millimeters(20.0F)
rixlib::pdf::centimeters(2.0F)
```

Example:

```cpp id="s5q9fz"
page.text(
    rixlib::pdf::inches(1.0F),
    rixlib::pdf::inches(10.0F),
    "Text positioned with inch units");
```

## Text style

Use `rixlib::pdf::TextStyle` to control the font, size, color, and line height.

Example:

```cpp id="f2v9tr"
page.text(
    page.x_left(),
    page.y_top(),
    "Blue text",
    rixlib::pdf::TextStyle{
        rixlib::pdf::Font::Helvetica,
        12.0F,
        rixlib::pdf::Color::blue_color()});
```

The constructor accepts:

```txt id="j5g9cx"
font
font size
color
line height
```

## Default text style

The default text style uses:

```txt id="p6a2vd"
Helvetica
12pt
black
1.2 line height
```

So this:

```cpp id="w3m8bn"
page.text(
    page.x_left(),
    page.y_top(),
    "Default text");
```

uses the normal text style.

## Common text styles

Use:

```cpp id="a4h7nv"
rixlib::pdf::TextStyle::normal()
rixlib::pdf::TextStyle::heading()
rixlib::pdf::TextStyle::small()
```

Example:

```cpp id="k2x5qa"
page.text(
    page.x_left(),
    page.y_top(),
    "Small text",
    rixlib::pdf::TextStyle::small());
```

## Change text size

```cpp id="z9h4mc"
page.text(
    page.x_left(),
    page.y_top(),
    "Large text",
    rixlib::pdf::TextStyle{
        rixlib::pdf::Font::Helvetica,
        18.0F});
```

## Change text color

```cpp id="s7p2kl"
page.text(
    page.x_left(),
    page.y_top(),
    "Red text",
    rixlib::pdf::TextStyle{
        rixlib::pdf::Font::Helvetica,
        12.0F,
        rixlib::pdf::Color::red_color()});
```

Common colors:

```cpp id="h2m8vn"
rixlib::pdf::Color::black()
rixlib::pdf::Color::white()
rixlib::pdf::Color::red_color()
rixlib::pdf::Color::green_color()
rixlib::pdf::Color::blue_color()
rixlib::pdf::Color::gray()
rixlib::pdf::Color::light_gray()
```

Create a color from hexadecimal RGB:

```cpp id="d6y7qb"
auto color = rixlib::pdf::Color::from_hex(0x2C3E50);
```

## Fonts

Standard PDF fonts are available through `rixlib::pdf::Font`.

Common fonts:

```cpp id="e8x3vf"
rixlib::pdf::Font::Helvetica
rixlib::pdf::Font::HelveticaBold
rixlib::pdf::Font::HelveticaOblique
rixlib::pdf::Font::Times
rixlib::pdf::Font::TimesBold
rixlib::pdf::Font::Courier
rixlib::pdf::Font::CourierBold
```

Example:

```cpp id="q9n4ts"
page.text(
    page.x_left(),
    page.y_top(),
    "Bold heading text",
    rixlib::pdf::TextStyle{
        rixlib::pdf::Font::HelveticaBold,
        18.0F});
```

## Build a font from family and style

Use:

```cpp id="m4g7rb"
rixlib::pdf::make_font(family, style)
```

Example:

```cpp id="j6v1qd"
auto font = rixlib::pdf::make_font(
    rixlib::pdf::FontFamily::Helvetica,
    rixlib::pdf::FontStyle::Bold);

page.text(
    page.x_left(),
    page.y_top(),
    "Bold text",
    rixlib::pdf::TextStyle{
        font,
        14.0F});
```

## Aligned text

Use:

```cpp id="g7x5hm"
page.text_aligned(x, y, width, value, align, style);
```

Example:

```cpp id="f4n8ky"
page.text_aligned(
    page.x_left(),
    page.y_top(),
    page.content_width(),
    "Centered text",
    rixlib::pdf::Align::Center);
```

Available alignment values:

```cpp id="r1z6qa"
rixlib::pdf::Align::Left
rixlib::pdf::Align::Center
rixlib::pdf::Align::Right
rixlib::pdf::Align::Justify
```

For single-line text, use left, center, or right alignment.

For paragraphs, justify is more useful.

## Left aligned text

```cpp id="p3m2vn"
page.text_aligned(
    page.x_left(),
    page.y_top(),
    page.content_width(),
    "Left aligned",
    rixlib::pdf::Align::Left);
```

## Centered text

```cpp id="c7w6bt"
page.text_aligned(
    page.x_left(),
    page.y_top() - 30.0F,
    page.content_width(),
    "Centered",
    rixlib::pdf::Align::Center);
```

## Right aligned text

```cpp id="r9f4mx"
page.text_aligned(
    page.x_left(),
    page.y_top() - 60.0F,
    page.content_width(),
    "Right aligned",
    rixlib::pdf::Align::Right);
```

## Paragraphs

Use:

```cpp id="d5k8xb"
page.paragraph(x, y, width, value);
```

A paragraph wraps text inside the given width.

Example:

```cpp id="q2j9hp"
auto y = page.y_top();

y = page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "Rix PDF can wrap longer text into multiple lines. "
    "This is useful for reports, generated documents, and simple text files.");
```

`paragraph` returns the next Y position after the paragraph.

Use the returned value to continue writing below.

## Paragraph with spacing

```cpp id="h6s5md"
auto y = page.y_top();

y = page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "First paragraph.");

y -= 15.0F;

y = page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "Second paragraph.");
```

## Centered paragraph

```cpp id="k8z5fy"
page.paragraph(
    page.x_left(),
    page.y_top(),
    page.content_width(),
    "This paragraph is centered.",
    rixlib::pdf::Align::Center);
```

## Styled paragraph

```cpp id="x5j3qb"
page.paragraph(
    page.x_left(),
    page.y_top(),
    page.content_width(),
    "This paragraph uses blue text.",
    rixlib::pdf::Align::Left,
    rixlib::pdf::TextStyle{
        rixlib::pdf::Font::Helvetica,
        12.0F,
        rixlib::pdf::Color::blue_color()});
```

## Headings

Use:

```cpp id="q4s7vj"
page.heading(x, y, value, level);
```

Example:

```cpp id="u7k2xm"
auto y = page.heading(
    page.x_left(),
    page.y_top(),
    "Rix PDF",
    1);
```

The heading function returns the next Y position.

Continue below it:

```cpp id="p5v8hq"
y -= 10.0F;

page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "The document starts below the heading.");
```

## Heading levels

Heading levels go from 1 to 6:

```cpp id="a9n2rd"
page.heading(page.x_left(), y, "Heading 1", 1);
page.heading(page.x_left(), y, "Heading 2", 2);
page.heading(page.x_left(), y, "Heading 3", 3);
```

Larger heading levels use smaller visual sizes.

## Heading color

```cpp id="w6m4xc"
page.heading(
    page.x_left(),
    page.y_top(),
    "Blue heading",
    1,
    rixlib::pdf::Color::blue_color());
```

## Page numbers

Use:

```cpp id="y5c9ra"
page.page_number(number, total);
```

Example:

```cpp id="n3t7fd"
page.page_number(1, 3);
```

You can set a custom Y position:

```cpp id="e7x6pm"
page.page_number(
    1,
    3,
    page.y_bottom() - 20.0F);
```

You can also pass a text style:

```cpp id="r8w3vk"
page.page_number(
    1,
    3,
    page.y_bottom() - 20.0F,
    rixlib::pdf::TextStyle::small());
```

## Complete text document

```cpp id="m9c7ps"
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

  page.page_number(1, 1);

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

Run:

```bash id="g8t5xd"
vix run text.cpp
```

## Multiple text sections

```cpp id="z2q6ar"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  auto y = page.y_top();

  y = page.heading(
      page.x_left(),
      y,
      "Report",
      1);

  y -= 15.0F;

  y = page.paragraph(
      page.x_left(),
      y,
      page.content_width(),
      "This is the introduction section.");

  y -= 20.0F;

  y = page.heading(
      page.x_left(),
      y,
      "Details",
      2);

  y -= 10.0F;

  page.paragraph(
      page.x_left(),
      y,
      page.content_width(),
      "This is the details section.");

  auto saved = rix.pdf.save(doc, "sections.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "sections.pdf");
  return 0;
}
```

## Use with `make_text`

For a very simple text-only PDF, use:

```cpp id="r2v5xp"
auto saved = rix.pdf.make_text(
    "hello.pdf",
    "Hello from rix.pdf",
    "Rix PDF");
```

Complete example:

```cpp id="s8c6qm"
#include <rix.hpp>

int main()
{
  auto saved = rix.pdf.make_text(
      "hello.pdf",
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

  rix.debug.print("created:", "hello.pdf");
  return 0;
}
```

Use `make_text` for the fastest simple text document.

Use `document()` when you need more control.

## Save the PDF

Use:

```cpp id="b4v7nk"
auto saved = rix.pdf.save(doc, "text.pdf");
```

Always check errors:

```cpp id="y9q5ka"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

## Write PDF bytes

Use:

```cpp id="q6n1xm"
auto bytes = rix.pdf.write(doc);
```

Example:

```cpp id="w8h3fd"
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

Use `write` when you want PDF bytes in memory.

Use `save` when you want to write a PDF file directly.

## Use in a Vix project

Create a Vix application:

```bash id="t7b4vq"
vix new pdf-text --app
cd pdf-text
```

Add Rix:

```bash id="q3n8wj"
vix add rix/rix
vix install
```

In `vix.app`, make sure Rix is listed under `deps`:

```txt id="f9m1vb"
deps = [
  "rix/rix",
]
```

A small `vix.app` can look like this:

```txt id="h6v3ka"
name = "pdf-text"
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

Then use text in `src/main.cpp`:

```cpp id="r8n5qc"
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

Build and run:

```bash id="m5z7qh"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments:

```bash id="p6c3rs"
vix run text.cpp
```

If Rix is installed globally for single-file usage:

```bash id="a2k5yd"
vix install -g rix/rix
vix run text.cpp
```

For project usage, prefer:

```bash id="e6q4hf"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="q1y9kb"
deps = [
  "rix/rix",
]
```

## Use only PDF with the facade

If you want the `rix.*` facade style but only want PDF mounted, define the feature macro before including `rix.hpp`:

```cpp id="c9r2nd"
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

  return rix.pdf.save(doc, "text.pdf").ok() ? 0 : 1;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Use the independent package

For independent usage, install:

```bash id="d5k8vq"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="z4h7cm"
deps = [
  "rix/pdf",
]
```

Then include:

```cpp id="b7m4wx"
#include <rix/pdf.hpp>
```

Use this style when a project only needs PDF and does not need the full unified Rix facade.

For most application documentation, prefer:

```cpp id="j6x9nt"
#include <rix.hpp>
```

## Common mistakes

### Forgetting to add a page

Wrong:

```cpp id="q5j2hm"
auto doc = rix.pdf.document();

page.text(
    page.x_left(),
    page.y_top(),
    "Hello");
```

Correct:

```cpp id="r4x7vk"
auto doc = rix.pdf.document();

auto &page = doc.add_page();

page.text(
    page.x_left(),
    page.y_top(),
    "Hello");
```

### Drawing text outside the visible page

Wrong:

```cpp id="t1v6pq"
page.text(0.0F, -50.0F, "Hidden text");
```

Use page helpers:

```cpp id="c7q3nd"
page.x_left()
page.y_top()
page.y_bottom()
```

### Forgetting to update Y

This draws both lines on top of each other:

```cpp id="v2s8bf"
page.text(page.x_left(), page.y_top(), "First");
page.text(page.x_left(), page.y_top(), "Second");
```

Move the second line down:

```cpp id="j8x6mw"
page.text(page.x_left(), page.y_top(), "First");
page.text(page.x_left(), page.y_top() - 30.0F, "Second");
```

### Not checking save errors

Wrong:

```cpp id="w6z7fp"
rix.pdf.save(doc, "text.pdf");
```

Better:

```cpp id="k9m4hx"
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

### Confusing `deps` and `packages`

For a Vix project, do not put Rix packages in `packages`.

Wrong:

```txt id="x3h2wp"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="j5d9qb"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

## What you should remember

Create a document:

```cpp id="n6k2vz"
auto doc = rix.pdf.document();
```

Add a page:

```cpp id="p8x3rc"
auto &page = doc.add_page();
```

Write text:

```cpp id="m9q5ha"
page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");
```

Write a paragraph:

```cpp id="g2t8kn"
page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "Long text here.");
```

Write a heading:

```cpp id="d4v9qc"
auto y = page.heading(
    page.x_left(),
    page.y_top(),
    "Title",
    1);
```

Use style:

```cpp id="a7s2mx"
rixlib::pdf::TextStyle{
    rixlib::pdf::Font::Helvetica,
    12.0F,
    rixlib::pdf::Color::blue_color()}
```

Save:

```cpp id="w3k6vf"
auto saved = rix.pdf.save(doc, "text.pdf");
```

For a Vix project, install Rix:

```bash id="u5h8nx"
vix add rix/rix
vix install
```

and use:

```txt id="f2q9vr"
deps = [
  "rix/rix",
]
```

## Next step

Learn how to work with tables.

Next: [Tables](./tables)
