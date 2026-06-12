# CSV API

This page documents the public `rix/csv` API.

Use CSV through the unified Rix facade:

```cpp id="q8m4xa"
#include <rix.hpp>
```

Then access CSV with:

```cpp id="n5v9qc"
rix.csv
```

The CSV API provides helpers for:

```txt id="k7x2ma"
parsing CSV text
writing CSV text
working with rows and fields
using parse options
using write options
transforming fields
filtering rows
```

## Package

The CSV package is:

```txt id="p9c5xr"
rix/csv
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
vix add rix/csv
vix install
```

In `vix.app`:

```txt id="b6x3rd"
deps = [
  "rix/csv",
]
```

## Header

Facade usage:

```cpp id="z5v8ka"
#include <rix.hpp>
```

Independent usage:

```cpp id="c9q2mx"
#include <rix/csv.hpp>
```

Most application examples should use the facade.

## Facade member

The CSV facade member is:

```cpp id="h7n4qc"
rix.csv
```

Example:

```cpp id="d3x8vp"
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n");

  return table.empty() ? 1 : 0;
}
```

## Main operations

Common CSV operations are:

```cpp id="j2m9wa"
rix.csv.parse(...)
rix.csv.write(...)
```

Use `parse` to convert CSV text into a table.

Use `write` to convert a table back into CSV text.

## Table type

CSV data is represented as a table.

A table is a list of rows.

Each row is a list of fields.

Common shape:

```txt id="w8c5nr"
Table
  Row
    Field
    Field
  Row
    Field
    Field
```

Example:

```cpp id="k5v7ma"
const auto table = rix.csv.parse(
    "name,language\n"
    "Ada,C++\n");

rix.debug.print("rows:", table.size());
```

## Parse CSV text

Use:

```cpp id="r6q9xd"
const auto table = rix.csv.parse(input);
```

Example:

```cpp id="p2n8fc"
#include <rix.hpp>

int main()
{
  const auto input =
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix\n";

  const auto table = rix.csv.parse(input);

  rix.debug.print("rows:", table.size());

  return 0;
}
```

## Access rows

Iterate over the table:

```cpp id="y4m6qv"
for (const auto &row : table)
{
  rix.debug.inspect(row);
}
```

Access a row by index:

```cpp id="f9x3ka"
const auto &header = table[0];
```

Check that the table is not empty before indexing.

## Access fields

Fields are stored as strings.

Example:

```cpp id="m7c5vx"
for (const auto &row : table)
{
  for (const auto &field : row)
  {
    rix.debug.print(field);
  }
}
```

Access a field by index:

```cpp id="q3p8za"
const auto &name = table[1][0];
const auto &language = table[1][1];
```

Check row sizes before indexing.

## Safe indexing

Wrong:

```cpp id="v8n2hr"
rix.debug.print(table[1][0]);
```

Better:

```cpp id="a6q9mx"
if (table.size() > 1 && table[1].size() > 0)
{
  rix.debug.print(table[1][0]);
}
```

CSV input can be incomplete, so code should check sizes when reading by index.

## Print a table

```cpp id="r4v8kb"
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix\n");

  for (const auto &row : table)
  {
    for (const auto &field : row)
    {
      rix.debug.print(field);
    }
  }

  return 0;
}
```

For real Vix application logs, prefer the Vix logging system.

For examples and small tools, `rix.debug.print` is fine.

## Write CSV text

Use:

```cpp id="x9m2pd"
const auto output = rix.csv.write(table);
```

Example:

```cpp id="c5w9qa"
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n");

  const auto output = rix.csv.write(table);

  rix.debug.print(output);

  return 0;
}
```

Use `write` when you need to export table data as CSV text.

## Round trip example

```cpp id="z8q2vm"
#include <rix.hpp>

int main()
{
  const auto input =
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix\n";

  const auto table = rix.csv.parse(input);

  const auto output = rix.csv.write(table);

  rix.debug.print(output);

  return 0;
}
```

This parses CSV text and writes it back as CSV text.

## Parse with options

CSV parsing can use options when you need custom behavior.

Example shape:

```cpp id="n7x4hd"
rixlib::csv::ParseOptions options;

const auto table = rix.csv.parse(input, options);
```

Use options for custom parsing behavior such as trimming, delimiter changes, field transforms, or row filtering when supported by the package version.

## Field transformer

A field transformer can normalize fields while parsing.

Example:

```cpp id="d6k8rc"
rixlib::csv::ParseOptions options;

options.field_transformer = [](std::string value) {
  if (value == "Vix")
  {
    return std::string{"Vix.cpp"};
  }

  return value;
};

const auto table = rix.csv.parse(input, options);
```

Use a field transformer when parsed values need light normalization.

## Row filter

A row filter can skip rows while parsing.

Example:

```cpp id="g5m9xq"
rixlib::csv::ParseOptions options;

options.row_filter = [](const rixlib::csv::Row &row) {
  return !row.empty();
};

const auto table = rix.csv.parse(input, options);
```

Use a row filter when you want to remove empty rows or application-specific rows.

## Complete parse options example

```cpp id="y3v8mb"
#include <rix.hpp>

#include <string>

int main()
{
  const std::string input =
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix\n"
      "\n";

  rixlib::csv::ParseOptions options;

  options.field_transformer = [](std::string value) {
    if (value == "Vix")
    {
      return std::string{"Vix.cpp"};
    }

    return value;
  };

  options.row_filter = [](const rixlib::csv::Row &row) {
    return !row.empty();
  };

  const auto table = rix.csv.parse(input, options);

  rix.debug.print("rows:", table.size());

  for (const auto &row : table)
  {
    rix.debug.inspect(row);
  }

  return 0;
}
```

Run:

```bash id="f4q7vd"
vix run csv.cpp
```

## Write with options

CSV writing can use options when you need custom output behavior.

Example shape:

```cpp id="w2x6qp"
rixlib::csv::WriteOptions options;

const auto output = rix.csv.write(table, options);
```

Use write options when you need to control output format such as delimiter or newline behavior when supported by the package version.

## Table construction

You can build a table manually.

Example shape:

```cpp id="n6c9hd"
rixlib::csv::Table table;

table.push_back({"name", "language"});
table.push_back({"Ada", "C++"});
table.push_back({"Gaspard", "Vix"});
```

Then write it:

```cpp id="j8q5kc"
const auto output = rix.csv.write(table);
```

## Complete write example

```cpp id="r7x3vm"
#include <rix.hpp>

int main()
{
  rixlib::csv::Table table;

  table.push_back({"name", "language"});
  table.push_back({"Ada", "C++"});
  table.push_back({"Gaspard", "Vix.cpp"});

  const auto output = rix.csv.write(table);

  rix.debug.print(output);

  return 0;
}
```

Run:

```bash id="p6m8xb"
vix run csv.cpp
```

## CSV and PDF

CSV tables can be converted into PDF tables.

Example:

```cpp id="t9q2za"
#include <rix.hpp>

int main()
{
  const auto csv = rix.csv.parse(
      "Name,Language,Project\n"
      "Ada,C++,Rix\n"
      "Gaspard,C++,Vix.cpp\n");

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

  if (!csv.empty() && csv[0].size() >= 3)
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

  return saved.ok() ? 0 : 1;
}
```

This example uses:

```txt id="x4v7nd"
rix.csv
rix.pdf
```

so the unified facade is the right dependency.

## CSV and debug

CSV examples often use debug output:

```cpp id="p4q8zb"
const auto table = rix.csv.parse(input);

rix.debug.print("rows:", table.size());
rix.debug.inspect(table);
```

`rix.debug` is useful for examples, quick checks, and small tools.

For real Vix application logs, prefer the Vix logging system.

## Use in a Vix project

Create a Vix app:

```bash id="v2k9qc"
vix new rix-csv-api --app
cd rix-csv-api
```

Add Rix:

```bash id="c8w5rp"
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt id="z4v8qa"
deps = [
  "rix/rix",
]
```

Use in `src/main.cpp`:

```cpp id="q8k5mv"
#include <rix.hpp>
```

Build and run:

```bash id="s6n4vm"
vix build
vix run
```

## Single-file usage

Create a file:

```bash id="v8q3md"
mkdir -p ~/rix-csv-api
cd ~/rix-csv-api
touch csv.cpp
```

Add:

```cpp id="h5v8qp"
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n");

  rix.debug.print("rows:", table.size());
  return 0;
}
```

Run:

```bash id="d9m5qx"
vix run csv.cpp
```

If Rix is not available globally:

```bash id="m8x2vc"
vix install -g rix/rix
vix run csv.cpp
```

## Independent usage

Install only CSV:

```bash id="a2r7kb"
vix add rix/csv
vix install
```

In `vix.app`:

```txt id="c8n3vy"
deps = [
  "rix/csv",
]
```

Then include:

```cpp id="n6x9qa"
#include <rix/csv.hpp>
```

Example:

```cpp id="y5q2md"
#include <rix/csv.hpp>

int main()
{
  auto csv = rixlib::csv::module();

  const auto table = csv.parse(
      "name,language\n"
      "Ada,C++\n");

  return table.empty() ? 1 : 0;
}
```

Use independent package APIs when you intentionally do not want the unified facade.

For most documentation and application examples, prefer:

```cpp id="b4v8qc"
#include <rix.hpp>
```

and:

```cpp id="p3x7rn"
rix.csv
```

## Enable only CSV in the facade

Use feature macros when you want the facade style but only want CSV mounted:

```cpp id="h9n2ka"
#define RIX_ENABLE_CSV
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse(
      "name\n"
      "Ada\n");

  return table.empty() ? 1 : 0;
}
```

If you also want debug output:

```cpp id="q6v8mx"
#define RIX_ENABLE_CSV
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse(
      "name\n"
      "Ada\n");

  rix.debug.print("rows:", table.size());

  return 0;
}
```

## Complete CSV example

```cpp id="t5c8vp"
#include <rix.hpp>

#include <sstream>
#include <string>

namespace
{
  void print_table(const rixlib::csv::Table &table)
  {
    for (const auto &row : table)
    {
      std::ostringstream line;

      for (std::size_t i = 0; i < row.size(); ++i)
      {
        if (i > 0)
        {
          line << " ";
        }

        line << row[i];
      }

      rix.debug.print(line.str());
    }
  }
}

int main()
{
  const std::string input =
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix\n";

  const auto table = rix.csv.parse(input);

  rix.debug.print("loaded rows:", table.size());
  print_table(table);

  return 0;
}
```

Run:

```bash id="r8q5wc"
vix run csv.cpp
```

## Common mistakes

### Forgetting to install Rix

If your code uses:

```cpp id="x4m9vd"
#include <rix.hpp>
```

install:

```bash id="f7q3ma"
vix add rix/rix
vix install
```

If your code uses:

```cpp id="n9x2qc"
#include <rix/csv.hpp>
```

install:

```bash id="c5v8na"
vix add rix/csv
vix install
```

### Putting Rix in `packages`

Wrong:

```txt id="m6q4rd"
packages = [
  "rix/csv",
]
```

Correct:

```txt id="v2k8xm"
deps = [
  "rix/csv",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Installing `rix/csv` but including `<rix.hpp>`

If your code uses:

```cpp id="q9c5rd"
#include <rix.hpp>
```

then install:

```bash id="k8m4xa"
vix add rix/rix
vix install
```

If your code uses:

```cpp id="h5n7vc"
#include <rix/csv.hpp>
```

then install:

```bash id="x9q2va"
vix add rix/csv
vix install
```

### Accessing fields without checking row size

Wrong:

```cpp id="d6m8qc"
rix.debug.print(row[2]);
```

Better:

```cpp id="z4x7mq"
if (row.size() > 2)
{
  rix.debug.print(row[2]);
}
```

### Assuming all rows have the same number of fields

CSV files can have incomplete rows.

Check row sizes when reading fields by index.

### Using debug output as production logging

`rix.debug` is useful for examples and small tools.

For real Vix application logs, prefer the Vix logging system.

### Mixing facade and independent usage

Avoid this without a clear reason:

```cpp id="y8m3ka"
#include <rix.hpp>
#include <rix/csv.hpp>
```

Use one style per file.

Facade:

```cpp id="s5v9qa"
#include <rix.hpp>
```

Independent:

```cpp id="p7n4xm"
#include <rix/csv.hpp>
```

## What you should remember

Parse CSV:

```cpp id="w3q8kc"
const auto table = rix.csv.parse(input);
```

Write CSV:

```cpp id="r6x2vd"
const auto output = rix.csv.write(table);
```

Iterate rows:

```cpp id="a8k5qx"
for (const auto &row : table)
{
  rix.debug.inspect(row);
}
```

Use the facade for most examples:

```cpp id="f2v7mc"
#include <rix.hpp>
```

and:

```cpp id="c9m4vx"
rix.csv
```

For project usage:

```bash id="m8q2za"
vix add rix/rix
vix install
```

and keep:

```txt id="n5v8qc"
deps = [
  "rix/rix",
]
```

For independent CSV usage:

```bash id="q7x4ma"
vix add rix/csv
vix install
```

and:

```cpp id="h6q9vx"
#include <rix/csv.hpp>
```

Always check row sizes before indexed field access.

## Next step

Continue with the debug API.

Next: [Debug API](./debug)
