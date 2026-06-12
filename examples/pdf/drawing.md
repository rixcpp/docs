# Drawing

This example shows how to draw lines, rectangles, filled shapes, and circles with `rix/pdf`.

The example uses the public Rix facade:

```cpp id="q8m4xa"
#include <rix.hpp>
```

and accesses PDF through:

```cpp id="n5v9qc"
rix.pdf
```

Use this example when you want to create simple visual elements inside a PDF page.

## Create the file

```bash id="k7x2ma"
mkdir -p ~/rix-pdf-drawing-example
cd ~/rix-pdf-drawing-example
touch drawing.cpp
```

Add:

```cpp id="p9c5xr"
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

Run it:

```bash id="q4m8vb"
vix run drawing.cpp
```

If Rix is not available yet for single-file usage:

```bash id="x2n7pd"
vix install -g rix/rix
vix run drawing.cpp
```

This creates:

```txt id="t8q5hm"
rix_pdf_drawing.pdf
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

It draws a heading:

```cpp id="c9q2mx"
auto y = page.heading(
    page.x_left(),
    page.y_top(),
    "Drawing primitives",
    1);
```

It draws a horizontal line:

```cpp id="h7n4qc"
page.line(
    page.x_left(),
    y,
    page.x_right(),
    y,
    1.5F,
    rixlib::pdf::Color::blue_color());
```

It draws rectangles:

```cpp id="d3x8vp"
page.rect(...);
page.fill_rect(...);
page.fill_stroke_rect(...);
```

It draws circles:

```cpp id="j2m9wa"
page.circle(...);
```

Then it saves the file:

```cpp id="w8c5nr"
auto saved = rix.pdf.save(doc, "rix_pdf_drawing.pdf");
```

## Drawing coordinates

PDF coordinates are expressed in points.

One inch is 72 points.

The example uses page helpers:

```cpp id="k5v7ma"
page.x_left()
page.x_right()
page.y_top()
page.y_bottom()
page.content_width()
page.content_height()
```

These helpers keep drawing inside the page margins.

## Draw a line

Use:

```cpp id="r6q9xd"
page.line(
    x1,
    y1,
    x2,
    y2,
    width,
    color);
```

Example:

```cpp id="p2n8fc"
page.line(
    page.x_left(),
    y,
    page.x_right(),
    y,
    1.5F,
    rixlib::pdf::Color::blue_color());
```

The arguments are:

```txt id="y4m6qv"
start x
start y
end x
end y
line width
line color
```

## Draw a dashed line

Use the line style argument:

```cpp id="f9x3ka"
page.line(
    page.x_left(),
    y,
    page.x_right(),
    y,
    1.0F,
    rixlib::pdf::Color::gray(),
    rixlib::pdf::LineStyle::Dashed);
```

Available line styles are:

```cpp id="m7c5vx"
rixlib::pdf::LineStyle::Solid
rixlib::pdf::LineStyle::Dashed
rixlib::pdf::LineStyle::Dotted
```

## Draw a rectangle

Use:

```cpp id="q3p8za"
page.rect(
    x,
    y,
    width,
    height);
```

Example:

```cpp id="v8n2hr"
page.rect(
    page.x_left(),
    y,
    140.0F,
    50.0F);
```

This draws a stroked rectangle.

## Draw a filled rectangle

Use:

```cpp id="a6q9mx"
page.fill_rect(
    x,
    y,
    width,
    height,
    color);
```

Example:

```cpp id="r4v8kb"
page.fill_rect(
    page.x_left(),
    y,
    140.0F,
    50.0F,
    rixlib::pdf::Color::light_gray());
```

This draws a rectangle filled with the given color.

## Draw a filled and stroked rectangle

Use:

```cpp id="x9m2pd"
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

```cpp id="c5w9qa"
page.fill_stroke_rect(
    page.x_left(),
    y,
    140.0F,
    50.0F,
    rixlib::pdf::Color::white(),
    rixlib::pdf::Color::black(),
    1.0F);
```

Use this when you want both a background and a border.

## Draw a circle

Use:

```cpp id="z8q2vm"
page.circle(
    center_x,
    center_y,
    radius,
    line_width,
    color);
```

Example:

```cpp id="n7x4hd"
page.circle(
    page.x_left() + 70.0F,
    y,
    35.0F,
    1.0F,
    rixlib::pdf::Color::red_color());
```

## Draw a filled circle

Pass `true` as the last argument:

```cpp id="d6k8rc"
page.circle(
    page.x_left() + 70.0F,
    y,
    35.0F,
    1.0F,
    rixlib::pdf::Color::green_color(),
    true);
```

The last argument controls whether the circle is filled.

## Draw a horizontal rule

Use:

```cpp id="g5m9xq"
page.hrule(y);
```

Example:

```cpp id="y3v8mb"
page.hrule(
    y,
    page.x_left(),
    page.x_right(),
    0.5F,
    rixlib::pdf::Color::gray());
```

`hrule` is useful for separating sections.

## Use colors

Common colors:

```cpp id="f4q7vd"
rixlib::pdf::Color::black()
rixlib::pdf::Color::white()
rixlib::pdf::Color::gray()
rixlib::pdf::Color::light_gray()
rixlib::pdf::Color::red_color()
rixlib::pdf::Color::green_color()
rixlib::pdf::Color::blue_color()
```

Create a color from hex:

```cpp id="w2x6qp"
auto color = rixlib::pdf::Color::from_hex(0x2C3E50);
```

Then use it:

```cpp id="n6c9hd"
page.line(
    page.x_left(),
    y,
    page.x_right(),
    y,
    1.0F,
    color);
```

## Complete drawing page

```cpp id="j8q5kc"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Drawing Page")
      .set_author("Rix");

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Drawing Page",
      1);

  y -= 20.0F;

  page.hrule(
      y,
      page.x_left(),
      page.x_right(),
      0.75F,
      rixlib::pdf::Color::gray());

  y -= 70.0F;

  page.fill_stroke_rect(
      page.x_left(),
      y,
      180.0F,
      60.0F,
      rixlib::pdf::Color::light_gray(),
      rixlib::pdf::Color::black(),
      1.0F);

  page.text(
      page.x_left() + 20.0F,
      y + 25.0F,
      "Box");

  page.circle(
      page.x_left() + 280.0F,
      y + 30.0F,
      30.0F,
      1.0F,
      rixlib::pdf::Color::blue_color(),
      true);

  auto saved = rix.pdf.save(doc, "drawing-page.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "drawing-page.pdf");
  return 0;
}
```

Run:

```bash id="r7x3vm"
vix run drawing.cpp
```

## Build a simple card

You can combine filled rectangles, text, and borders to create a card.

```cpp id="p6m8xb"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  const auto x = page.x_left();
  auto y = page.y_top();

  page.fill_stroke_rect(
      x,
      y - 100.0F,
      page.content_width(),
      100.0F,
      rixlib::pdf::Color::light_gray(),
      rixlib::pdf::Color::gray(),
      1.0F);

  page.text(
      x + 20.0F,
      y - 35.0F,
      "Rix PDF Card",
      rixlib::pdf::TextStyle{
          rixlib::pdf::Font::HelveticaBold,
          16.0F,
          rixlib::pdf::Color::black()});

  page.text(
      x + 20.0F,
      y - 65.0F,
      "This card uses drawing primitives.");

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

```bash id="t9q2za"
vix run drawing.cpp
```

## Build a simple status row

```cpp id="x4v7nd"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Status",
      1);

  y -= 40.0F;

  page.circle(
      page.x_left() + 10.0F,
      y + 4.0F,
      5.0F,
      1.0F,
      rixlib::pdf::Color::green_color(),
      true);

  page.text(
      page.x_left() + 30.0F,
      y,
      "Service is running");

  auto saved = rix.pdf.save(doc, "status.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "status.pdf");
  return 0;
}
```

Run:

```bash id="p4q8zb"
vix run drawing.cpp
```

## Draw section separators

Use horizontal rules between sections:

```cpp id="v2k9qc"
auto y = page.heading(
    page.x_left(),
    page.y_top(),
    "Report",
    1);

y -= 15.0F;

page.hrule(y);

y -= 25.0F;

page.text(
    page.x_left(),
    y,
    "Section content");
```

This is useful in reports, invoices, summaries, and exported documents.

## Use drawing with tables

Drawing primitives can be mixed with tables.

```cpp id="c8w5rp"
auto y = page.heading(
    page.x_left(),
    page.y_top(),
    "Report",
    1);

y -= 10.0F;

page.hrule(y);

y -= 25.0F;

rixlib::pdf::Table table;

table.set_column_widths({
    160.0F,
    160.0F});

table.add_header({
    "Name",
    "Status"});

table.add_row({
    "Ada",
    "Ready"});

page.table(
    page.x_left(),
    y,
    table);
```

Use drawing helpers to make tables and reports easier to read.

## Save the document

Use:

```cpp id="z4v8qa"
auto saved = rix.pdf.save(doc, "drawing.pdf");
```

Check errors:

```cpp id="q8k5mv"
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

```cpp id="s6n4vm"
auto bytes = rix.pdf.write(doc);
```

Example:

```cpp id="v8q3md"
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

```bash id="f7q3ma"
vix new rix-pdf-drawing --app
cd rix-pdf-drawing
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
name = "rix-pdf-drawing"
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
vix run drawing.cpp
```

If needed:

```bash id="h5n7vc"
vix install -g rix/rix
vix run drawing.cpp
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

  auto &page = doc.add_page();

  page.line(
      page.x_left(),
      page.y_top(),
      page.x_right(),
      page.y_top(),
      1.0F,
      rixlib::pdf::Color::blue_color());

  auto saved = rix.pdf.save(doc, "drawing.pdf");

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

  auto &page = doc.add_page();

  page.line(
      page.x_left(),
      page.y_top(),
      page.x_right(),
      page.y_top(),
      1.0F,
      rixlib::pdf::Color::blue_color());

  auto saved = pdf.save(doc, "drawing.pdf");

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

### Forgetting that Y moves downward by subtraction

To draw lower on the page, subtract from Y:

```cpp id="h6q9vx"
y -= 70.0F;
```

Then draw:

```cpp id="v8n3qb"
page.rect(
    page.x_left(),
    y,
    140.0F,
    50.0F);
```

### Drawing outside the page margins

Prefer:

```cpp id="k4m9xd"
page.x_left()
page.x_right()
page.y_top()
page.y_bottom()
```

over hardcoded positions.

### Forgetting to save the document

Drawing commands only update the document model.

To create a file, call:

```cpp id="x3m7qa"
rix.pdf.save(doc, "drawing.pdf");
```

### Not checking save errors

Wrong:

```cpp id="n9q5vx"
rix.pdf.save(doc, "drawing.pdf");
```

Correct:

```cpp id="d2v8rc"
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

## What you should remember

Create a document:

```cpp id="b5x9ma"
auto doc = rix.pdf.document();
```

Add a page:

```cpp id="r4q8md"
auto &page = doc.add_page();
```

Draw a line:

```cpp id="y7m2ka"
page.line(
    page.x_left(),
    page.y_top(),
    page.x_right(),
    page.y_top(),
    1.0F,
    rixlib::pdf::Color::blue_color());
```

Draw a rectangle:

```cpp id="f7q3ma"
page.rect(
    page.x_left(),
    page.y_top() - 80.0F,
    140.0F,
    50.0F);
```

Draw a circle:

```cpp id="n9x2qc"
page.circle(
    page.x_left() + 70.0F,
    page.y_top() - 160.0F,
    35.0F,
    1.0F,
    rixlib::pdf::Color::red_color());
```

Save:

```cpp id="c5v8na"
auto saved = rix.pdf.save(doc, "drawing.pdf");
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

Continue with PDF metadata.

Next: [Metadata](./metadata)
