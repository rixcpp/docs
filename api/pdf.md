# PDF API

This page documents the public `rix/pdf` API.

Use PDF through the unified Rix facade:

```cpp id="q8m4xa"
#include <rix.hpp>
```

Then access PDF with:

```cpp id="n5v9qc"
rix.pdf
```

The PDF API provides helpers for:

```txt id="k7x2ma"
creating documents
adding pages
drawing text
drawing paragraphs
drawing tables
drawing lines and shapes
adding metadata
loading JPEG images
writing PDF bytes
saving PDF files
handling PDF errors
```

## Package

The PDF package is:

```txt id="p9c5xr"
rix/pdf
```

For facade usage, install:

```bash id="q4m8vb"
vix add rix/rix
vix install
```

In `vix.app`:

```txt id="x2n7pd"
deps = [
  "rix/rix",
]
```

For independent package usage, install:

```bash id="t8q5hm"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="b6x3rd"
deps = [
  "rix/pdf",
]
```

## Header

Facade usage:

```cpp id="z5v8ka"
#include <rix.hpp>
```

Independent usage:

```cpp id="c9q2mx"
#include <rix/pdf.hpp>
```

Most application examples should use the facade.

## Facade member

The PDF facade member is:

```cpp id="h7n4qc"
rix.pdf
```

Example:

```cpp id="d3x8vp"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix.pdf");

  auto saved = rix.pdf.save(doc, "hello.pdf");

  return saved.ok() ? 0 : 1;
}
```

## Main operations

Common PDF operations are:

```cpp id="j2m9wa"
rix.pdf.document()
rix.pdf.save(...)
rix.pdf.write(...)
rix.pdf.make_text(...)
rix.pdf.image.load_jpeg(...)
rix.pdf.error.to_string(...)
```

Use `document` when you need layout control.

Use `make_text` when you only need a simple text PDF.

Use `write` when you need PDF bytes in memory.

Use `save` when you want to write a file.

## Create a document

Use:

```cpp id="w8c5nr"
auto doc = rix.pdf.document();
```

A document owns pages and metadata.

It does not create a file until you call:

```cpp id="k5v7ma"
rix.pdf.save(doc, "output.pdf");
```

or:

```cpp id="r6q9xd"
rix.pdf.write(doc);
```

## Create a document with page settings

Use:

```cpp id="p2n8fc"
auto doc = rix.pdf.document(
    rixlib::pdf::PageSize::A4(),
    rixlib::pdf::Margins::one_inch());
```

You can also use:

```cpp id="y4m6qv"
rixlib::pdf::PageSize::A3()
rixlib::pdf::PageSize::A4()
rixlib::pdf::PageSize::Letter()
rixlib::pdf::PageSize::Legal()
rixlib::pdf::PageSize::custom(...)
```

Margins can be created with:

```cpp id="f9x3ka"
rixlib::pdf::Margins::one_inch()
rixlib::pdf::Margins::none()
rixlib::pdf::Margins::from_inches(...)
rixlib::pdf::Margins::from_millimeters(...)
```

## Add a page

Use:

```cpp id="m7c5vx"
auto &page = doc.add_page();
```

A page is the drawing surface.

You can draw text, paragraphs, headings, lines, rectangles, circles, images, and tables.

## Add a custom page

```cpp id="q3p8za"
auto &page = doc.add_page(
    rixlib::pdf::PageSize::Letter());
```

With custom margins:

```cpp id="v8n2hr"
auto &page = doc.add_page(
    rixlib::pdf::PageSize::A4(),
    rixlib::pdf::Margins::from_inches(
        1.0F,
        1.0F,
        1.0F,
        1.0F));
```

## Page helpers

Common page helpers are:

```cpp id="a6q9mx"
page.width()
page.height()
page.content_width()
page.content_height()
page.x_left()
page.x_right()
page.y_top()
page.y_bottom()
```

Use them to keep content inside page margins.

Example:

```cpp id="r4v8kb"
page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");
```

## Draw text

Use:

```cpp id="x9m2pd"
page.text(
    x,
    y,
    "Text");
```

Example:

```cpp id="c5w9qa"
page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");
```

With style:

```cpp id="z8q2vm"
page.text(
    page.x_left(),
    page.y_top(),
    "Styled text",
    rixlib::pdf::TextStyle{
        rixlib::pdf::Font::HelveticaBold,
        14.0F,
        rixlib::pdf::Color::blue_color()});
```

## Draw aligned text

Use:

```cpp id="n7x4hd"
page.text_aligned(
    page.x_left(),
    page.y_top(),
    page.content_width(),
    "Centered text",
    rixlib::pdf::Align::Center);
```

Available alignments:

```cpp id="d6k8rc"
rixlib::pdf::Align::Left
rixlib::pdf::Align::Center
rixlib::pdf::Align::Right
rixlib::pdf::Align::Justify
```

## Draw a heading

Use:

```cpp id="g5m9xq"
auto y = page.heading(
    page.x_left(),
    page.y_top(),
    "Report",
    1);
```

The last argument is the heading level.

Common levels are:

```txt id="y3v8mb"
1
2
3
4
5
6
```

`heading` returns the next Y position after the heading.

## Draw a paragraph

Use:

```cpp id="f4q7vd"
auto y = page.paragraph(
    page.x_left(),
    page.y_top(),
    page.content_width(),
    "This paragraph will wrap inside the available width.");
```

With alignment and style:

```cpp id="w2x6qp"
auto y = page.paragraph(
    page.x_left(),
    page.y_top(),
    page.content_width(),
    "Centered blue paragraph.",
    rixlib::pdf::Align::Center,
    rixlib::pdf::TextStyle{
        rixlib::pdf::Font::Helvetica,
        12.0F,
        rixlib::pdf::Color::blue_color()});
```

`paragraph` returns the Y position after the paragraph.

## Text styles

Use:

```cpp id="n6c9hd"
rixlib::pdf::TextStyle
```

Common helpers:

```cpp id="j8q5kc"
rixlib::pdf::TextStyle::normal()
rixlib::pdf::TextStyle::heading()
rixlib::pdf::TextStyle::small()
```

Example:

```cpp id="r7x3vm"
auto style = rixlib::pdf::TextStyle{
    rixlib::pdf::Font::HelveticaBold,
    16.0F,
    rixlib::pdf::Color::black()};
```

A text style controls:

```txt id="p6m8xb"
font
size
color
line height
```

## Fonts

Standard PDF fonts are available through:

```cpp id="t9q2za"
rixlib::pdf::Font
```

Examples:

```cpp id="x4v7nd"
rixlib::pdf::Font::Helvetica
rixlib::pdf::Font::HelveticaBold
rixlib::pdf::Font::HelveticaOblique
rixlib::pdf::Font::Times
rixlib::pdf::Font::Courier
rixlib::pdf::Font::Symbol
rixlib::pdf::Font::ZapfDingbats
```

You can also create a font from family and style:

```cpp id="p4q8zb"
auto font = rixlib::pdf::make_font(
    rixlib::pdf::FontFamily::Helvetica,
    rixlib::pdf::FontStyle::Bold);
```

## Colors

Use:

```cpp id="v2k9qc"
rixlib::pdf::Color
```

Common colors:

```cpp id="c8w5rp"
rixlib::pdf::Color::black()
rixlib::pdf::Color::white()
rixlib::pdf::Color::gray()
rixlib::pdf::Color::light_gray()
rixlib::pdf::Color::red_color()
rixlib::pdf::Color::green_color()
rixlib::pdf::Color::blue_color()
```

Create a color from hex:

```cpp id="z4v8qa"
auto color = rixlib::pdf::Color::from_hex(0x2C3E50);
```

## Units

PDF coordinates use points.

One inch is 72 points.

Helpers:

```cpp id="q8k5mv"
rixlib::pdf::inches(...)
rixlib::pdf::millimeters(...)
rixlib::pdf::centimeters(...)
rixlib::pdf::points_to_inches(...)
rixlib::pdf::points_to_millimeters(...)
rixlib::pdf::points_to_centimeters(...)
```

Example:

```cpp id="s6n4vm"
auto one_inch = rixlib::pdf::inches(1.0F);
```

## Draw lines

Use:

```cpp id="v8q3md"
page.line(
    x1,
    y1,
    x2,
    y2,
    width,
    color);
```

Example:

```cpp id="h5v8qp"
page.line(
    page.x_left(),
    page.y_top(),
    page.x_right(),
    page.y_top(),
    1.0F,
    rixlib::pdf::Color::blue_color());
```

With line style:

```cpp id="d9m5qx"
page.line(
    page.x_left(),
    page.y_top(),
    page.x_right(),
    page.y_top(),
    1.0F,
    rixlib::pdf::Color::gray(),
    rixlib::pdf::LineStyle::Dashed);
```

Line styles:

```cpp id="m8x2vc"
rixlib::pdf::LineStyle::Solid
rixlib::pdf::LineStyle::Dashed
rixlib::pdf::LineStyle::Dotted
```

## Draw rectangles

Stroked rectangle:

```cpp id="a2r7kb"
page.rect(
    page.x_left(),
    page.y_top() - 80.0F,
    140.0F,
    50.0F);
```

Filled rectangle:

```cpp id="c8n3vy"
page.fill_rect(
    page.x_left(),
    page.y_top() - 80.0F,
    140.0F,
    50.0F,
    rixlib::pdf::Color::light_gray());
```

Filled and stroked rectangle:

```cpp id="n6x9qa"
page.fill_stroke_rect(
    page.x_left(),
    page.y_top() - 80.0F,
    140.0F,
    50.0F,
    rixlib::pdf::Color::white(),
    rixlib::pdf::Color::black());
```

## Draw circles

Stroked circle:

```cpp id="y5q2md"
page.circle(
    page.x_left() + 70.0F,
    page.y_top() - 120.0F,
    35.0F,
    1.0F,
    rixlib::pdf::Color::red_color());
```

Filled circle:

```cpp id="b4v8qc"
page.circle(
    page.x_left() + 70.0F,
    page.y_top() - 120.0F,
    35.0F,
    1.0F,
    rixlib::pdf::Color::green_color(),
    true);
```

## Draw a horizontal rule

Use:

```cpp id="p3x7rn"
page.hrule(y);
```

Example:

```cpp id="h9n2ka"
page.hrule(
    page.y_top() - 50.0F,
    page.x_left(),
    page.x_right(),
    0.5F,
    rixlib::pdf::Color::gray());
```

## Tables

Create a table:

```cpp id="q6v8mx"
rixlib::pdf::Table table;
```

Set column widths:

```cpp id="t5c8vp"
table.set_column_widths({
    160.0F,
    160.0F,
    160.0F});
```

Add a header:

```cpp id="r8q5wc"
table.add_header({
    "Name",
    "Language",
    "Project"});
```

Add rows:

```cpp id="x4m9vd"
table.add_row({
    "Ada",
    "C++",
    "Rix"});
```

Draw the table:

```cpp id="f7q3ma"
auto y_after = page.table(
    page.x_left(),
    page.y_top() - 80.0F,
    table);
```

## Table cells

Use `TableCell` when you need cell-level control.

```cpp id="n9x2qc"
rixlib::pdf::TableCell cell{"Ready"};

cell.set_align(rixlib::pdf::Align::Center);
cell.set_text_color(rixlib::pdf::Color::green_color());
cell.set_background_color(rixlib::pdf::Color::light_gray());
cell.set_colspan(2);
```

Add it to a row:

```cpp id="c5v8na"
rixlib::pdf::TableRow row;

row.add_cell(std::move(cell));

table.add_row(std::move(row));
```

## Table style

Access style with:

```cpp id="m6q4rd"
table.style()
```

Example:

```cpp id="v2k8xm"
table.style()
    .set_font(rixlib::pdf::Font::Helvetica)
    .set_font_size(10.0F)
    .set_header_font(rixlib::pdf::Font::HelveticaBold)
    .set_header_size(10.0F)
    .set_row_height(24.0F)
    .set_cell_padding(6.0F)
    .set_stripe_rows(true);
```

## Border style

Use:

```cpp id="q9c5rd"
rixlib::pdf::BorderStyle
```

Thin border:

```cpp id="k8m4xa"
table.style().set_border(
    rixlib::pdf::BorderStyle::thin());
```

No border:

```cpp id="h5n7vc"
table.style().set_border(
    rixlib::pdf::BorderStyle::none());
```

Custom border:

```cpp id="x9q2va"
rixlib::pdf::BorderStyle border{
    0.75F,
    rixlib::pdf::Color::gray(),
    rixlib::pdf::LineStyle::Solid};

table.style().set_border(border);
```

## Images

JPEG images can be loaded with:

```cpp id="d6m8qc"
auto image = rix.pdf.image.load_jpeg("photo.jpg");
```

Check the result:

```cpp id="z4x7mq"
if (image.failed())
{
  rix.debug.eprint(
      "image error:",
      rix.pdf.error.to_string(image.error()),
      image.error().message());

  return 1;
}
```

Place the image:

```cpp id="y8m3ka"
page.image(
    image.value(),
    page.x_left(),
    page.y_top() - 200.0F,
    200.0F,
    120.0F);
```

Fit while preserving aspect ratio:

```cpp id="s5v9qa"
page.image_fit(
    image.value(),
    page.x_left(),
    page.y_top() - 200.0F,
    200.0F,
    120.0F);
```

The first image implementation supports JPEG images.

## Image bytes

Create a JPEG image from bytes:

```cpp id="p7n4xm"
auto image = rix.pdf.image.from_jpeg_bytes(bytes);
```

The bytes must contain JPEG data.

Check the result before using `value()`.

## Metadata

Set metadata through document helpers:

```cpp id="w3q8kc"
doc.set_title("Report")
    .set_author("Rix")
    .set_subject("Generated report")
    .set_creator("my-app")
    .set_keywords("report,rix,pdf");
```

Access metadata directly:

```cpp id="r6x2vd"
auto &metadata = doc.metadata();

metadata.set_title("Report");
metadata.set_author("Rix");
```

Read metadata:

```cpp id="a8k5qx"
doc.metadata().title()
doc.metadata().author()
doc.metadata().subject()
doc.metadata().creator()
doc.metadata().keywords()
```

Clear metadata:

```cpp id="f2v7mc"
doc.metadata().clear();
```

Check if user-provided metadata is empty:

```cpp id="c9m4vx"
if (doc.metadata().empty())
{
  rix.debug.print("metadata is empty");
}
```

The default creator is:

```txt id="m8q2za"
rix/pdf
```

## Save a PDF

Use:

```cpp id="n5v8qc"
auto saved = rix.pdf.save(doc, "output.pdf");
```

Check the status:

```cpp id="q7x4ma"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

Use `save` when writing directly to disk.

## Write PDF bytes

Use:

```cpp id="h6q9vx"
auto bytes = rix.pdf.write(doc);
```

Check the result:

```cpp id="v8n3qb"
if (bytes.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(bytes.error()),
      bytes.error().message());

  return 1;
}

const auto &pdf_data = bytes.value();
```

Use `write` for HTTP responses, storage adapters, or custom output.

## Make a simple text PDF

Use:

```cpp id="k4m9xd"
auto saved = rix.pdf.make_text(
    "hello.pdf",
    "Hello from rix.pdf",
    "Rix PDF");
```

The arguments are:

```txt id="x3m7qa"
output path
text content
optional title
```

`make_text` creates a document, adds a page, writes text, and saves the file.

Use `document()` when you need custom layout.

## Error API

Error helpers are available through:

```cpp id="n9q5vx"
rix.pdf.error
```

Common helpers:

```cpp id="d2v8rc"
rix.pdf.error.to_string(error)
rix.pdf.error.is(error, code)
rix.pdf.error.make(code, message)
rix.pdf.error.none()
```

Example:

```cpp id="b5x9ma"
if (saved.failed())
{
  const auto &error = saved.error();

  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(error),
      error.message());
}
```

## PDF error codes

PDF error codes include:

```cpp id="r4q8md"
rixlib::pdf::PdfErrorCode::InvalidInput
rixlib::pdf::PdfErrorCode::InvalidState
rixlib::pdf::PdfErrorCode::InvalidPageSize
rixlib::pdf::PdfErrorCode::InvalidMargins
rixlib::pdf::PdfErrorCode::InvalidText
rixlib::pdf::PdfErrorCode::InvalidImage
rixlib::pdf::PdfErrorCode::InvalidTable
rixlib::pdf::PdfErrorCode::UnsupportedImageFormat
rixlib::pdf::PdfErrorCode::FileOpenFailed
rixlib::pdf::PdfErrorCode::FileReadFailed
rixlib::pdf::PdfErrorCode::FileWriteFailed
rixlib::pdf::PdfErrorCode::SerializationFailed
rixlib::pdf::PdfErrorCode::WriterError
rixlib::pdf::PdfErrorCode::Unknown
```

Use codes for programmatic decisions.

Use messages for diagnostics.

## Check a specific error

```cpp id="y7m2ka"
if (rix.pdf.error.is(
        saved.error(),
        rixlib::pdf::PdfErrorCode::InvalidInput))
{
  rix.debug.eprint("hint:", "use a real output path");
}
```

## Result and status types

`save` returns a status:

```cpp id="f7q3ma"
auto saved = rix.pdf.save(doc, "output.pdf");
```

Use:

```cpp id="n9x2qc"
saved.ok()
saved.failed()
saved.error()
```

`write` and image loading return results:

```cpp id="c5v8na"
auto bytes = rix.pdf.write(doc);
auto image = rix.pdf.image.load_jpeg("photo.jpg");
```

Use:

```cpp id="m6q4rd"
result.ok()
result.failed()
result.value()
result.error()
```

Never call `value()` before checking success.

## Version API

The PDF module exposes version helpers:

```cpp id="v2k8xm"
rix.pdf.version()
rix.pdf.version_major()
rix.pdf.version_minor()
rix.pdf.version_patch()
rix.pdf.version_number()
```

Example:

```cpp id="q9c5rd"
rix.debug.print("rix/pdf:", rix.pdf.version());
```

Use these for diagnostics, examples, and compatibility checks.

## Complete basic example

```cpp id="k8m4xa"
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

Run:

```bash id="h5n7vc"
vix run pdf.cpp
```

## Complete table example

```cpp id="x9q2va"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

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

  auto saved = rix.pdf.save(doc, "table.pdf");

  return saved.ok() ? 0 : 1;
}
```

## Complete drawing example

```cpp id="d6m8qc"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Drawing",
      1);

  y -= 20.0F;

  page.line(
      page.x_left(),
      y,
      page.x_right(),
      y,
      1.0F,
      rixlib::pdf::Color::blue_color());

  y -= 70.0F;

  page.fill_stroke_rect(
      page.x_left(),
      y,
      180.0F,
      60.0F,
      rixlib::pdf::Color::light_gray(),
      rixlib::pdf::Color::black());

  page.circle(
      page.x_left() + 280.0F,
      y + 30.0F,
      30.0F,
      1.0F,
      rixlib::pdf::Color::green_color(),
      true);

  auto saved = rix.pdf.save(doc, "drawing.pdf");

  return saved.ok() ? 0 : 1;
}
```

## Complete error example

```cpp id="z4x7mq"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto saved = rix.pdf.save(doc, "");

  if (saved.failed())
  {
    rix.debug.eprint(
        "expected pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 0;
  }

  return 1;
}
```

## Use in a Vix route

Use `write` to return PDF bytes from an HTTP route.

```cpp id="y8m3ka"
#include <vix.hpp>
#include <rix.hpp>

int main()
{
  vix::App app;

  app.get("/report.pdf", [](vix::Request &, vix::Response &res) {
    auto doc = rix.pdf.document();

    auto &page = doc.add_page();

    page.text(
        page.x_left(),
        page.y_top(),
        "Hello from rix.pdf");

    auto bytes = rix.pdf.write(doc);

    if (bytes.failed())
    {
      res.status(500).json({
          "ok", false,
          "error", rix.pdf.error.to_string(bytes.error()),
          "message", bytes.error().message()});

      return;
    }

    res.header("Content-Type", "application/pdf");
    res.header("Content-Disposition", "inline; filename=\"report.pdf\"");
    res.send(bytes.value());
  });

  app.run();

  return 0;
}
```

## Use in a Vix project

Create a Vix app:

```bash id="s5v9qa"
vix new rix-pdf-api --app
cd rix-pdf-api
```

Add Rix:

```bash id="p7n4xm"
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt id="w3q8kc"
deps = [
  "rix/rix",
]
```

Use in `src/main.cpp`:

```cpp id="r6x2vd"
#include <rix.hpp>
```

Build and run:

```bash id="a8k5qx"
vix build
vix run
```

## Single-file usage

Create a file:

```bash id="f2v7mc"
mkdir -p ~/rix-pdf-api
cd ~/rix-pdf-api
touch pdf.cpp
```

Add:

```cpp id="c9m4vx"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix.pdf");

  return rix.pdf.save(doc, "hello.pdf").ok() ? 0 : 1;
}
```

Run:

```bash id="m8q2za"
vix run pdf.cpp
```

If Rix is not available globally:

```bash id="n5v8qc"
vix install -g rix/rix
vix run pdf.cpp
```

## Independent usage

Install only PDF:

```bash id="q7x4ma"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="h6q9vx"
deps = [
  "rix/pdf",
]
```

Then include:

```cpp id="v8n3qb"
#include <rix/pdf.hpp>
```

Example:

```cpp id="k4m9xd"
#include <rix/pdf.hpp>

int main()
{
  auto pdf = rixlib::pdf::module();

  auto doc = pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from independent rix/pdf");

  auto saved = pdf.save(doc, "independent.pdf");

  return saved.ok() ? 0 : 1;
}
```

Use independent package APIs when you intentionally do not want the unified facade.

For most documentation and application examples, prefer:

```cpp id="x3m7qa"
#include <rix.hpp>
```

and:

```cpp id="n9q5vx"
rix.pdf
```

## Enable only PDF in the facade

Use feature macros when you want the facade style but only want PDF mounted:

```cpp id="d2v8rc"
#define RIX_ENABLE_PDF
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  return rix.pdf.save(doc, "pdf-only.pdf").ok() ? 0 : 1;
}
```

If you also want debug output:

```cpp id="b5x9ma"
#define RIX_ENABLE_PDF
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto saved = rix.pdf.save(doc, "pdf-debug.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "pdf-debug.pdf");
  return 0;
}
```

## Common mistakes

### Forgetting to install Rix

If your code uses:

```cpp id="r4q8md"
#include <rix.hpp>
```

install:

```bash id="y7m2ka"
vix add rix/rix
vix install
```

If your code uses:

```cpp id="f7q3ma"
#include <rix/pdf.hpp>
```

install:

```bash id="n9x2qc"
vix add rix/pdf
vix install
```

### Putting Rix in `packages`

Wrong:

```txt id="c5v8na"
packages = [
  "rix/pdf",
]
```

Correct:

```txt id="m6q4rd"
deps = [
  "rix/pdf",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Installing `rix/pdf` but including `<rix.hpp>`

If your code uses:

```cpp id="v2k8xm"
#include <rix.hpp>
```

then install:

```bash id="q9c5rd"
vix add rix/rix
vix install
```

If your code uses:

```cpp id="k8m4xa"
#include <rix/pdf.hpp>
```

then install:

```bash id="h5n7vc"
vix add rix/pdf
vix install
```

### Calling `value()` before checking success

Wrong:

```cpp id="x9q2va"
auto bytes = rix.pdf.write(doc);

res.send(bytes.value());
```

Correct:

```cpp id="d6m8qc"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  return;
}

res.send(bytes.value());
```

### Not checking save errors

Wrong:

```cpp id="z4x7mq"
rix.pdf.save(doc, "output.pdf");
```

Correct:

```cpp id="y8m3ka"
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

### Expecting metadata to be visible

This sets metadata:

```cpp id="s5v9qa"
doc.set_title("Report");
```

This draws visible text:

```cpp id="p7n4xm"
page.heading(
    page.x_left(),
    page.y_top(),
    "Report",
    1);
```

Use both when you want a document title and a visible title.

### Saving to a missing folder

This can fail:

```cpp id="w3q8kc"
rix.pdf.save(doc, "output/report.pdf");
```

Create the folder first:

```bash id="r6x2vd"
mkdir -p output
```

### Using `make_text` for complex layout

`make_text` is for simple text PDFs.

Use `document()` for:

```txt id="a8k5qx"
tables
drawings
images
custom styles
multiple sections
manual positioning
```

### Using `load_jpeg` for PNG files

`load_jpeg` expects JPEG data.

This can fail:

```cpp id="f2v7mc"
rix.pdf.image.load_jpeg("logo.png");
```

Use JPEG input for this helper.

### Using debug output as production logging

`rix.debug` is useful for examples and small tools.

For real Vix application logs, prefer:

```cpp id="c9m4vx"
vix::log
```

## What you should remember

Create a document:

```cpp id="m8q2za"
auto doc = rix.pdf.document();
```

Add a page:

```cpp id="n5v8qc"
auto &page = doc.add_page();
```

Draw text:

```cpp id="q7x4ma"
page.text(
    page.x_left(),
    page.y_top(),
    "Hello from rix.pdf");
```

Save:

```cpp id="h6q9vx"
auto saved = rix.pdf.save(doc, "hello.pdf");
```

Write bytes:

```cpp id="v8n3qb"
auto bytes = rix.pdf.write(doc);
```

Make simple text PDF:

```cpp id="k4m9xd"
auto saved = rix.pdf.make_text(
    "hello.pdf",
    "Hello from rix.pdf",
    "Rix PDF");
```

Always check results before calling `value()`.

For project usage:

```bash id="x3m7qa"
vix add rix/rix
vix install
```

and keep:

```txt id="n9q5vx"
deps = [
  "rix/rix",
]
```

For independent PDF usage:

```bash id="d2v8rc"
vix add rix/pdf
vix install
```

and:

```cpp id="b5x9ma"
#include <rix/pdf.hpp>
```

## Next step

Continue with troubleshooting.

Next: [Troubleshooting](/packages/pdf/errors)
