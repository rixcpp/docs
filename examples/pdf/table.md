# Table

This example shows how to create a PDF table with `rix/pdf`.

The example uses the public Rix facade:

```cpp id="q8m4xa"
#include <rix.hpp>
```

and accesses PDF through:

```cpp id="n5v9qc"
rix.pdf
```

Use this example when you want to create a PDF report with rows, columns, and a header.

## Create the file

```bash id="k7x2ma"
mkdir -p ~/rix-pdf-table-example
cd ~/rix-pdf-table-example
touch table.cpp
```

Add:

```cpp id="p9c5xr"
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

  auto saved = rix.pdf.save(doc, "rix_pdf_table.pdf");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 1;
  }

  rix.debug.print("created:", "rix_pdf_table.pdf");
  return 0;
}
```

Run it:

```bash id="q4m8vb"
vix run table.cpp
```

If Rix is not available yet for single-file usage:

```bash id="x2n7pd"
vix install -g rix/rix
vix run table.cpp
```

This creates:

```txt id="t8q5hm"
rix_pdf_table.pdf
```

## What this example does

The example creates a document:

```cpp id="b6x3rd"
auto doc = rix.pdf.document();
```

It adds a page:

```cpp id="z5v8ka"
auto &page = doc.add_page();
```

It creates a table:

```cpp id="c9q2mx"
rixlib::pdf::Table table;
```

It sets column widths:

```cpp id="h7n4qc"
table.set_column_widths({
    160.0F,
    160.0F,
    160.0F});
```

It adds a header row:

```cpp id="d3x8vp"
table.add_header({
    "Name",
    "Language",
    "Project"});
```

It adds data rows:

```cpp id="j2m9wa"
table.add_row({
    "Ada",
    "C++",
    "Rix"});
```

Then it draws the table on the page:

```cpp id="w8c5nr"
page.table(
    page.x_left(),
    y,
    table);
```

## Create a table

Use:

```cpp id="k5v7ma"
rixlib::pdf::Table table;
```

The table model stores:

```txt id="r6q9xd"
column widths
rows
cells
style
```

A table is drawn when you pass it to:

```cpp id="p2n8fc"
page.table(...)
```

## Set column widths

Use:

```cpp id="y4m6qv"
table.set_column_widths({
    160.0F,
    160.0F,
    160.0F});
```

Column widths are expressed in PDF points.

One inch is 72 points.

The total table width should fit inside the page content width.

You can check the available width with:

```cpp id="f9x3ka"
page.content_width()
```

## Add a header

Use:

```cpp id="m7c5vx"
table.add_header({
    "Name",
    "Language",
    "Project"});
```

A header is a table row marked as a header row.

It is rendered with the table header style.

## Add rows

Use:

```cpp id="q3p8za"
table.add_row({
    "Ada",
    "C++",
    "Rix"});
```

Each value becomes a cell.

Rows should normally have the same number of values as the number of columns.

## Draw the table

Use:

```cpp id="v8n2hr"
auto y_after_table = page.table(
    page.x_left(),
    y,
    table);
```

The arguments are:

```txt id="a6q9mx"
x position
starting y position
table
```

`page.table` returns the Y position below the table.

This lets you continue drawing after the table.

## Continue after a table

```cpp id="r4v8kb"
auto y_after_table = page.table(
    page.x_left(),
    y,
    table);

y_after_table -= 20.0F;

page.text(
    page.x_left(),
    y_after_table,
    "End of report");
```

Use this pattern when a report has text before and after a table.

## Complete table report

```cpp id="x9m2pd"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("Table Report")
      .set_author("Rix");

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

  table.add_row({
      "Grace",
      "Systems",
      "PDF"});

  auto y_after_table = page.table(
      page.x_left(),
      y,
      table);

  y_after_table -= 20.0F;

  page.text(
      page.x_left(),
      y_after_table,
      "Generated through the public Rix facade.");

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

Run:

```bash id="c5w9qa"
vix run table.cpp
```

## Table rows

You can create a row manually:

```cpp id="z8q2vm"
rixlib::pdf::TableRow row;

row.add_cell("Ada");
row.add_cell("C++");
row.add_cell("Rix");

table.add_row(std::move(row));
```

Use manual rows when you need more control over row-level settings.

## Header rows

A row can be marked as a header:

```cpp id="n7x4hd"
rixlib::pdf::TableRow row;

row.set_header(true);
row.add_cell("Name");
row.add_cell("Language");
row.add_cell("Project");

table.add_row(std::move(row));
```

The helper:

```cpp id="d6k8rc"
table.add_header(...)
```

is shorter for normal header rows.

## Table cells

You can create cells manually:

```cpp id="g5m9xq"
rixlib::pdf::TableCell cell{"Ready"};

cell.set_align(rixlib::pdf::Align::Center);
cell.set_text_color(rixlib::pdf::Color::green_color());
```

Then add it to a row:

```cpp id="y3v8mb"
rixlib::pdf::TableRow row;

row.add_cell(std::move(cell));
```

Use manual cells when you need alignment, color, background, or colspan control.

## Align a cell

```cpp id="f4q7vd"
rixlib::pdf::TableCell cell{"C++"};

cell.set_align(rixlib::pdf::Align::Center);
```

Available alignments are:

```txt id="w2x6qp"
Left
Center
Right
Justify
```

In code:

```cpp id="n6c9hd"
rixlib::pdf::Align::Left
rixlib::pdf::Align::Center
rixlib::pdf::Align::Right
rixlib::pdf::Align::Justify
```

## Set cell text color

```cpp id="j8q5kc"
rixlib::pdf::TableCell cell{"Ready"};

cell.set_text_color(
    rixlib::pdf::Color::green_color());
```

Use this when some values need a visual status.

## Set cell background

```cpp id="r7x3vm"
rixlib::pdf::TableCell cell{"Header"};

cell.set_background_color(
    rixlib::pdf::Color::light_gray());
```

Clear it with:

```cpp id="p6m8xb"
cell.clear_background_color();
```

## Use colspan

```cpp id="t9q2za"
rixlib::pdf::TableCell cell{"Full row"};

cell.set_colspan(3);
```

Use colspan when one cell should span several columns.

## Style the table

Access the table style with:

```cpp id="x4v7nd"
table.style()
```

Example:

```cpp id="p4q8zb"
table.style()
    .set_font(rixlib::pdf::Font::Helvetica)
    .set_font_size(10.0F)
    .set_header_font(rixlib::pdf::Font::HelveticaBold)
    .set_header_size(10.0F)
    .set_row_height(24.0F)
    .set_cell_padding(6.0F)
    .set_stripe_rows(true);
```

Use table styles when building reports with a repeated look.

## Border style

Use `BorderStyle` to control table borders:

```cpp id="v2k9qc"
rixlib::pdf::BorderStyle border{
    0.75F,
    rixlib::pdf::Color::gray(),
    rixlib::pdf::LineStyle::Solid};

table.style().set_border(border);
```

Disable borders:

```cpp id="c8w5rp"
table.style().set_border(
    rixlib::pdf::BorderStyle::none());
```

Use a thin default border:

```cpp id="z4v8qa"
table.style().set_border(
    rixlib::pdf::BorderStyle::thin());
```

## Stripe rows

Enable alternating row backgrounds:

```cpp id="q8k5mv"
table.style().set_stripe_rows(true);
```

Set the stripe color:

```cpp id="s6n4vm"
table.style().set_stripe_color(
    rixlib::pdf::Color::light_gray());
```

## Styled table example

```cpp id="v8q3md"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  auto y = page.heading(
      page.x_left(),
      page.y_top(),
      "Styled table",
      1);

  y -= 20.0F;

  rixlib::pdf::Table table;

  table.set_column_widths({
      180.0F,
      160.0F,
      140.0F});

  table.style()
      .set_font(rixlib::pdf::Font::Helvetica)
      .set_font_size(10.0F)
      .set_header_font(rixlib::pdf::Font::HelveticaBold)
      .set_header_size(10.0F)
      .set_row_height(24.0F)
      .set_cell_padding(6.0F)
      .set_stripe_rows(true);

  table.add_header({
      "Name",
      "Language",
      "Status"});

  {
    rixlib::pdf::TableRow row;

    row.add_cell("Ada");
    row.add_cell("C++");

    rixlib::pdf::TableCell status{"Ready"};
    status.set_align(rixlib::pdf::Align::Center);
    status.set_text_color(rixlib::pdf::Color::green_color());

    row.add_cell(std::move(status));

    table.add_row(std::move(row));
  }

  table.add_row({
      "Gaspard",
      "C++",
      "Building"});

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

```bash id="h5v8qp"
vix run table.cpp
```

## Table from CSV data

You can parse CSV data and render it as a PDF table.

```cpp id="d9m5qx"
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

  if (!csv.empty())
  {
    table.add_header({
        csv[0][0],
        csv[0][1],
        csv[0][2]});
  }

  for (std::size_t i = 1; i < csv.size(); ++i)
  {
    const auto &row = csv[i];

    if (row.size() >= 3)
    {
      table.add_row({
          row[0],
          row[1],
          row[2]});
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

```bash id="m8x2vc"
vix run table.cpp
```

## Table size helpers

You can inspect a table:

```cpp id="a2r7kb"
rix.debug.print("rows:", table.row_count());
rix.debug.print("columns:", table.column_count());
```

Check whether the table is empty:

```cpp id="c8n3vy"
if (table.empty())
{
  rix.debug.print("table is empty");
}
```

## Save the document

Use:

```cpp id="n6x9qa"
auto saved = rix.pdf.save(doc, "table.pdf");
```

Check errors:

```cpp id="y5q2md"
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

```cpp id="b4v8qc"
auto bytes = rix.pdf.write(doc);
```

Example:

```cpp id="p3x7rn"
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
vix new rix-pdf-table --app
cd rix-pdf-table
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
name = "rix-pdf-table"
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
vix run table.cpp
```

If needed:

```bash id="h5n7vc"
vix install -g rix/rix
vix run table.cpp
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

  auto saved = rix.pdf.save(doc, "table.pdf");

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

  auto saved = pdf.save(doc, "table.pdf");

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

### Making columns wider than the page

The sum of column widths should fit inside:

```cpp id="h6q9vx"
page.content_width()
```

If the table is too wide, reduce column widths.

### Forgetting to draw the table

Creating the table is not enough:

```cpp id="v8n3qb"
rixlib::pdf::Table table;
```

You must draw it:

```cpp id="k4m9xd"
page.table(
    page.x_left(),
    y,
    table);
```

### Accessing CSV rows without checking size

Wrong:

```cpp id="x3m7qa"
table.add_row({
    row[0],
    row[1],
    row[2]});
```

Better:

```cpp id="n9q5vx"
if (row.size() >= 3)
{
  table.add_row({
      row[0],
      row[1],
      row[2]});
}
```

### Not checking save errors

Wrong:

```cpp id="d2v8rc"
rix.pdf.save(doc, "table.pdf");
```

Correct:

```cpp id="b5x9ma"
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

## What you should remember

Create a table:

```cpp id="r4q8md"
rixlib::pdf::Table table;
```

Set columns:

```cpp id="y7m2ka"
table.set_column_widths({
    160.0F,
    160.0F,
    160.0F});
```

Add a header:

```cpp id="f7q3ma"
table.add_header({
    "Name",
    "Language",
    "Project"});
```

Add rows:

```cpp id="n9x2qc"
table.add_row({
    "Ada",
    "C++",
    "Rix"});
```

Draw the table:

```cpp id="c5v8na"
page.table(
    page.x_left(),
    y,
    table);
```

Save:

```cpp id="m6q4rd"
auto saved = rix.pdf.save(doc, "table.pdf");
```

For project usage:

```bash id="q9c5rd"
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

Continue with PDF drawing.

Next: [Drawing](./drawing)
