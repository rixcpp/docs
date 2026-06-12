# Tables

This page explains how to create tables with `rix/pdf`.

The examples use the public Rix facade:

```cpp id="x7p4ra"
#include <rix.hpp>
```

and access PDF through:

```cpp id="v9k2md"
rix.pdf
```

Tables are useful for generated reports, summaries, invoices, exports, dashboards, and simple structured documents.

## Basic table example

Create a file:

```bash id="z4f8nq"
mkdir -p ~/rix-pdf-tables
cd ~/rix-pdf-tables
touch tables.cpp
```

Add:

```cpp id="s5m8yd"
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

  auto saved = rix.pdf.save(doc, "table.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "table.pdf");
  return 0;
}
```

Run it:

```bash id="u2b7ck"
vix run tables.cpp
```

If Rix is not available yet for single-file usage:

```bash id="d6v9wt"
vix install -g rix/rix
vix run tables.cpp
```

This creates:

```txt id="b9q5xs"
table.pdf
```

## Create a table

Use:

```cpp id="k8d4pm"
rixlib::pdf::Table table;
```

A table stores rows, cells, column widths, and styling.

A table is drawn on a page with:

```cpp id="m4x7ha"
page.table(x, y, table);
```

## Set column widths

Use:

```cpp id="g6q3rs"
table.set_column_widths({
    160.0F,
    160.0F,
    160.0F});
```

Column widths are expressed in PDF points.

One point is 1/72 inch.

You can also use unit helpers:

```cpp id="p7n5vd"
table.set_column_widths({
    rixlib::pdf::inches(2.0F),
    rixlib::pdf::inches(2.0F),
    rixlib::pdf::inches(2.0F)});
```

## Add a header row

Use:

```cpp id="m9a3xb"
table.add_header({
    "Name",
    "Language",
    "Project"});
```

A header row is marked as a header and uses header styling.

## Add normal rows

Use:

```cpp id="d3v6fy"
table.add_row({
    "Ada",
    "C++",
    "Rix"});
```

Example:

```cpp id="p4t7qz"
table.add_row({
    "Gaspard",
    "C++",
    "Vix.cpp"});

table.add_row({
    "Grace",
    "Systems",
    "PDF"});
```

## Draw the table

Use:

```cpp id="w8m2fc"
page.table(
    page.x_left(),
    y,
    table);
```

The first argument is the X position.

The second argument is the starting Y position.

The third argument is the table.

The function returns the Y position below the table:

```cpp id="q5h8zx"
y = page.table(
    page.x_left(),
    y,
    table);
```

Use the returned Y position when you want to continue writing below the table.

## Continue after a table

```cpp id="b2r9kn"
y = page.table(
    page.x_left(),
    y,
    table);

y -= 20.0F;

page.paragraph(
    page.x_left(),
    y,
    page.content_width(),
    "This text appears below the table.");
```

## Table rows

For simple rows, use:

```cpp id="c9f6mq"
table.add_row({
    "Ada",
    "C++",
    "Rix"});
```

For more control, create a row manually:

```cpp id="t2x8rd"
rixlib::pdf::TableRow row;

row.add_cell("Ada");
row.add_cell("C++");
row.add_cell("Rix");

table.add_row(std::move(row));
```

## Header rows manually

You can also mark a row as a header manually:

```cpp id="v4p7jy"
rixlib::pdf::TableRow header;

header.set_header(true);
header.add_cell("Name");
header.add_cell("Language");
header.add_cell("Project");

table.add_row(std::move(header));
```

For most cases, prefer:

```cpp id="w1m5sc"
table.add_header({
    "Name",
    "Language",
    "Project"});
```

## Row height

Set a row height:

```cpp id="h6t9vk"
rixlib::pdf::TableRow row;

row.set_height(28.0F);
row.add_cell("Ada");
row.add_cell("C++");
row.add_cell("Rix");

table.add_row(std::move(row));
```

If no row height is set, the table style row height is used.

## Table cells

For simple cells, use strings:

```cpp id="n8d5qa"
row.add_cell("Ada");
```

For more control, use `TableCell`:

```cpp id="x3k9pm"
rixlib::pdf::TableCell cell{"Ada"};

cell.set_align(rixlib::pdf::Align::Center);
cell.set_text_color(rixlib::pdf::Color::blue_color());

row.add_cell(std::move(cell));
```

## Cell alignment

A cell can be aligned:

```cpp id="c7s2wb"
rixlib::pdf::TableCell cell{"Ada"};

cell.set_align(rixlib::pdf::Align::Center);
```

Available values:

```cpp id="y5f8xd"
rixlib::pdf::Align::Left
rixlib::pdf::Align::Center
rixlib::pdf::Align::Right
rixlib::pdf::Align::Justify
```

For table cells, left, center, and right are the most common.

## Cell text color

```cpp id="a6q4hw"
rixlib::pdf::TableCell cell{"Ready"};

cell.set_text_color(
    rixlib::pdf::Color::green_color());
```

## Cell background color

```cpp id="m5c2kv"
rixlib::pdf::TableCell cell{"Header"};

cell.set_background_color(
    rixlib::pdf::Color::light_gray());
```

Remove the background:

```cpp id="b8s6xq"
cell.clear_background_color();
```

## Cell colspan

A cell can span multiple columns:

```cpp id="q7n4rd"
rixlib::pdf::TableCell cell{"Summary"};

cell.set_colspan(3);
```

Use colspan for summary rows or section labels.

## Complete custom cell example

```cpp id="k9v3md"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Custom cells",
      1);

  y -= 20.0F;

  rixlib::pdf::Table table;

  table.set_column_widths({
      160.0F,
      160.0F,
      160.0F});

  table.add_header({
      "Name",
      "Status",
      "Project"});

  rixlib::pdf::TableRow row;

  row.add_cell("Ada");

  rixlib::pdf::TableCell status{"Ready"};

  status.set_align(rixlib::pdf::Align::Center);
  status.set_text_color(rixlib::pdf::Color::green_color());
  status.set_background_color(rixlib::pdf::Color::light_gray());

  row.add_cell(std::move(status));
  row.add_cell("Rix");

  table.add_row(std::move(row));

  page.table(
      page.x_left(),
      y,
      table);

  auto saved = rix.pdf.save(doc, "custom-cells.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "custom-cells.pdf");
  return 0;
}
```

Run:

```bash id="r6m3pa"
vix run tables.cpp
```

## Table style

A table has a style object:

```cpp id="p3q7tn"
auto &style = table.style();
```

Use it to configure:

```txt id="c2k8xy"
font
font size
header font
header size
row height
cell padding
border
stripe rows
stripe color
```

## Set table font

```cpp id="w9x5qh"
table.style()
    .set_font(rixlib::pdf::Font::Helvetica)
    .set_font_size(10.0F);
```

## Set header font

```cpp id="f7q2vm"
table.style()
    .set_header_font(rixlib::pdf::Font::HelveticaBold)
    .set_header_size(10.0F);
```

## Set row height

```cpp id="b5p8xt"
table.style()
    .set_row_height(24.0F);
```

## Set cell padding

```cpp id="y8h4zc"
table.style()
    .set_cell_padding(6.0F);
```

## Stripe rows

Enable or disable row striping:

```cpp id="m2v9ds"
table.style()
    .set_stripe_rows(true)
    .set_stripe_color(rixlib::pdf::Color::light_gray());
```

Stripe rows make longer tables easier to read.

## Borders

Table borders use `rixlib::pdf::BorderStyle`.

Default borders are thin black lines.

Use no borders:

```cpp id="c6x5kr"
table.style()
    .set_border(rixlib::pdf::BorderStyle::none());
```

Use a custom border:

```cpp id="v8q4fy"
table.style()
    .set_border(
        rixlib::pdf::BorderStyle{
            0.75F,
            rixlib::pdf::Color::gray(),
            rixlib::pdf::LineStyle::Solid});
```

## Border style helpers

Use:

```cpp id="j4s8na"
rixlib::pdf::BorderStyle::thin()
rixlib::pdf::BorderStyle::none()
```

You can also create copies with changes:

```cpp id="z5f3mp"
auto border =
    rixlib::pdf::BorderStyle::thin()
        .with_width(0.75F)
        .with_color(rixlib::pdf::Color::gray());
```

## Disable border sides

```cpp id="m7d6tc"
auto border = rixlib::pdf::BorderStyle::thin();

border.set_left(false);
border.set_right(false);

table.style().set_border(border);
```

You can control:

```cpp id="p9h5vq"
top
bottom
left
right
```

## Complete styled table

```cpp id="v6x9qm"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Styled Table");

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Styled table",
      1);

  y -= 20.0F;

  rixlib::pdf::Table table;

  table.set_column_widths({
      160.0F,
      160.0F,
      160.0F});

  table.style()
      .set_font(rixlib::pdf::Font::Helvetica)
      .set_font_size(10.0F)
      .set_header_font(rixlib::pdf::Font::HelveticaBold)
      .set_header_size(10.0F)
      .set_row_height(24.0F)
      .set_cell_padding(6.0F)
      .set_stripe_rows(true)
      .set_stripe_color(rixlib::pdf::Color::light_gray())
      .set_border(
          rixlib::pdf::BorderStyle{
              0.75F,
              rixlib::pdf::Color::gray(),
              rixlib::pdf::LineStyle::Solid});

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

  auto saved = rix.pdf.save(doc, "styled-table.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "styled-table.pdf");
  return 0;
}
```

Run:

```bash id="f4k9hz"
vix run tables.cpp
```

## Read table information

Get row count:

```cpp id="c8n3wp"
rix.debug.print("rows:", table.row_count());
```

Get column count:

```cpp id="q3y5rk"
rix.debug.print("columns:", table.column_count());
```

Check if a table is empty:

```cpp id="g6t7mn"
if (table.empty())
{
  rix.debug.print("table is empty");
}
```

Access rows:

```cpp id="p8r5cs"
for (const auto &row : table.rows())
{
  rix.debug.print("cells:", row.cells().size());
}
```

## Generate table from CSV

You can use `rix/csv` and `rix/pdf` together.

```cpp id="a7m9xb"
#include <rix.hpp>

int main()
{
  const auto csv = rix.csv.parse(
      "Name,Language,Project\n"
      "Ada,C++,Rix\n"
      "Gaspard,C++,Vix.cpp\n"
      "Grace,Systems,PDF\n");

  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "CSV table",
      1);

  y -= 20.0F;

  rixlib::pdf::Table table;

  table.set_column_widths({
      160.0F,
      160.0F,
      160.0F});

  for (std::size_t i = 0; i < csv.size(); ++i)
  {
    if (i == 0)
    {
      table.add_header(csv[i]);
    }
    else
    {
      table.add_row(csv[i]);
    }
  }

  page.table(
      page.x_left(),
      y,
      table);

  auto saved = rix.pdf.save(doc, "csv-table.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "csv-table.pdf");
  return 0;
}
```

Run:

```bash id="d2h6qa"
vix run tables.cpp
```

## Multiple tables

You can draw several tables on the same page by using the returned Y position.

```cpp id="x7q9rd"
y = page.table(
    page.x_left(),
    y,
    first_table);

y -= 30.0F;

y = page.table(
    page.x_left(),
    y,
    second_table);
```

Make sure there is enough vertical space between tables.

## Tables and page layout

`page.table(...)` draws the table at the given position.

For long tables, keep the layout simple.

Use:

```cpp id="z8n5mc"
page.x_left()
page.y_top()
page.content_width()
page.y_bottom()
```

to stay inside the visible content area.

For larger reports, split content across multiple pages manually when needed.

## Use in a Vix project

Create a Vix application:

```bash id="h2m8qv"
vix new pdf-tables --app
cd pdf-tables
```

Add Rix:

```bash id="q4w7xp"
vix add rix/rix
vix install
```

In `vix.app`, make sure Rix is listed under `deps`:

```txt id="k6y9bn"
deps = [
  "rix/rix",
]
```

A small `vix.app` can look like this:

```txt id="n8c5dw"
name = "pdf-tables"
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

Then use tables in `src/main.cpp`:

```cpp id="r5s9ma"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

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

  page.table(
      page.x_left(),
      page.y_top(),
      table);

  auto saved = rix.pdf.save(doc, "table.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "table.pdf");
  return 0;
}
```

Build and run:

```bash id="f3b7xs"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments:

```bash id="y2q8rn"
vix run tables.cpp
```

If Rix is installed globally for single-file usage:

```bash id="u6c4dh"
vix install -g rix/rix
vix run tables.cpp
```

For project usage, prefer:

```bash id="p9w2kv"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="c4m8ry"
deps = [
  "rix/rix",
]
```

## Use only PDF with the facade

If you want the `rix.*` facade style but only want PDF mounted, define the feature macro before including `rix.hpp`:

```cpp id="m3q7nx"
#define RIX_ENABLE_PDF
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

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

  return rix.pdf.save(doc, "table.pdf").ok() ? 0 : 1;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Use the independent package

For independent usage, install:

```bash id="t8k4ns"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="v2w6qc"
deps = [
  "rix/pdf",
]
```

Then include:

```cpp id="d9r5ha"
#include <rix/pdf.hpp>
```

Use this style when a project only needs PDF and does not need the full unified Rix facade.

For most application documentation, prefer:

```cpp id="h4x7vt"
#include <rix.hpp>
```

## Common mistakes

### Forgetting column widths

Without useful column widths, a table may not layout the way you expect.

Prefer:

```cpp id="g8q5kc"
table.set_column_widths({
    160.0F,
    160.0F,
    160.0F});
```

### Drawing the table too low

This can make the table appear outside the page:

```cpp id="x5k2hm"
page.table(page.x_left(), -50.0F, table);
```

Start from:

```cpp id="y7w4fb"
page.y_top()
```

or a Y position returned by a heading or paragraph.

### Not using the returned Y position

If you draw text after a table, use the returned position:

```cpp id="e3m7sd"
y = page.table(page.x_left(), y, table);
y -= 20.0F;
```

### Using too many columns

If there are too many columns, they may not fit inside `page.content_width()`.

Reduce column count or use a landscape page:

```cpp id="s6q9np"
auto doc = rix.pdf.document(
    rixlib::pdf::PageSize::A4().as_landscape());
```

### Not checking save errors

Wrong:

```cpp id="j9n4tv"
rix.pdf.save(doc, "table.pdf");
```

Better:

```cpp id="w2p8xc"
auto saved = rix.pdf.save(doc, "table.pdf");

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

```txt id="a7v3mq"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="f8m2zc"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

## What you should remember

Create a table:

```cpp id="p5n8yb"
rixlib::pdf::Table table;
```

Set widths:

```cpp id="c2f9vk"
table.set_column_widths({
    160.0F,
    160.0F,
    160.0F});
```

Add a header:

```cpp id="k8q6rx"
table.add_header({
    "Name",
    "Language",
    "Project"});
```

Add rows:

```cpp id="h3n7md"
table.add_row({
    "Ada",
    "C++",
    "Rix"});
```

Draw the table:

```cpp id="m9w4sz"
auto y = page.table(
    page.x_left(),
    page.y_top(),
    table);
```

Style the table:

```cpp id="r7x6bt"
table.style()
    .set_font(rixlib::pdf::Font::Helvetica)
    .set_font_size(10.0F)
    .set_row_height(24.0F)
    .set_cell_padding(6.0F);
```

For a Vix project, install Rix:

```bash id="b5v8ny"
vix add rix/rix
vix install
```

and use:

```txt id="h6q2xp"
deps = [
  "rix/rix",
]
```

## Next step

Learn drawing primitives.

Next: [Drawing](./drawing)
