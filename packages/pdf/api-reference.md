# API Reference

This page is a compact API reference for `rix/pdf`.

The examples use the public Rix facade:

```cpp id="r9q4vm"
#include <rix.hpp>
```

and access PDF through:

```cpp id="m7x2qa"
rix.pdf
```

For most application code, prefer the facade API:

```cpp id="k5n8bd"
rix.pdf.document()
rix.pdf.save(...)
rix.pdf.write(...)
rix.pdf.make_text(...)
rix.pdf.error.to_string(...)
```

Use `rixlib::pdf::*` types when you need page sizes, margins, colors, fonts, tables, styles, and error codes.

## Main facade

### `rix.pdf`

The PDF module is mounted on the global Rix facade:

```cpp id="n2v7qc"
rix.pdf
```

It provides document creation, saving, writing, image helpers, writer helpers, error helpers, and version helpers.

## Include

Use the unified facade:

```cpp id="y8m5kp"
#include <rix.hpp>
```

For independent package usage:

```cpp id="b4v9rx"
#include <rix/pdf.hpp>
```

For most documentation and application examples, prefer:

```cpp id="p6n2za"
#include <rix.hpp>
```

## Install in a Vix project

Use:

```bash id="x5h8qt"
vix add rix/rix
vix install
```

In `vix.app`:

```txt id="d3v7mc"
deps = [
  "rix/rix",
]
```

For independent PDF usage:

```bash id="s2q9hb"
vix add rix/pdf
vix install
```

and:

```txt id="a7p4nx"
deps = [
  "rix/pdf",
]
```

## Single-file usage

For experiments:

```bash id="c6t8kd"
vix run pdf.cpp
```

If Rix is installed globally:

```bash id="w9r5qm"
vix install -g rix/rix
vix run pdf.cpp
```

## `PdfModule`

Namespace:

```cpp id="t5q8va"
rixlib::pdf
```

Facade access:

```cpp id="z7m3kb"
rix.pdf
```

### `document`

Create an empty document:

```cpp id="p8x2hf"
auto doc = rix.pdf.document();
```

Create a document with default page settings:

```cpp id="f4n9qs"
auto doc = rix.pdf.document(
    rixlib::pdf::PageSize::A4(),
    rixlib::pdf::Margins::one_inch());
```

Signatures:

```cpp id="g6c2wp"
Document document() const;

Document document(
    PageSize page_size,
    Margins margins = Margins{}) const;
```

### `save`

Save a document to a PDF file:

```cpp id="k9v4xa"
auto saved = rix.pdf.save(doc, "output.pdf");
```

Signature:

```cpp id="m3q8dt"
PdfStatus save(
    const Document &document,
    std::string_view path) const;
```

Returns:

```cpp id="d5h7ny"
PdfStatus
```

Check errors:

```cpp id="v8c6rw"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());
}
```

### `write`

Write a document to PDF bytes in memory:

```cpp id="q2x9fc"
auto bytes = rix.pdf.write(doc);
```

Signature:

```cpp id="n8p5zm"
PdfResult<std::string> write(
    const Document &document) const;
```

Returns:

```cpp id="s4j7qa"
PdfResult<std::string>
```

Use `value()` only after checking success:

```cpp id="w2c6tm"
auto bytes = rix.pdf.write(doc);

if (bytes.ok())
{
  rix.debug.print("bytes:", bytes.value().size());
}
```

### `make_text`

Generate and save a simple text PDF:

```cpp id="h5v9rc"
auto saved = rix.pdf.make_text(
    "hello.pdf",
    "Hello from rix.pdf",
    "Rix PDF");
```

Signature:

```cpp id="x9m2qp"
PdfStatus make_text(
    std::string_view path,
    std::string_view content,
    std::string_view title = "") const;
```

Use this for the fastest text-only PDF workflow.

### Version helpers

```cpp id="a4k8nd"
rix.pdf.version()
rix.pdf.version_major()
rix.pdf.version_minor()
rix.pdf.version_patch()
rix.pdf.version_number()
```

Signatures:

```cpp id="v7q2hb"
std::string version() const;

int version_major() const noexcept;
int version_minor() const noexcept;
int version_patch() const noexcept;
int version_number() const noexcept;
```

## Error module

Access:

```cpp id="r3d8vy"
rix.pdf.error
```

Type:

```cpp id="b8f4mq"
PdfErrorModule
```

### `none`

Create a success error value:

```cpp id="x5q7kp"
auto ok = rix.pdf.error.none();
```

Signature:

```cpp id="h9d2ca"
PdfError none() const;
```

### `make`

Create an error value:

```cpp id="m6v3rq"
auto error = rix.pdf.error.make(
    rixlib::pdf::PdfErrorCode::InvalidInput,
    "Invalid input.");
```

Signature:

```cpp id="q4c8xf"
PdfError make(
    PdfErrorCode code,
    std::string message) const;
```

### `to_string`

Convert an error code or error value to a stable string:

```cpp id="t5n7zd"
rix.pdf.error.to_string(error)
rix.pdf.error.to_string(rixlib::pdf::PdfErrorCode::InvalidInput)
```

Signatures:

```cpp id="y8f6wp"
std::string_view to_string(
    PdfErrorCode code) const noexcept;

std::string_view to_string(
    const PdfError &error) const noexcept;
```

### `ok`

Check whether an error value represents success:

```cpp id="k2g5xa"
rix.pdf.error.ok(error)
```

Signature:

```cpp id="w4h8nt"
bool ok(const PdfError &error) const noexcept;
```

### `failed`

Check whether an error value represents failure:

```cpp id="p9r3qd"
rix.pdf.error.failed(error)
```

Signature:

```cpp id="c7v5hm"
bool failed(const PdfError &error) const noexcept;
```

### `is`

Check a specific error code:

```cpp id="f8b2yn"
rix.pdf.error.is(
    error,
    rixlib::pdf::PdfErrorCode::InvalidInput)
```

Signature:

```cpp id="z4x7qr"
bool is(
    const PdfError &error,
    PdfErrorCode code) const noexcept;
```

## Image module

Access:

```cpp id="v2m8kc"
rix.pdf.image
```

Type:

```cpp id="b6n9xd"
PdfImageModule
```

### `load_jpeg`

Load a JPEG image from a file:

```cpp id="x7p5fa"
auto image = rix.pdf.image.load_jpeg("photo.jpg");
```

Signature:

```cpp id="j3q8mv"
PdfResult<Image> load_jpeg(
    std::string_view path) const;
```

Check errors:

```cpp id="w8h3yc"
if (image.failed())
{
  rix.debug.eprint(
      "image error:",
      rix.pdf.error.to_string(image.error()),
      image.error().message());
}
```

### `from_jpeg_bytes`

Create an image from encoded JPEG bytes:

```cpp id="m4a9qf"
auto image = rix.pdf.image.from_jpeg_bytes(bytes);
```

Signature:

```cpp id="k6v2rp"
PdfResult<Image> from_jpeg_bytes(
    std::vector<std::uint8_t> bytes) const;
```

## Writer module

Access:

```cpp id="q5t8md"
rix.pdf.writer
```

Type:

```cpp id="n7x4va"
PdfWriterModule
```

### `write`

Serialize a document to bytes:

```cpp id="g3m6xc"
auto bytes = rix.pdf.writer.write(doc);
```

Signature:

```cpp id="r9b5hz"
PdfResult<std::string> write(
    const Document &document) const;
```

### `save`

Save a document to a file:

```cpp id="p6q8rk"
auto saved = rix.pdf.writer.save(doc, "output.pdf");
```

Signature:

```cpp id="u2c9nw"
PdfStatus save(
    const Document &document,
    std::string_view path) const;
```

### `create`

Create a standalone writer:

```cpp id="f4m7dt"
auto writer = rix.pdf.writer.create();
```

Signature:

```cpp id="v5h3qa"
writer::PdfWriter create() const;
```

Example:

```cpp id="x8t2kd"
auto writer = rix.pdf.writer.create();

auto saved = writer.save(doc, "writer.pdf");
```

For most applications, prefer:

```cpp id="s9w4mx"
rix.pdf.save(doc, "output.pdf")
rix.pdf.write(doc)
```

## `Document`

Namespace:

```cpp id="q3c8np"
rixlib::pdf
```

Create through the facade:

```cpp id="z8x7va"
auto doc = rix.pdf.document();
```

### Constructors

```cpp id="m5d2qr"
Document();

Document(
    PageSize default_size,
    Margins default_margins = Margins{});
```

Prefer facade creation:

```cpp id="c9v6kt"
auto doc = rix.pdf.document();
```

### Default page settings

```cpp id="f7n5xb"
const PageSize &default_page_size() const noexcept;

Document &set_default_page_size(PageSize value) noexcept;

const Margins &default_margins() const noexcept;

Document &set_default_margins(Margins value) noexcept;
```

Example:

```cpp id="b6q2hm"
doc.set_default_page_size(
    rixlib::pdf::PageSize::Letter());

doc.set_default_margins(
    rixlib::pdf::Margins::one_inch());
```

### Pages

```cpp id="y9p8wd"
Page &add_page();

Page &add_page(PageSize size);

Page &add_page(PageSize size, Margins margins);

Page &page(std::size_t index);

const Page &page(std::size_t index) const;

const std::vector<Page> &pages() const noexcept;

std::vector<Page> &pages() noexcept;

std::size_t page_count() const noexcept;

bool empty() const noexcept;

void clear_pages();
```

Example:

```cpp id="g2k9ta"
auto &page = doc.add_page();

rix.debug.print("pages:", doc.page_count());
```

### Metadata

```cpp id="h8v4wc"
const Metadata &metadata() const noexcept;

Metadata &metadata() noexcept;

Document &set_metadata(Metadata value) noexcept;

Document &set_title(std::string value);

Document &set_author(std::string value);

Document &set_subject(std::string value);

Document &set_creator(std::string value);

Document &set_keywords(std::string value);
```

Example:

```cpp id="d7x5qk"
doc.set_title("Rix PDF")
    .set_author("Rix")
    .set_subject("PDF generation")
    .set_keywords("rix,pdf,vix,cpp");
```

## `Page`

Namespace:

```cpp id="w6n3qy"
rixlib::pdf
```

Create from a document:

```cpp id="t8x2ra"
auto &page = doc.add_page();
```

### Constructor

```cpp id="r4p9md"
explicit Page(
    PageSize size = PageSize::A4(),
    Margins margins = Margins{});
```

### Page geometry

```cpp id="b2m8hv"
const PageSize &size() const noexcept;

const Margins &margins() const noexcept;

Point width() const noexcept;

Point height() const noexcept;

Point content_width() const noexcept;

Point content_height() const noexcept;

Point x_left() const noexcept;

Point x_right() const noexcept;

Point y_top() const noexcept;

Point y_bottom() const noexcept;
```

Use helpers to stay inside page margins:

```cpp id="v9f5xc"
page.x_left()
page.y_top()
page.content_width()
```

### Text

```cpp id="s3p9kc"
Page &text(
    Point x,
    Point y,
    std::string_view value,
    TextStyle style = TextStyle{});

Page &text_aligned(
    Point x,
    Point y,
    Point width,
    std::string_view value,
    Align align = Align::Left,
    TextStyle style = TextStyle{});

Point paragraph(
    Point x,
    Point y,
    Point width,
    std::string_view value,
    Align align = Align::Left,
    TextStyle style = TextStyle{});

Point heading(
    Point x,
    Point y,
    std::string_view value,
    int level = 1,
    Color color = Color::black());

Page &page_number(
    int number,
    int total = -1,
    Point y = -1.0F,
    TextStyle style = TextStyle::small());
```

Example:

```cpp id="m8x4vd"
auto y = page.heading(
    page.x_left(),
    page.y_top(),
    "Report",
    1);

y -= 10.0F;

page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "Generated with rix.pdf.");
```

### Drawing

```cpp id="p4v8ha"
Page &line(
    Point x1,
    Point y1,
    Point x2,
    Point y2,
    Point width = 1.0F,
    Color color = Color::black(),
    LineStyle style = LineStyle::Solid);

Page &rect(
    Point x,
    Point y,
    Point width,
    Point height,
    Point line_width = 1.0F,
    Color color = Color::black());

Page &fill_rect(
    Point x,
    Point y,
    Point width,
    Point height,
    Color color);

Page &fill_stroke_rect(
    Point x,
    Point y,
    Point width,
    Point height,
    Color fill_color,
    Color stroke_color,
    Point line_width = 1.0F);

Page &circle(
    Point cx,
    Point cy,
    Point radius,
    Point line_width = 1.0F,
    Color color = Color::black(),
    bool filled = false);

Page &hrule(
    Point y,
    Point x_start = -1.0F,
    Point x_end = -1.0F,
    Point width = 0.5F,
    Color color = Color::gray());
```

Example:

```cpp id="f3q9zm"
page.line(
    page.x_left(),
    page.y_top(),
    page.x_right(),
    page.y_top(),
    1.0F,
    rixlib::pdf::Color::blue_color());
```

### Images

```cpp id="n5b7qa"
Page &image(
    const Image &image,
    Point x,
    Point y,
    Point width,
    Point height);

Page &image_fit(
    const Image &image,
    Point x,
    Point y,
    Point max_width,
    Point max_height);
```

Example:

```cpp id="g8v2kx"
auto image = rix.pdf.image.load_jpeg("photo.jpg");

if (image.ok())
{
  page.image_fit(
      image.value(),
      page.x_left(),
      page.y_top() - 200.0F,
      200.0F,
      160.0F);
}
```

### Tables

```cpp id="d2k6xm"
Point table(
    Point x,
    Point y,
    const Table &table);
```

Example:

```cpp id="c8p4vf"
rixlib::pdf::Table table;

table.set_column_widths({
    160.0F,
    160.0F});

table.add_header({
    "Name",
    "Project"});

table.add_row({
    "Ada",
    "Rix"});

auto y = page.table(
    page.x_left(),
    page.y_top(),
    table);
```

### Internal accessors

These are useful for writer internals and diagnostics:

```cpp id="j9m6rq"
const std::string &content_stream() const noexcept;

const std::vector<Font> &fonts() const noexcept;

const std::vector<const Image *> &images() const noexcept;

int font_index(Font font) const noexcept;
```

Most applications do not need them directly.

## `PageSize`

Namespace:

```cpp id="y5b3xv"
rixlib::pdf
```

### Constructors

```cpp id="r2h8mc"
PageSize();

PageSize(Point width, Point height);
```

Default is A4.

### Accessors

```cpp id="v4x7nd"
Point width() const noexcept;

Point height() const noexcept;

void set_width(Point value) noexcept;

void set_height(Point value) noexcept;

bool valid() const noexcept;

bool landscape() const noexcept;

bool portrait() const noexcept;

PageSize as_landscape() const noexcept;

PageSize as_portrait() const noexcept;

bool equals(const PageSize &other) const noexcept;
```

### Factories

```cpp id="w7q5fc"
static PageSize A4() noexcept;

static PageSize A3() noexcept;

static PageSize Letter() noexcept;

static PageSize Legal() noexcept;

static PageSize custom(
    Point width,
    Point height) noexcept;

static PageSize from_inches(
    float width,
    float height) noexcept;

static PageSize from_millimeters(
    float width,
    float height) noexcept;
```

Example:

```cpp id="e8n3kp"
auto size = rixlib::pdf::PageSize::A4().as_landscape();
```

### Operators

```cpp id="x4r9qa"
operator==
operator!=
```

## `Margins`

Namespace:

```cpp id="q6f8bn"
rixlib::pdf
```

### Constructors

```cpp id="b3x9hp"
Margins();

explicit Margins(Point value);

Margins(
    Point top,
    Point bottom,
    Point left,
    Point right);
```

Default margin is one inch on every side.

### Accessors

```cpp id="u7x2md"
Point top() const noexcept;

Point bottom() const noexcept;

Point left() const noexcept;

Point right() const noexcept;

void set_top(Point value) noexcept;

void set_bottom(Point value) noexcept;

void set_left(Point value) noexcept;

void set_right(Point value) noexcept;

bool empty() const noexcept;

Point horizontal() const noexcept;

Point vertical() const noexcept;

bool equals(const Margins &other) const noexcept;
```

### Factories

```cpp id="c5t7qa"
static Margins one_inch() noexcept;

static Margins none() noexcept;

static Margins from_inches(
    float top,
    float bottom,
    float left,
    float right) noexcept;

static Margins from_millimeters(
    float top,
    float bottom,
    float left,
    float right) noexcept;
```

Example:

```cpp id="d8q4vy"
auto margins = rixlib::pdf::Margins::from_millimeters(
    20.0F,
    20.0F,
    20.0F,
    20.0F);
```

### Operators

```cpp id="y2p5zc"
operator==
operator!=
```

## Units

Namespace:

```cpp id="n8v3rw"
rixlib::pdf
```

Type:

```cpp id="w9c4xs"
using Point = float;
```

Constants:

```cpp id="r6k2zd"
POINTS_PER_INCH
MILLIMETERS_PER_INCH
```

Functions:

```cpp id="m3f7qv"
Point inches(float value) noexcept;

Point millimeters(float value) noexcept;

Point centimeters(float value) noexcept;

float points_to_inches(Point value) noexcept;

float points_to_millimeters(Point value) noexcept;

float points_to_centimeters(Point value) noexcept;

bool is_positive(Point value) noexcept;

bool is_non_negative(Point value) noexcept;

Point clamp_non_negative(Point value) noexcept;
```

Example:

```cpp id="f8n4ma"
page.text(
    rixlib::pdf::inches(1.0F),
    rixlib::pdf::inches(10.0F),
    "Positioned with inches");
```

## `Color`

Namespace:

```cpp id="c2m6vx"
rixlib::pdf
```

### Constructors

```cpp id="z5w8ha"
Color();

Color(float red, float green, float blue);
```

RGB values are normalized between `0.0F` and `1.0F`.

### Accessors

```cpp id="g9r2vb"
float red() const noexcept;

float green() const noexcept;

float blue() const noexcept;

void set_red(float value) noexcept;

void set_green(float value) noexcept;

void set_blue(float value) noexcept;

bool equals(const Color &other) const noexcept;
```

### Factories

```cpp id="n4v9dx"
static Color black() noexcept;

static Color white() noexcept;

static Color red_color() noexcept;

static Color green_color() noexcept;

static Color blue_color() noexcept;

static Color gray() noexcept;

static Color light_gray() noexcept;

static Color from_hex(std::uint32_t value) noexcept;
```

Example:

```cpp id="q7x8mk"
auto color = rixlib::pdf::Color::from_hex(0x2C3E50);
```

### Operators

```cpp id="j5p2qc"
operator==
operator!=
```

## Alignment

Namespace:

```cpp id="p9m4zk"
rixlib::pdf
```

Enum:

```cpp id="r3v8hn"
enum class Align
{
  Left,
  Center,
  Right,
  Justify
};
```

Helpers:

```cpp id="y6x2rq"
to_string(Align align)

is_left(Align align)

is_center(Align align)

is_right(Align align)

is_justify(Align align)
```

Example:

```cpp id="h4q9dt"
page.text_aligned(
    page.x_left(),
    page.y_top(),
    page.content_width(),
    "Centered",
    rixlib::pdf::Align::Center);
```

## Line style

Namespace:

```cpp id="t2c7nd"
rixlib::pdf
```

Enum:

```cpp id="x9h5km"
enum class LineStyle
{
  Solid,
  Dashed,
  Dotted
};
```

Helpers:

```cpp id="v5n8xr"
to_string(LineStyle style)

is_solid(LineStyle style)

is_dashed(LineStyle style)

is_dotted(LineStyle style)
```

Example:

```cpp id="j8b4qs"
page.line(
    page.x_left(),
    page.y_top(),
    page.x_right(),
    page.y_top(),
    1.0F,
    rixlib::pdf::Color::gray(),
    rixlib::pdf::LineStyle::Dashed);
```

## Fonts

Namespace:

```cpp id="d7m5vc"
rixlib::pdf
```

### Font families

```cpp id="a8r3xp"
enum class FontFamily
{
  Helvetica,
  Times,
  Courier,
  Symbol,
  ZapfDingbats
};
```

### Font styles

```cpp id="w2f6nk"
enum class FontStyle
{
  Regular,
  Bold,
  Italic,
  BoldItalic
};
```

### Fonts

```cpp id="b9q4vc"
enum class Font
{
  Helvetica,
  HelveticaBold,
  HelveticaOblique,
  HelveticaBoldOblique,

  Times,
  TimesBold,
  TimesItalic,
  TimesBoldItalic,

  Courier,
  CourierBold,
  CourierOblique,
  CourierBoldOblique,

  Symbol,
  ZapfDingbats
};
```

### Font helpers

```cpp id="r6n2da"
Font make_font(
    FontFamily family,
    FontStyle style = FontStyle::Regular) noexcept;

std::string_view base_font_name(Font font) noexcept;

std::string_view family_name(Font font) noexcept;

FontFamily font_family(Font font) noexcept;

FontStyle font_style(Font font) noexcept;

bool is_bold(Font font) noexcept;

bool is_italic(Font font) noexcept;

bool is_monospaced(Font font) noexcept;

bool is_standard_font(Font font) noexcept;
```

Example:

```cpp id="m8f3xh"
auto font = rixlib::pdf::make_font(
    rixlib::pdf::FontFamily::Helvetica,
    rixlib::pdf::FontStyle::Bold);
```

## `TextStyle`

Namespace:

```cpp id="s2d6ry"
rixlib::pdf
```

### Constructors

```cpp id="q8x3vn"
TextStyle();

TextStyle(
    Font font,
    Point size,
    Color color = Color::black(),
    float line_height = 1.2F);
```

### Accessors

```cpp id="p6n7ma"
Font font() const noexcept;

void set_font(Font value) noexcept;

Point size() const noexcept;

void set_size(Point value) noexcept;

Color color() const noexcept;

void set_color(Color value) noexcept;

float line_height() const noexcept;

void set_line_height(float value) noexcept;

Point line_advance() const noexcept;

bool equals(const TextStyle &other) const noexcept;
```

### Copy helpers

```cpp id="m9t2qb"
TextStyle with_font(Font value) const noexcept;

TextStyle with_size(Point value) const noexcept;

TextStyle with_color(Color value) const noexcept;

TextStyle with_line_height(float value) const noexcept;
```

### Factories

```cpp id="g5r9kc"
static TextStyle normal() noexcept;

static TextStyle heading() noexcept;

static TextStyle small() noexcept;
```

Example:

```cpp id="x2q8vf"
auto style = rixlib::pdf::TextStyle{
    rixlib::pdf::Font::HelveticaBold,
    18.0F,
    rixlib::pdf::Color::blue_color()};
```

### Operators

```cpp id="z6v4pn"
operator==
operator!=
```

## `Metadata`

Namespace:

```cpp id="h7n5qx"
rixlib::pdf
```

### Constructor

```cpp id="c3w8yk"
Metadata();
```

Default creator:

```txt id="n9d2qc"
rix/pdf
```

### Accessors

```cpp id="a4f7nv"
const std::string &title() const noexcept;

void set_title(std::string value);

const std::string &author() const noexcept;

void set_author(std::string value);

const std::string &subject() const noexcept;

void set_subject(std::string value);

const std::string &creator() const noexcept;

void set_creator(std::string value);

const std::string &keywords() const noexcept;

void set_keywords(std::string value);

void clear();

bool empty() const noexcept;
```

Example:

```cpp id="v8n6qa"
doc.metadata().set_title("Report");
```

Prefer document helpers for common usage:

```cpp id="r3m5xd"
doc.set_title("Report")
    .set_author("Rix");
```

## `Table`

Namespace:

```cpp id="k6p9wm"
rixlib::pdf
```

### Accessors

```cpp id="f2x4qa"
const std::vector<Point> &column_widths() const noexcept;

Table &set_column_widths(std::vector<Point> values);

const std::vector<TableRow> &rows() const noexcept;

std::vector<TableRow> &rows() noexcept;

Table &add_row(TableRow row);

Table &add_row(std::vector<std::string> values);

Table &add_header(std::vector<std::string> values);

const TableStyle &style() const noexcept;

TableStyle &style() noexcept;

Table &set_style(TableStyle value) noexcept;

bool empty() const noexcept;

std::size_t row_count() const noexcept;

std::size_t column_count() const noexcept;
```

Example:

```cpp id="n5v8kt"
rixlib::pdf::Table table;

table.set_column_widths({
    160.0F,
    160.0F});

table.add_header({
    "Name",
    "Project"});

table.add_row({
    "Ada",
    "Rix"});
```

## `TableRow`

Namespace:

```cpp id="x7m3rp"
rixlib::pdf
```

### Constructor

```cpp id="q2v9hf"
TableRow();

TableRow(std::vector<TableCell> cells);
```

### Accessors

```cpp id="g8n4xc"
const std::vector<TableCell> &cells() const noexcept;

std::vector<TableCell> &cells() noexcept;

TableRow &add_cell(TableCell cell);

TableRow &add_cell(std::string text);

bool header() const noexcept;

TableRow &set_header(bool value) noexcept;

Point height() const noexcept;

TableRow &set_height(Point value) noexcept;

Color header_background() const noexcept;

TableRow &set_header_background(Color value) noexcept;

Color header_foreground() const noexcept;

TableRow &set_header_foreground(Color value) noexcept;
```

Example:

```cpp id="d6r8yb"
rixlib::pdf::TableRow row;

row.add_cell("Ada");
row.add_cell("Rix");

table.add_row(std::move(row));
```

## `TableCell`

Namespace:

```cpp id="a9c4mn"
rixlib::pdf
```

### Constructors

```cpp id="v4m2qf"
TableCell();

TableCell(std::string text);

TableCell(std::string text, Align align);
```

### Accessors

```cpp id="p5h7zc"
const std::string &text() const noexcept;

TableCell &set_text(std::string value);

Align align() const noexcept;

TableCell &set_align(Align value) noexcept;

Color text_color() const noexcept;

TableCell &set_text_color(Color value) noexcept;

bool has_background() const noexcept;

Color background_color() const noexcept;

TableCell &set_background_color(Color value) noexcept;

TableCell &clear_background_color() noexcept;

std::size_t colspan() const noexcept;

TableCell &set_colspan(std::size_t value) noexcept;
```

Example:

```cpp id="q8n6vk"
rixlib::pdf::TableCell cell{"Ready"};

cell.set_align(rixlib::pdf::Align::Center);
cell.set_text_color(rixlib::pdf::Color::green_color());
```

## `TableStyle`

Namespace:

```cpp id="m4t9xa"
rixlib::pdf
```

### Accessors

```cpp id="h3x8qc"
Font font() const noexcept;

TableStyle &set_font(Font value) noexcept;

Point font_size() const noexcept;

TableStyle &set_font_size(Point value) noexcept;

Font header_font() const noexcept;

TableStyle &set_header_font(Font value) noexcept;

Point header_size() const noexcept;

TableStyle &set_header_size(Point value) noexcept;

Point row_height() const noexcept;

TableStyle &set_row_height(Point value) noexcept;

Point cell_padding() const noexcept;

TableStyle &set_cell_padding(Point value) noexcept;

const BorderStyle &border() const noexcept;

TableStyle &set_border(BorderStyle value) noexcept;

Color stripe_color() const noexcept;

TableStyle &set_stripe_color(Color value) noexcept;

bool stripe_rows() const noexcept;

TableStyle &set_stripe_rows(bool value) noexcept;
```

Example:

```cpp id="y9p6rw"
table.style()
    .set_font(rixlib::pdf::Font::Helvetica)
    .set_font_size(10.0F)
    .set_row_height(24.0F)
    .set_cell_padding(6.0F)
    .set_stripe_rows(true);
```

## `BorderStyle`

Namespace:

```cpp id="v8q3ky"
rixlib::pdf
```

### Constructors

```cpp id="x3r7qd"
BorderStyle();

BorderStyle(
    Point width,
    Color color = Color::black(),
    LineStyle line_style = LineStyle::Solid);
```

### Accessors

```cpp id="f5b9xm"
bool top() const noexcept;
void set_top(bool value) noexcept;

bool bottom() const noexcept;
void set_bottom(bool value) noexcept;

bool left() const noexcept;
void set_left(bool value) noexcept;

bool right() const noexcept;
void set_right(bool value) noexcept;

Point width() const noexcept;
void set_width(Point value) noexcept;

Color color() const noexcept;
void set_color(Color value) noexcept;

LineStyle line_style() const noexcept;
void set_line_style(LineStyle value) noexcept;

bool visible() const noexcept;

bool all_sides() const noexcept;

BorderStyle &enable_all() noexcept;

BorderStyle &disable_all() noexcept;

BorderStyle with_all_sides() const noexcept;

BorderStyle with_no_sides() const noexcept;

BorderStyle with_width(Point value) const noexcept;

BorderStyle with_color(Color value) const noexcept;

BorderStyle with_line_style(LineStyle value) const noexcept;

bool equals(const BorderStyle &other) const noexcept;
```

### Factories

```cpp id="b2m6qc"
static BorderStyle thin() noexcept;

static BorderStyle none() noexcept;
```

Example:

```cpp id="r7n4vd"
table.style().set_border(
    rixlib::pdf::BorderStyle{
        0.75F,
        rixlib::pdf::Color::gray(),
        rixlib::pdf::LineStyle::Solid});
```

### Operators

```cpp id="t8x2wa"
operator==
operator!=
```

## `Image`

Namespace:

```cpp id="q9v5hr"
rixlib::pdf
```

### Image formats

```cpp id="d4x7qm"
enum class ImageFormat
{
  Jpeg
};
```

### Image color spaces

```cpp id="p6r9bc"
enum class ImageColorSpace
{
  DeviceGray,
  DeviceRGB,
  DeviceCMYK
};
```

### Constructors and factories

```cpp id="k3v8mx"
Image();

Image(
    ImageFormat format,
    std::vector<std::uint8_t> data,
    int width,
    int height,
    int components);

static PdfResult<Image> load_jpeg(
    std::string_view path);

static PdfResult<Image> from_jpeg_bytes(
    std::vector<std::uint8_t> bytes);
```

Prefer facade helpers:

```cpp id="m7h2qa"
auto image = rix.pdf.image.load_jpeg("photo.jpg");
```

### Accessors

```cpp id="f9q2vb"
bool valid() const noexcept;

ImageFormat format() const noexcept;

const std::vector<std::uint8_t> &data() const noexcept;

int width() const noexcept;

int height() const noexcept;

int components() const noexcept;

ImageColorSpace color_space() const noexcept;

float aspect_ratio() const noexcept;

bool grayscale() const noexcept;

bool rgb() const noexcept;

bool cmyk() const noexcept;
```

### Helpers

```cpp id="z3n6ma"
std::string_view to_string(ImageFormat format) noexcept;

std::string_view pdf_color_space_name(
    ImageColorSpace color_space) noexcept;
```

## `PdfResult<T>`

Namespace:

```cpp id="x6d9kv"
rixlib::pdf
```

Used when an operation returns a value or an error.

Examples:

```cpp id="b3m8qc"
PdfResult<std::string>
PdfResult<Image>
```

### Static constructors

```cpp id="v2c7rd"
static PdfResult success(T value);

static PdfResult failure(PdfError error);
```

### Accessors

```cpp id="m9q5xa"
bool ok() const noexcept;

bool failed() const noexcept;

explicit operator bool() const noexcept;

const T &value() const;

T &value();

T move_value();

const PdfError &error() const noexcept;
```

Always check success before calling `value()`:

```cpp id="d8n4hb"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  return 1;
}

const auto &data = bytes.value();
```

## `PdfStatus`

Namespace:

```cpp id="q5c9wd"
rixlib::pdf
```

Used when an operation only succeeds or fails.

Example:

```cpp id="f6r2mx"
PdfStatus saved = rix.pdf.save(doc, "output.pdf");
```

### Static constructors

```cpp id="z8k7ta"
static PdfStatus success();

static PdfStatus failure(PdfError error);
```

### Accessors

```cpp id="y3v9qc"
bool ok() const noexcept;

bool failed() const noexcept;

explicit operator bool() const noexcept;

const PdfError &error() const noexcept;
```

## `PdfError`

Namespace:

```cpp id="n4q8vf"
rixlib::pdf
```

### Error codes

```cpp id="c7b5tx"
enum class PdfErrorCode
{
  None,

  InvalidInput,
  InvalidState,
  InvalidPageSize,
  InvalidMargins,
  InvalidText,
  InvalidImage,
  InvalidTable,

  UnsupportedImageFormat,
  FileOpenFailed,
  FileReadFailed,
  FileWriteFailed,

  SerializationFailed,
  WriterError,

  Unknown
};
```

### Constructor

```cpp id="m6x2pw"
PdfError();

PdfError(
    PdfErrorCode code,
    std::string message);
```

### Accessors

```cpp id="p8h5zc"
bool ok() const noexcept;

bool has_error() const noexcept;

PdfErrorCode code() const noexcept;

const std::string &message() const noexcept;

bool is(PdfErrorCode code) const noexcept;
```

### Helpers

```cpp id="x4n9qb"
std::string_view to_string(PdfErrorCode code) noexcept;

PdfError make_pdf_ok();

PdfError make_pdf_error(
    PdfErrorCode code,
    std::string message);
```

Prefer facade helpers:

```cpp id="r2c6md"
rix.pdf.error.to_string(error)
rix.pdf.error.is(error, rixlib::pdf::PdfErrorCode::InvalidInput)
```

## `writer::PdfWriter`

Namespace:

```cpp id="w7v4xn"
rixlib::pdf::writer
```

Create through the facade:

```cpp id="s4m9qa"
auto writer = rix.pdf.writer.create();
```

### Constructor

```cpp id="h8q3dk"
PdfWriter();
```

### Methods

```cpp id="g5t7vb"
PdfResult<std::string> write(
    const Document &document) const;

PdfStatus save(
    const Document &document,
    std::string_view path) const;
```

For most applications, prefer the top-level facade:

```cpp id="j2x8kc"
rix.pdf.write(doc)
rix.pdf.save(doc, "output.pdf")
```

## Independent package helper

If using `rix/pdf` without the unified facade:

```cpp id="z5q7rc"
#include <rix/pdf.hpp>
```

You can create a PDF module with:

```cpp id="b9f3nm"
auto pdf = rixlib::pdf::module();
```

Then:

```cpp id="n8c4xq"
auto doc = pdf.document();

auto saved = pdf.save(doc, "output.pdf");
```

For most application documentation, use:

```cpp id="k4h7zp"
#include <rix.hpp>
```

and:

```cpp id="c2m9rd"
rix.pdf
```

## Complete minimal example

```cpp id="q9x4vh"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Rix PDF API Reference");

  auto &page = doc.add_page();

  page.heading(
      page.x_left(),
      page.y_top(),
      "Rix PDF",
      1);

  page.text(
      page.x_left(),
      page.y_top() - 50.0F,
      "Generated through the public Rix facade.");

  auto saved = rix.pdf.save(doc, "api-reference.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "api-reference.pdf");
  return 0;
}
```

Run:

```bash id="f8p2wd"
vix run api_reference.cpp
```

## Vix project example

Create a project:

```bash id="t4d8mq"
vix new pdf-api-reference --app
cd pdf-api-reference
```

Add Rix:

```bash id="p9v5xb"
vix add rix/rix
vix install
```

Use `deps` in `vix.app`:

```txt id="d6m9rw"
deps = [
  "rix/rix",
]
```

Build and run:

```bash id="k8q7ch"
vix build
vix run
```

## Common patterns

### Create, draw, save

```cpp id="q7b8nf"
auto doc = rix.pdf.document();

auto &page = doc.add_page();

page.text(
    page.x_left(),
    page.y_top(),
    "Hello");

auto saved = rix.pdf.save(doc, "hello.pdf");
```

### Create, draw, write bytes

```cpp id="z2c9mx"
auto doc = rix.pdf.document();

auto &page = doc.add_page();

page.text(
    page.x_left(),
    page.y_top(),
    "Hello");

auto bytes = rix.pdf.write(doc);
```

### Check save errors

```cpp id="h4v7qa"
if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());
}
```

### Check result errors

```cpp id="m8x5dc"
if (bytes.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(bytes.error()),
      bytes.error().message());
}
```

### Load an image and place it

```cpp id="n3q6vf"
auto image = rix.pdf.image.load_jpeg("photo.jpg");

if (image.ok())
{
  page.image_fit(
      image.value(),
      page.x_left(),
      page.y_top() - 200.0F,
      200.0F,
      160.0F);
}
```

### Create a table

```cpp id="w6r4xm"
rixlib::pdf::Table table;

table.set_column_widths({
    160.0F,
    160.0F});

table.add_header({
    "Name",
    "Project"});

table.add_row({
    "Ada",
    "Rix"});

page.table(
    page.x_left(),
    page.y_top(),
    table);
```

## What you should remember

Use the public facade:

```cpp id="y5m3hb"
#include <rix.hpp>
```

Create a document:

```cpp id="u8d2rn"
auto doc = rix.pdf.document();
```

Add a page:

```cpp id="v3n9xc"
auto &page = doc.add_page();
```

Save to a file:

```cpp id="b5x7ma"
auto saved = rix.pdf.save(doc, "output.pdf");
```

Write bytes:

```cpp id="q2p8vk"
auto bytes = rix.pdf.write(doc);
```

Check errors before using results:

```cpp id="m6v4rc"
if (bytes.failed())
{
  return 1;
}
```

Use `deps` for Vix Registry packages:

```txt id="k7q9da"
deps = [
  "rix/rix",
]
```

## Next step

Continue with examples.

Next: [PDF examples](/examples/pdf/basic)
