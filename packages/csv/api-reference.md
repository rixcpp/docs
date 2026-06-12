# CSV API Reference

This page summarizes the public API exposed by `rix/csv`.

The documentation examples use the unified Rix facade:

```cpp id="la5o3f"
#include <rix.hpp>
```

and access CSV through:

```cpp id="xrfaj2"
rix.csv
```

The lower-level CSV types live under:

```cpp id="z9r6ps"
rixlib::csv
```

Use the facade for application code.

Use lower-level types when you need explicit table, row, or options types.

## Facade entry point

The CSV module is mounted at:

```cpp id="ifjl6y"
rix.csv
```

Common usage:

```cpp id="gmfb50"
const auto table = rix.csv.parse(
    "name,language\n"
    "Ada,C++\n");

const auto output = rix.csv.write(table);
```

## Headers

Recommended public header:

```cpp id="awh4mu"
#include <rix.hpp>
```

Independent package header:

```cpp id="qspu26"
#include <rix/csv.hpp>
```

Use `<rix.hpp>` when you want the unified facade:

```cpp id="f6ug4g"
rix.csv
rix.debug
rix.auth
rix.pdf
```

Use `<rix/csv.hpp>` when you want only the CSV package.

## Namespace

CSV types live in:

```cpp id="vi53wy"
rixlib::csv
```

Common types:

```cpp id="u48q0n"
rixlib::csv::Table
rixlib::csv::Row
rixlib::csv::Options
```

## `rix.csv`

`rix.csv` exposes the public CSV module.

It provides the main CSV operations:

```cpp id="hlkx8x"
parse(...)
write(...)
version()
version_major()
version_minor()
version_patch()
version_number()
```

## `parse`

```cpp id="bwj2f4"
Table parse(std::string_view input) const;
```

Parses CSV text into a table.

Example:

```cpp id="qj3069"
const auto table = rix.csv.parse(
    "name,language\n"
    "Ada,C++\n"
    "Gaspard,Vix\n");
```

Read values:

```cpp id="nq48ol"
rix.debug.print(table[0][0]);
rix.debug.print(table[1][0]);
```

For the example above:

```txt id="be8nhq"
table[0][0] -> name
table[0][1] -> language
table[1][0] -> Ada
table[1][1] -> C++
```

## `parse` with options

```cpp id="o3dx1u"
Table parse(
    std::string_view input,
    const Options &options) const;
```

Parses CSV text with custom options.

Example:

```cpp id="o5x9ep"
rixlib::csv::Options options;

options.field_transformer = [](std::string value) {
  if (value == "Vix")
  {
    return std::string{"Vix.cpp"};
  }

  return value;
};

const auto table = rix.csv.parse(input, options);
```

Use options when parsing should transform fields or filter rows.

## `write`

```cpp id="n31g4i"
std::string write(const Table &table) const;
```

Writes a table into CSV text.

Example:

```cpp id="gjni1f"
rixlib::csv::Table table;

table.push_back({"name", "language"});
table.push_back({"Ada", "C++"});
table.push_back({"Gaspard", "Vix"});

const auto output = rix.csv.write(table);

rix.debug.print(output);
```

Expected output:

```csv id="zkv36w"
name,language
Ada,C++
Gaspard,Vix
```

Use `write` instead of building CSV manually.

The writer handles CSV escaping for commas, quotes, and newlines.

## `Table`

A `Table` represents CSV rows.

Conceptually:

```txt id="f8qo25"
Table
  -> Row
     -> Field
```

Common usage:

```cpp id="e60fm2"
rixlib::csv::Table table;

table.push_back({"name", "language"});
table.push_back({"Ada", "C++"});
```

A table can be iterated:

```cpp id="i3isjb"
for (const auto &row : table)
{
  for (const auto &field : row)
  {
    rix.debug.print(field);
  }
}
```

A table can be indexed:

```cpp id="bak8kd"
rix.debug.print(table[0][0]);
```

Check that the table is not empty before indexing:

```cpp id="hvnpzl"
if (!table.empty())
{
  rix.debug.print(table[0][0]);
}
```

## `Row`

A `Row` represents one CSV row.

A row contains fields.

Common usage:

```cpp id="xm6tvq"
rixlib::csv::Row row;

row.push_back("Ada");
row.push_back("C++");
```

Rows are normally created directly inside a table:

```cpp id="sgksf7"
table.push_back({"Ada", "C++"});
```

A row can be iterated:

```cpp id="c1h5u2"
for (const auto &field : row)
{
  rix.debug.print(field);
}
```

A row can be indexed:

```cpp id="n91rzw"
rix.debug.print(row[0]);
```

Check row size before indexing external CSV data:

```cpp id="ws7xsc"
if (row.size() >= 2)
{
  rix.debug.print(row[0], row[1]);
}
```

## Field values

A field is represented as a string value.

Example:

```cpp id="uo8222"
const auto table = rix.csv.parse("name,language\nAda,C++\n");

const std::string name = table[1][0];
const std::string language = table[1][1];
```

CSV values are text.

If your application needs numbers, booleans, dates, or custom types, parse those values after reading the field.

## `Options`

`Options` customizes parsing behavior.

Create an options object:

```cpp id="ypz7ot"
rixlib::csv::Options options;
```

Pass it to parsing:

```cpp id="qjzipu"
const auto table = rix.csv.parse(input, options);
```

## `Options::field_transformer`

A field transformer receives one field value and returns the value that should be stored in the parsed table.

Example:

```cpp id="vu3z47"
options.field_transformer = [](std::string value) {
  if (value == "Vix")
  {
    return std::string{"Vix.cpp"};
  }

  return value;
};
```

Use it for:

```txt id="cc54um"
normalizing values
trimming spaces
renaming imported values
mapping old values to new values
small parse-time cleanup
```

Example trim-style transformer:

```cpp id="mu2bej"
options.field_transformer = [](std::string value) {
  while (!value.empty() && value.front() == ' ')
  {
    value.erase(value.begin());
  }

  while (!value.empty() && value.back() == ' ')
  {
    value.pop_back();
  }

  return value;
};
```

## `Options::row_filter`

A row filter receives a parsed row and decides whether it should be kept.

Example:

```cpp id="c26vy7"
options.row_filter = [](const rixlib::csv::Row &row) {
  if (!row.empty() && row[0] == "Skip")
  {
    return false;
  }

  return true;
};
```

Return:

```txt id="gdw1n7"
true  -> keep the row
false -> remove the row
```

Use it for:

```txt id="umf3d5"
skipping empty rows
skipping comment rows
removing invalid rows
filtering imported data
```

## Complete options example

```cpp id="rp8lcf"
#include <rix.hpp>

#include <string>

int main()
{
  const std::string input =
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix\n"
      "Skip,Ignored\n";

  rixlib::csv::Options options;

  options.field_transformer = [](std::string value) {
    if (value == "Vix")
    {
      return std::string{"Vix.cpp"};
    }

    return value;
  };

  options.row_filter = [](const rixlib::csv::Row &row) {
    if (!row.empty() && row[0] == "Skip")
    {
      return false;
    }

    return true;
  };

  const auto table = rix.csv.parse(input, options);

  rix.debug.print("rows:", table.size());

  return 0;
}
```

## Version helpers

The CSV module exposes package version helpers.

```cpp id="uuxdpl"
std::string version() const;

int version_major() const noexcept;
int version_minor() const noexcept;
int version_patch() const noexcept;
int version_number() const noexcept;
```

Example:

```cpp id="j9kki8"
auto version = rix.csv.version();

rix.debug.print("csv version:", version);
```

Use these helpers in diagnostics, examples, or compatibility checks.

## Parse pattern

Use this pattern when reading CSV from trusted small input:

```cpp id="irev0t"
const auto table = rix.csv.parse(input);

for (const auto &row : table)
{
  for (const auto &field : row)
  {
    rix.debug.print(field);
  }
}
```

Use this pattern when reading external input:

```cpp id="evsfwz"
const auto table = rix.csv.parse(input);

if (table.empty())
{
  rix.debug.eprint("CSV is empty");
  return 1;
}

for (std::size_t i = 1; i < table.size(); ++i)
{
  const auto &row = table[i];

  if (row.size() < 2)
  {
    rix.debug.eprint("invalid row:", i);
    continue;
  }

  rix.debug.print("name:", row[0]);
  rix.debug.print("language:", row[1]);
}
```

## Write pattern

Use this pattern when generating CSV:

```cpp id="niyx1o"
rixlib::csv::Table table;

table.push_back({"name", "project"});
table.push_back({"Ada", "Rix"});
table.push_back({"Gaspard", "Vix.cpp"});

const auto output = rix.csv.write(table);
```

Save it with normal C++ file output:

```cpp id="es6qnq"
#include <fstream>

std::ofstream file("report.csv");

if (!file)
{
  rix.debug.eprint("failed to open report.csv");
  return 1;
}

file << output;
```

## CSV escaping behavior

When writing CSV, fields that need escaping should be quoted.

Examples:

```txt id="toxpl8"
Hello, world
She said "hello"
line one
line two
```

Expected CSV-safe output shape:

```csv id="n3dx4i"
"Hello, world"
"She said ""hello"""
"line one
line two"
```

Use `rix.csv.write(table)` instead of manual string concatenation.

## Header convention

CSV headers are normal rows.

If your CSV has a header, treat the first row as the header:

```cpp id="iil5zt"
const auto &header = table[0];
```

Then process data rows from index `1`:

```cpp id="pr89b4"
for (std::size_t i = 1; i < table.size(); ++i)
{
  const auto &row = table[i];
}
```

If your CSV has no header, process every row as data:

```cpp id="ky4s45"
for (const auto &row : table)
{
  rix.debug.print(row.size());
}
```

## Single-file usage

For quick examples:

```bash id="onli4u"
vix run csv.cpp
```

If Rix is not available yet for single-file usage:

```bash id="mkm930"
vix install -g rix/rix
vix run csv.cpp
```

## Project usage

For a Vix project, add Rix:

```bash id="qffg32"
vix add rix/rix
vix install
```

In `vix.app`:

```txt id="a9edc4"
deps = [
  "rix/rix",
]
```

A small manifest can look like this:

```txt id="id05a1"
name = "csv-app"
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

Build and run:

```bash id="agxf5o"
vix build
vix run
```

## Independent package usage

If the project only needs CSV, install:

```bash id="zs3kk7"
vix add rix/csv
vix install
```

In `vix.app`:

```txt id="yo5p18"
deps = [
  "rix/csv",
]
```

Then include:

```cpp id="a1ol7f"
#include <rix/csv.hpp>
```

Use this style when you do not need the unified `rix.*` facade.

## Lightweight facade usage

If you want the unified facade but only want CSV mounted:

```cpp id="xy0k5m"
#define RIX_ENABLE_CSV
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse("name,lang\nAda,C++\n");
  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Common mistakes

### Calling `table[0]` on an empty table

Wrong:

```cpp id="xo5ps3"
const auto &header = table[0];
```

Better:

```cpp id="xdore7"
if (!table.empty())
{
  const auto &header = table[0];
}
```

### Calling `row[1]` without checking row size

Wrong:

```cpp id="vpfw8i"
rix.debug.print(row[0], row[1]);
```

Better:

```cpp id="g0wwtw"
if (row.size() >= 2)
{
  rix.debug.print(row[0], row[1]);
}
```

### Splitting CSV manually

Wrong:

```cpp id="vn819b"
std::getline(stream, field, ',');
```

Better:

```cpp id="njwaso"
const auto table = rix.csv.parse(input);
```

Manual splitting breaks with quoted commas, quotes, and newlines.

### Building CSV manually

Wrong:

```cpp id="nfgoee"
output += name + "," + language + "\n";
```

Better:

```cpp id="yargxq"
table.push_back({name, language});
const auto output = rix.csv.write(table);
```

### Putting Rix packages in `packages`

Wrong:

```txt id="joxh69"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="yir9j1"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

## API summary

Main facade:

```cpp id="o4u7sq"
rix.csv.parse(input)
rix.csv.parse(input, options)
rix.csv.write(table)
rix.csv.version()
```

Main types:

```cpp id="yxfi0x"
rixlib::csv::Table
rixlib::csv::Row
rixlib::csv::Options
```

Main options:

```cpp id="i4eeqy"
options.field_transformer
options.row_filter
```

Recommended include:

```cpp id="lj6ekh"
#include <rix.hpp>
```

Independent include:

```cpp id="zebj09"
#include <rix/csv.hpp>
```

## Security and data notes

CSV is plain text.

Do not use CSV as a secure storage format.

Do not store production secrets in CSV files.

Be careful with user data exports.

Validate external CSV before using field indexes.

Use database storage for durable application state.

Use JSON when the data is nested or structured beyond simple rows and columns.

## What you should remember

Parse CSV:

```cpp id="h2b14o"
const auto table = rix.csv.parse(input);
```

Parse with options:

```cpp id="n92kru"
rixlib::csv::Options options;

const auto table = rix.csv.parse(input, options);
```

Write CSV:

```cpp id="rpbvzt"
const auto output = rix.csv.write(table);
```

Create a table:

```cpp id="y50s6y"
rixlib::csv::Table table;

table.push_back({"name", "language"});
```

Validate before indexing external input:

```cpp id="qqw4hg"
if (row.size() >= 2)
{
  rix.debug.print(row[0], row[1]);
}
```

Use `deps` for Rix packages in `vix.app`:

```txt id="itytlo"
deps = [
  "rix/rix",
]
```

## Next step

Continue with the debug package.

Next: [Debug](/packages/debug/)
