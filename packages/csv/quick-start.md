# CSV Quick Start

This page shows the fastest way to use `rix/csv` from a Vix.cpp project.

The examples use the public Rix facade:

```cpp id="z4r7mk"
#include <rix.hpp>
```

and access CSV through:

```cpp id="a9wq2n"
rix.csv
```

## What you will build

You will create a small C++ file that:

```txt id="vq1p7d"
parses CSV text
prints the number of rows
prints each row
writes CSV text back
runs with vix run
```

## Create a working folder

Create a small folder in your home directory:

```bash id="z9d2xe"
mkdir -p ~/rix-csv-quick-start
cd ~/rix-csv-quick-start
touch csv.cpp
```

## Add the example

Open:

```txt id="y9q1cr"
csv.cpp
```

Add:

```cpp id="x6zc7s"
#include <rix.hpp>

#include <sstream>
#include <string>

static void print_table(const rixlib::csv::Table &table)
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

int main()
{
  const std::string input =
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix\n";

  const auto table = rix.csv.parse(input);

  rix.debug.print("rows:", table.size());
  print_table(table);

  const auto output = rix.csv.write(table);

  rix.debug.print("----------------------------------------");
  rix.debug.print(output);

  return 0;
}
```

## Run the file

Run:

```bash id="y86ybb"
vix run csv.cpp
```

If Rix is not available yet for single-file usage:

```bash id="mka0og"
vix install -g rix/rix
vix run csv.cpp
```

## Expected output

The output should look like this:

```txt id="z0c0hu"
rows: 3
name language
Ada C++
Gaspard Vix
----------------------------------------
name,language
Ada,C++
Gaspard,Vix
```

The first part prints the parsed table.

The second part prints the CSV generated from the table.

## Parse CSV text

Use:

```cpp id="tu1rqh"
const auto table = rix.csv.parse(input);
```

Example:

```cpp id="x4idx5"
const std::string input =
    "name,language\n"
    "Ada,C++\n"
    "Gaspard,Vix\n";

const auto table = rix.csv.parse(input);
```

The parsed result is a table.

A table is a list of rows.

A row is a list of fields.

```txt id="sy7123"
table
  -> row
     -> field
```

## Read rows

You can iterate over rows:

```cpp id="kzkakw"
for (const auto &row : table)
{
  rix.debug.print("fields:", row.size());
}
```

You can also access fields by index:

```cpp id="wxs6op"
rix.debug.print(table[0][0]);
rix.debug.print(table[0][1]);
```

For this input:

```csv id="h230yy"
name,language
Ada,C++
```

the values are:

```txt id="i8rx13"
table[0][0] -> name
table[0][1] -> language
table[1][0] -> Ada
table[1][1] -> C++
```

## Read the header

CSV does not force a special header type.

The first row can be used as the header by convention:

```cpp id="e5j1fe"
if (!table.empty())
{
  const auto &header = table[0];

  for (const auto &column : header)
  {
    rix.debug.print("column:", column);
  }
}
```

Then read data rows from index `1`:

```cpp id="xa7fqb"
for (std::size_t i = 1; i < table.size(); ++i)
{
  const auto &row = table[i];

  if (row.size() < 2)
  {
    continue;
  }

  rix.debug.print("name:", row[0]);
  rix.debug.print("language:", row[1]);
}
```

## Write CSV

Create a table:

```cpp id="jqjz99"
rixlib::csv::Table table;

table.push_back({"name", "language"});
table.push_back({"Ada", "C++"});
table.push_back({"Gaspard", "Vix"});
```

Write it:

```cpp id="j1o7zc"
const auto output = rix.csv.write(table);
```

Print it:

```cpp id="b5147l"
rix.debug.print(output);
```

Expected shape:

```csv id="yot3wu"
name,language
Ada,C++
Gaspard,Vix
```

## Complete write example

```cpp id="tq9w62"
#include <rix.hpp>

int main()
{
  rixlib::csv::Table table;

  table.push_back({"name", "project"});
  table.push_back({"Ada", "Rix"});
  table.push_back({"Gaspard", "Vix.cpp"});

  const auto output = rix.csv.write(table);

  rix.debug.print(output);

  return 0;
}
```

Run it:

```bash id="ko1kgy"
vix run csv.cpp
```

## Use in a Vix project

Create a Vix application:

```bash id="vqnxxa"
vix new csv-app --app
cd csv-app
```

Add Rix:

```bash id="g6xu35"
vix add rix/rix
vix install
```

In `vix.app`, make sure Rix is listed under `deps`:

```txt id="gi8nrn"
deps = [
  "rix/rix",
]
```

A small `vix.app` can look like this:

```txt id="ea8zgk"
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

Then use CSV in `src/main.cpp`:

```cpp id="dsxt2y"
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

Build and run:

```bash id="uhqsq4"
vix build
vix run
```

## Use only CSV with the facade

If you want the `rix.*` facade style but only want CSV mounted, define the feature macro before including `rix.hpp`:

```cpp id="g2h1zt"
#define RIX_ENABLE_CSV
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse("name,lang\nAda,C++\n");
  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

This is useful for lighter builds.

## Use the independent package

For independent usage, install:

```bash id="l8cqgm"
vix add rix/csv
vix install
```

In `vix.app`:

```txt id="sxm9cj"
deps = [
  "rix/csv",
]
```

Then include the independent package header:

```cpp id="p3i92d"
#include <rix/csv.hpp>
```

Use this style when a project only needs CSV and does not need the full unified Rix facade.

For most application documentation, prefer:

```cpp id="md0b84"
#include <rix.hpp>
```

## Validate external CSV

When reading CSV from external input, check the table shape before using indexes.

```cpp id="zv8jeq"
const auto table = rix.csv.parse(input);

if (table.empty())
{
  rix.debug.eprint("CSV is empty");
  return 1;
}

if (table[0].size() < 2)
{
  rix.debug.eprint("expected at least two columns");
  return 1;
}
```

Check each row:

```cpp id="tl12fl"
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

This avoids assuming that every row has the expected number of fields.

## Common mistakes

### Forgetting to install Rix

If `#include <rix.hpp>` is not found, install the facade package:

```bash id="nj8cze"
vix install -g rix/rix
```

For a project:

```bash id="uh6lbg"
vix add rix/rix
vix install
```

### Putting Rix in `packages`

Do not put Rix registry packages in `packages`.

Use:

```txt id="nm6vlj"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Reading rows without checking size

Wrong:

```cpp id="axu8x7"
rix.debug.print(row[0], row[1]);
```

Better:

```cpp id="n1fdet"
if (row.size() >= 2)
{
  rix.debug.print(row[0], row[1]);
}
```

### Building CSV by hand

Avoid this:

```cpp id="m2w7fe"
output += name + "," + language + "\n";
```

Use:

```cpp id="pn96xe"
const auto output = rix.csv.write(table);
```

The writer can handle CSV escaping rules.

## What you should remember

Use the facade:

```cpp id="e3t2wu"
#include <rix.hpp>
```

Parse CSV:

```cpp id="d82umu"
const auto table = rix.csv.parse(input);
```

Read rows:

```cpp id="a8x86x"
for (const auto &row : table)
{
  for (const auto &field : row)
  {
    rix.debug.print(field);
  }
}
```

Write CSV:

```cpp id="n1u55a"
const auto output = rix.csv.write(table);
```

For a Vix project, install Rix:

```bash id="j04ryh"
vix add rix/rix
vix install
```

and use:

```txt id="dzpi2x"
deps = [
  "rix/rix",
]
```

## Next step

Learn how to parse CSV data.

Next: [Parse CSV](./parse)
