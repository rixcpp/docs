# CSV Example

This page shows a small CSV example using the public Rix facade.

The example uses:

```cpp
#include <rix.hpp>
```

and accesses CSV through:

```cpp
rix.csv
```

Use this example when you want to parse CSV text and inspect the rows from a simple C++ file.

## Create the file

```bash
mkdir -p ~/rix-csv-example
cd ~/rix-csv-example
touch csv.cpp
```

Add:

```cpp
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

Run it:

```bash
vix run csv.cpp
```

If Rix is not available yet for single-file usage:

```bash
vix install -g rix/rix
vix run csv.cpp
```

Expected output shape:

```txt
loaded rows: 3
name language
Ada C++
Gaspard Vix
```

## What this example does

The example starts with CSV text:

```cpp
const std::string input =
    "name,language\n"
    "Ada,C++\n"
    "Gaspard,Vix\n";
```

It parses the text with:

```cpp
const auto table = rix.csv.parse(input);
```

Then it prints the number of rows:

```cpp
rix.debug.print("loaded rows:", table.size());
```

Finally, it loops over each row and prints each field.

## Table shape

`rix.csv.parse` returns a table-like value.

A table can be iterated:

```cpp
for (const auto &row : table)
{
  // use row
}
```

Each row can also be iterated or indexed:

```cpp
for (const auto &field : row)
{
  rix.debug.print(field);
}
```

or:

```cpp
rix.debug.print(row[0]);
```

Use this style for small examples, tests, import scripts, and simple data processing.

## Parse a simple CSV string

```cpp
const auto table = rix.csv.parse(
    "name,language\n"
    "Ada,C++\n"
    "Grace,Systems\n");
```

Then:

```cpp
rix.debug.print("rows:", table.size());
```

## Print all rows

```cpp
for (const auto &row : table)
{
  for (const auto &field : row)
  {
    rix.debug.print(field);
  }
}
```

For cleaner output, build one line:

```cpp
for (const auto &row : table)
{
  std::string line;

  for (std::size_t i = 0; i < row.size(); ++i)
  {
    if (i > 0)
    {
      line += " ";
    }

    line += row[i];
  }

  rix.debug.print(line);
}
```

## Read header row

The first row is usually the header:

```cpp
if (!table.empty())
{
  const auto &header = table[0];

  rix.debug.print("columns:", header.size());
}
```

Example:

```cpp
const auto table = rix.csv.parse(
    "name,language,project\n"
    "Ada,C++,Rix\n");

const auto &header = table[0];

rix.debug.print("first column:", header[0]);
```

## Access data rows

If the first row is a header, start from row index `1`:

```cpp
for (std::size_t i = 1; i < table.size(); ++i)
{
  const auto &row = table[i];

  rix.debug.print("name:", row[0]);
}
```

This is useful when processing CSV exports.

## Complete example with headers

```cpp
#include <rix.hpp>

#include <string>

int main()
{
  const std::string input =
      "name,language,project\n"
      "Ada,C++,Rix\n"
      "Gaspard,C++,Vix.cpp\n";

  const auto table = rix.csv.parse(input);

  if (table.empty())
  {
    rix.debug.eprint("csv error:", "empty table");
    return 1;
  }

  rix.debug.print("columns:", table[0].size());

  for (std::size_t i = 1; i < table.size(); ++i)
  {
    const auto &row = table[i];

    rix.debug.print(
        "name:",
        row[0],
        "language:",
        row[1],
        "project:",
        row[2]);
  }

  return 0;
}
```

Run:

```bash
vix run csv.cpp
```

## Write CSV output

If your CSV package has writer support available through the facade, you can write a table back to CSV text with:

```cpp
auto output = rix.csv.write(table);
```

Example shape:

```cpp
const auto table = rix.csv.parse(
    "name,language\n"
    "Ada,C++\n");

const auto output = rix.csv.write(table);

rix.debug.print(output);
```

Use writing when your program transforms rows and needs to export CSV again.

## Transform parsed rows

You can parse, inspect, and create another table.

```cpp
const auto table = rix.csv.parse(
    "name,language\n"
    "Ada,C++\n"
    "Gaspard,Vix\n");

for (std::size_t i = 1; i < table.size(); ++i)
{
  const auto &row = table[i];

  rix.debug.print("developer:", row[0]);
}
```

This is the simplest workflow for CSV import.

## Use with debug formatting

Use `rix.debug.format` when you want a formatted string:

```cpp
const auto message = rix.debug.format(
    "loaded {} rows",
    table.size());

rix.debug.print(message);
```

For real Vix application logging, prefer the Vix logging system.

For small examples, `rix.debug.print` is enough.

## Use in a Vix project

Create a project:

```bash
vix new rix-csv-example --app
cd rix-csv-example
```

Add Rix:

```bash
vix add rix/rix
vix install
```

Make sure `vix.app` contains:

```txt
deps = [
  "rix/rix",
]
```

A minimal `vix.app` can look like this:

```txt
name = "rix-csv-example"
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

```txt
src/main.cpp
```

Build and run:

```bash
vix build
vix run
```

## Single-file usage

For examples, tests, and quick experiments:

```bash
vix run csv.cpp
```

If needed:

```bash
vix install -g rix/rix
vix run csv.cpp
```

For project usage, prefer:

```bash
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt
deps = [
  "rix/rix",
]
```

## Use only CSV with the facade

If you want the `rix.*` facade style but only want CSV mounted, define the feature macro before including `rix.hpp`:

```cpp
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

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

If you also want debug output:

```cpp
#define RIX_ENABLE_CSV
#define RIX_ENABLE_DEBUG
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse("name\nAda\n");

  rix.debug.print("rows:", table.size());

  return 0;
}
```

## Use the independent package

For independent usage, install:

```bash
vix add rix/csv
vix install
```

In `vix.app`:

```txt
deps = [
  "rix/csv",
]
```

Then include the CSV package header directly:

```cpp
#include <rix/csv.hpp>
```

Use this style when a project only needs CSV and does not need the full unified Rix facade.

For most examples in this documentation, prefer:

```cpp
#include <rix.hpp>
```

## Common mistakes

### Forgetting to install Rix

If `rix.hpp` is not found, install Rix first.

For a project:

```bash
vix add rix/rix
vix install
```

For single-file usage:

```bash
vix install -g rix/rix
```

### Putting Rix in `packages`

Wrong:

```txt
packages = [
  "rix/rix",
]
```

Correct:

```txt
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

### Assuming the first row is always data

Many CSV files use the first row as a header:

```txt
name,language
Ada,C++
```

If the first row is a header, data starts at index `1`.

### Accessing columns without checking row size

Wrong:

```cpp
rix.debug.print(row[2]);
```

Better:

```cpp
if (row.size() > 2)
{
  rix.debug.print(row[2]);
}
```

CSV files can contain missing fields.

### Using debug logging as application logging

For small examples:

```cpp
rix.debug.print(...)
```

For real Vix applications, prefer the Vix logging system.

## What you should remember

Use the facade:

```cpp
#include <rix.hpp>
```

Parse CSV:

```cpp
const auto table = rix.csv.parse(input);
```

Loop over rows:

```cpp
for (const auto &row : table)
{
  for (const auto &field : row)
  {
    rix.debug.print(field);
  }
}
```

Run a simple file:

```bash
vix run csv.cpp
```

For project usage:

```bash
vix add rix/rix
vix install
```

and keep:

```txt
deps = [
  "rix/rix",
]
```

## Next step

Continue with the debug example.

Next: [Debug example](./debug)
