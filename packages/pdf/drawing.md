# Drawing

This page explains how to draw simple shapes with `rix/pdf`.

The examples use the public Rix facade:

```cpp id="m8q4vn"
#include <rix.hpp>
```

and access PDF through:

```cpp id="v3k9pa"
rix.pdf
```

Drawing primitives are useful for separators, boxes, highlights, simple diagrams, report sections, cards, badges, and visual structure inside generated PDF documents.

## Basic drawing example

Create a file:

```bash id="s8x2hd"
mkdir -p ~/rix-pdf-drawing
cd ~/rix-pdf-drawing
touch drawing.cpp
```

Add:

```cpp id="k5n9ra"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Rix PDF Drawing Example");

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Drawing primitives",
      1);

  y -= 20.0F;

  page.line(
      page.x_left(),
      y,
      page.x_right(),
      y,
      1.5F,
      rixlib::pdf::Color::blue_color());

  y -= 70.0F;

  page.rect(
      page.x_left(),
      y,
      140.0F,
      50.0F);

  page.fill_rect(
      page.x_left() + 170.0F,
      y,
      140.0F,
      50.0F,
      rixlib::pdf::Color::light_gray());

  page.fill_stroke_rect(
      page.x_left() + 340.0F,
      y,
      140.0F,
      50.0F,
      rixlib::pdf::Color::white(),
      rixlib::pdf::Color::black());

  y -= 100.0F;

  page.circle(
      page.x_left() + 70.0F,
      y,
      35.0F,
      1.0F,
      rixlib::pdf::Color::red_color());

  page.circle(
      page.x_left() + 230.0F,
      y,
      35.0F,
      1.0F,
      rixlib::pdf::Color::green_color(),
      true);

  page.circle(
      page.x_left() + 390.0F,
      y,
      35.0F,
      1.0F,
      rixlib::pdf::Color::blue_color());

  auto saved = rix.pdf.save(doc, "drawing.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "drawing.pdf");
  return 0;
}
```

Run it:

```bash id="p2d6wq"
vix run drawing.cpp
```

If Rix is not available yet for single-file usage:

```bash id="c7h5za"
vix install -g rix/rix
vix run drawing.cpp
```

This creates:

```txt id="q4f8xm"
drawing.pdf
```

## Drawing coordinates

Drawing happens on a page.

PDF coordinates use points.

One point is 1/72 inch.

The page exposes helpers:

```cpp id="r9c2vy"
page.x_left()
page.x_right()
page.y_top()
page.y_bottom()
page.content_width()
page.content_height()
```

Use these helpers to stay inside the visible content area.

## Draw a line

Use:

```cpp id="d3t7qp"
page.line(x1, y1, x2, y2);
```

Example:

```cpp id="f6m8ra"
page.line(
    page.x_left(),
    page.y_top(),
    page.x_right(),
    page.y_top());
```

This draws a horizontal line across the content area.

## Line width and color

You can pass a line width and color:

```cpp id="h8v5sc"
page.line(
    page.x_left(),
    page.y_top(),
    page.x_right(),
    page.y_top(),
    1.5F,
    rixlib::pdf::Color::blue_color());
```

The line width is expressed in points.

## Line styles

Use `rixlib::pdf::LineStyle` for stroke patterns:

```cpp id="n2q9ba"
rixlib::pdf::LineStyle::Solid
rixlib::pdf::LineStyle::Dashed
rixlib::pdf::LineStyle::Dotted
```

Example:

```cpp id="w5x8nh"
page.line(
    page.x_left(),
    page.y_top(),
    page.x_right(),
    page.y_top(),
    1.0F,
    rixlib::pdf::Color::gray(),
    rixlib::pdf::LineStyle::Dashed);
```

## Horizontal rule

Use `hrule` for a simple horizontal separator:

```cpp id="z4k7dq"
page.hrule(page.y_top() - 40.0F);
```

You can customize the range:

```cpp id="g7c3xm"
page.hrule(
    page.y_top() - 40.0F,
    page.x_left(),
    page.x_right(),
    0.5F,
    rixlib::pdf::Color::gray());
```

Use `hrule` when you want a clean divider between document sections.

## Draw a rectangle

Use:

```cpp id="q8p2ln"
page.rect(x, y, width, height);
```

Example:

```cpp id="a5m9vf"
page.rect(
    page.x_left(),
    page.y_top() - 80.0F,
    180.0F,
    60.0F);
```

This draws a stroked rectangle.

## Rectangle line width and color

```cpp id="k4x6sr"
page.rect(
    page.x_left(),
    page.y_top() - 80.0F,
    180.0F,
    60.0F,
    1.0F,
    rixlib::pdf::Color::blue_color());
```

## Draw a filled rectangle

Use:

```cpp id="p9s3dw"
page.fill_rect(x, y, width, height, color);
```

Example:

```cpp id="c2v8mq"
page.fill_rect(
    page.x_left(),
    page.y_top() - 80.0F,
    180.0F,
    60.0F,
    rixlib::pdf::Color::light_gray());
```

Filled rectangles are useful for highlights, cards, headers, and table-like sections.

## Draw a filled and stroked rectangle

Use:

```cpp id="v6r5yt"
page.fill_stroke_rect(
    x,
    y,
    width,
    height,
    fill_color,
    stroke_color,
    line_width);
```

Example:

```cpp id="b4n7qa"
page.fill_stroke_rect(
    page.x_left(),
    page.y_top() - 80.0F,
    180.0F,
    60.0F,
    rixlib::pdf::Color::white(),
    rixlib::pdf::Color::black(),
    1.0F);
```

Use this when a box needs both background and border.

## Draw a circle

Use:

```cpp id="u2k9md"
page.circle(cx, cy, radius);
```

Example:

```cpp id="h5s8xp"
page.circle(
    page.x_left() + 40.0F,
    page.y_top() - 80.0F,
    30.0F);
```

The first two values are the center position.

The third value is the radius.

## Circle width and color

```cpp id="m7q4th"
page.circle(
    page.x_left() + 40.0F,
    page.y_top() - 80.0F,
    30.0F,
    1.0F,
    rixlib::pdf::Color::red_color());
```

## Filled circle

Pass `true` as the final argument:

```cpp id="x8p3dc"
page.circle(
    page.x_left() + 40.0F,
    page.y_top() - 80.0F,
    30.0F,
    1.0F,
    rixlib::pdf::Color::green_color(),
    true);
```

Use filled circles for badges, status indicators, and simple diagrams.

## Colors

Use `rixlib::pdf::Color`.

Common colors:

```cpp id="a9v7bh"
rixlib::pdf::Color::black()
rixlib::pdf::Color::white()
rixlib::pdf::Color::red_color()
rixlib::pdf::Color::green_color()
rixlib::pdf::Color::blue_color()
rixlib::pdf::Color::gray()
rixlib::pdf::Color::light_gray()
```

Create a color from hexadecimal RGB:

```cpp id="j3m6fq"
auto color = rixlib::pdf::Color::from_hex(0x2C3E50);
```

Example:

```cpp id="n6q8rk"
page.fill_rect(
    page.x_left(),
    page.y_top() - 80.0F,
    200.0F,
    60.0F,
    rixlib::pdf::Color::from_hex(0xF3F4F6));
```

## Use units

Drawing values are points, but you can use helpers:

```cpp id="d5v2xc"
rixlib::pdf::inches(1.0F)
rixlib::pdf::millimeters(20.0F)
rixlib::pdf::centimeters(2.0F)
```

Example:

```cpp id="q2n8ma"
page.rect(
    rixlib::pdf::inches(1.0F),
    rixlib::pdf::inches(9.0F),
    rixlib::pdf::inches(3.0F),
    rixlib::pdf::inches(1.0F));
```

Use helpers when the layout is easier to think about in inches or millimeters.

## Draw a card

A card is just a filled and stroked rectangle with text inside.

```cpp id="r4x9vt"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  auto x = page.x_left();
  auto y = page.y_top() - 80.0F;

  page.fill_stroke_rect(
      x,
      y,
      260.0F,
      80.0F,
      rixlib::pdf::Color::light_gray(),
      rixlib::pdf::Color::gray(),
      0.75F);

  page.text(
      x + 16.0F,
      y + 50.0F,
      "Rix PDF",
      rixlib::pdf::TextStyle{
          rixlib::pdf::Font::HelveticaBold,
          14.0F});

  page.text(
      x + 16.0F,
      y + 28.0F,
      "Generated with C++ and Rix.");

  auto saved = rix.pdf.save(doc, "card.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "card.pdf");
  return 0;
}
```

Run:

```bash id="b8c5yz"
vix run drawing.cpp
```

## Draw section dividers

Use headings with horizontal rules:

```cpp id="y4n2fv"
auto y = page.heading(
    page.x_left(),
    page.y_top(),
    "Report",
    1);

y -= 10.0F;

page.hrule(
    y,
    page.x_left(),
    page.x_right(),
    0.5F,
    rixlib::pdf::Color::gray());

y -= 25.0F;

page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "This section starts below the divider.");
```

This is useful for reports and generated documents.

## Draw a simple status badge

```cpp id="w6r9xp"
auto x = page.x_left();
auto y = page.y_top() - 80.0F;

page.fill_stroke_rect(
    x,
    y,
    120.0F,
    32.0F,
    rixlib::pdf::Color::light_gray(),
    rixlib::pdf::Color::gray(),
    0.5F);

page.circle(
    x + 16.0F,
    y + 16.0F,
    5.0F,
    1.0F,
    rixlib::pdf::Color::green_color(),
    true);

page.text(
    x + 30.0F,
    y + 11.0F,
    "Ready",
    rixlib::pdf::TextStyle::small());
```

Use this pattern for generated status reports.

## Draw a simple layout grid

```cpp id="q9h6zc"
auto x = page.x_left();
auto y = page.y_top() - 80.0F;

const auto card_width = 150.0F;
const auto card_height = 70.0F;
const auto gap = 20.0F;

for (int i = 0; i < 3; ++i)
{
  const auto card_x = x + static_cast<float>(i) * (card_width + gap);

  page.fill_stroke_rect(
      card_x,
      y,
      card_width,
      card_height,
      rixlib::pdf::Color::white(),
      rixlib::pdf::Color::gray(),
      0.5F);

  page.text(
      card_x + 12.0F,
      y + 42.0F,
      "Card");
}
```

This can be useful for simple dashboards and summary pages.

## Complete drawing document

```cpp id="r8c7qa"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Rix PDF Drawing Example");

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Drawing primitives",
      1);

  y -= 20.0F;

  page.line(
      page.x_left(),
      y,
      page.x_right(),
      y,
      1.5F,
      rixlib::pdf::Color::blue_color());

  y -= 70.0F;

  page.rect(
      page.x_left(),
      y,
      140.0F,
      50.0F);

  page.fill_rect(
      page.x_left() + 170.0F,
      y,
      140.0F,
      50.0F,
      rixlib::pdf::Color::light_gray());

  page.fill_stroke_rect(
      page.x_left() + 340.0F,
      y,
      140.0F,
      50.0F,
      rixlib::pdf::Color::white(),
      rixlib::pdf::Color::black());

  y -= 100.0F;

  page.circle(
      page.x_left() + 70.0F,
      y,
      35.0F,
      1.0F,
      rixlib::pdf::Color::red_color());

  page.circle(
      page.x_left() + 230.0F,
      y,
      35.0F,
      1.0F,
      rixlib::pdf::Color::green_color(),
      true);

  page.circle(
      page.x_left() + 390.0F,
      y,
      35.0F,
      1.0F,
      rixlib::pdf::Color::blue_color());

  auto saved = rix.pdf.save(doc, "rix_pdf_drawing.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "rix_pdf_drawing.pdf");
  return 0;
}
```

Run:

```bash id="x5h2vr"
vix run drawing.cpp
```

## Combine drawing and tables

Drawing primitives can be used around tables.

```cpp id="v8m3pq"
auto y = page.heading(
    page.x_left(),
    page.y_top(),
    "Report",
    1);

y -= 15.0F;

page.hrule(
    y,
    page.x_left(),
    page.x_right());

y -= 25.0F;

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

y = page.table(
    page.x_left(),
    y,
    table);
```

Use drawing for structure.

Use tables for data.

## Combine drawing and text

```cpp id="m2r6fy"
auto x = page.x_left();
auto y = page.y_top() - 80.0F;

page.fill_rect(
    x,
    y,
    page.content_width(),
    70.0F,
    rixlib::pdf::Color::light_gray());

page.text(
    x + 16.0F,
    y + 42.0F,
    "Summary",
    rixlib::pdf::TextStyle{
        rixlib::pdf::Font::HelveticaBold,
        14.0F});

page.text(
    x + 16.0F,
    y + 20.0F,
    "This block uses a filled rectangle behind text.");
```

Use this for highlighted sections.

## Save the PDF

Use:

```cpp id="c6r2kb"
auto saved = rix.pdf.save(doc, "drawing.pdf");
```

Always check errors:

```cpp id="f3v9yt"
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

```cpp id="w4t7xm"
auto bytes = rix.pdf.write(doc);
```

Example:

```cpp id="n5a8qp"
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

Use `write` when you want to return PDF bytes from another API or save them yourself.

Use `save` when you want to write directly to a file.

## Use in a Vix project

Create a Vix application:

```bash id="d8k3mz"
vix new pdf-drawing --app
cd pdf-drawing
```

Add Rix:

```bash id="b4h9qn"
vix add rix/rix
vix install
```

In `vix.app`, make sure Rix is listed under `deps`:

```txt id="s2x6dr"
deps = [
  "rix/rix",
]
```

A small `vix.app` can look like this:

```txt id="q6n4va"
name = "pdf-drawing"
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

Then use drawing in `src/main.cpp`:

```cpp id="m9t7fc"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.line(
      page.x_left(),
      page.y_top(),
      page.x_right(),
      page.y_top(),
      1.0F,
      rixlib::pdf::Color::blue_color());

  auto saved = rix.pdf.save(doc, "drawing.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "drawing.pdf");
  return 0;
}
```

Build and run:

```bash id="z7p8wc"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments:

```bash id="c5n9qv"
vix run drawing.cpp
```

If Rix is installed globally for single-file usage:

```bash id="h3s7dn"
vix install -g rix/rix
vix run drawing.cpp
```

For project usage, prefer:

```bash id="j8q6vb"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="e4m9ks"
deps = [
  "rix/rix",
]
```

## Use only PDF with the facade

If you want the `rix.*` facade style but only want PDF mounted, define the feature macro before including `rix.hpp`:

```cpp id="p6a3xr"
#define RIX_ENABLE_PDF
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.rect(
      page.x_left(),
      page.y_top() - 80.0F,
      180.0F,
      60.0F);

  return rix.pdf.save(doc, "drawing.pdf").ok() ? 0 : 1;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Use the independent package

For independent usage, install:

```bash id="x4c7mv"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="f8n3tb"
deps = [
  "rix/pdf",
]
```

Then include:

```cpp id="r7d2hq"
#include <rix/pdf.hpp>
```

Use this style when a project only needs PDF and does not need the full unified Rix facade.

For most application documentation, prefer:

```cpp id="k5v8cn"
#include <rix.hpp>
```

## Common mistakes

### Drawing outside the page

This may not be visible:

```cpp id="y8t2vx"
page.rect(0.0F, -50.0F, 100.0F, 50.0F);
```

Use page helpers:

```cpp id="p4m6dz"
page.x_left()
page.y_top()
page.y_bottom()
```

### Forgetting that Y moves downward by subtracting

To draw lower on the page, subtract from Y:

```cpp id="q9h3wr"
auto y = page.y_top();

page.text(page.x_left(), y, "First");

y -= 40.0F;

page.text(page.x_left(), y, "Second");
```

### Using too large shapes

A rectangle wider than the content area can overflow:

```cpp id="b2k7ny"
page.rect(
    page.x_left(),
    page.y_top(),
    1000.0F,
    100.0F);
```

Prefer:

```cpp id="m3q8fc"
page.rect(
    page.x_left(),
    page.y_top() - 100.0F,
    page.content_width(),
    100.0F);
```

### Not checking save errors

Wrong:

```cpp id="s5n9qc"
rix.pdf.save(doc, "drawing.pdf");
```

Better:

```cpp id="g7w4bt"
auto saved = rix.pdf.save(doc, "drawing.pdf");

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

```txt id="k8h5vy"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="c3r6jq"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

## What you should remember

Draw a line:

```cpp id="v6x9ka"
page.line(
    page.x_left(),
    page.y_top(),
    page.x_right(),
    page.y_top());
```

Draw a rectangle:

```cpp id="m4p8cn"
page.rect(
    page.x_left(),
    page.y_top() - 80.0F,
    180.0F,
    60.0F);
```

Draw a filled rectangle:

```cpp id="z9f7qb"
page.fill_rect(
    page.x_left(),
    page.y_top() - 80.0F,
    180.0F,
    60.0F,
    rixlib::pdf::Color::light_gray());
```

Draw a circle:

```cpp id="j5q8tw"
page.circle(
    page.x_left() + 40.0F,
    page.y_top() - 80.0F,
    30.0F);
```

Use colors:

```cpp id="n7v2rc"
rixlib::pdf::Color::blue_color()
rixlib::pdf::Color::gray()
rixlib::pdf::Color::from_hex(0x2C3E50)
```

Save the document:

```cpp id="a4b9kx"
auto saved = rix.pdf.save(doc, "drawing.pdf");
```

For a Vix project, install Rix:

```bash id="y2p6mv"
vix add rix/rix
vix install
```

and use:

```txt id="r8c5ht"
deps = [
  "rix/rix",
]
```

## Next step

Learn PDF metadata.

Next: [Metadata](./metadata)
