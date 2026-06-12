# CSV

`rix/csv` is the Rix package for reading and writing CSV data.

It is designed for simple application workflows where a Vix.cpp project needs to parse CSV text, inspect rows, transform values, or generate CSV output.

The examples on this page use the public Rix facade:

```cpp id="8xk2q1"
#include <rix.hpp>
```

and access CSV through:

```cpp id="m9v3rs"
rix.csv
```

## What `rix/csv` provides

`rix/csv` provides a small CSV API for:

```txt id="bq2nwe"
parsing CSV text
reading rows and fields
writing CSV text
working with simple table data
using CSV from the unified rix facade
```

The goal is not to make CSV complicated.

The goal is to give Vix.cpp applications a small, predictable CSV package that works well with the rest of Rix.

## Install

For normal usage through the unified facade, install:

```bash id="pa9n1t"
vix add rix/rix
vix install
```

In `vix.app`, declare:

```txt id="yth2me"
deps = [
  "rix/rix",
]
```

If you want to use only the independent CSV package, install:

```bash id="y0k8ex"
vix add rix/csv
vix install
```

and declare:

```txt id="v6p7h2"
deps = [
  "rix/csv",
]
```

For most documentation examples, prefer the facade package:

```cpp id="hd7pwa"
#include <rix.hpp>
```

## Run as a single file

Create a small working folder:

```bash id="zhlz07"
mkdir -p ~/rix-csv-example
cd ~/rix-csv-example
touch csv.cpp
```

Add:

```cpp id="wne0en"
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

  rix.debug.print("loaded rows:", table.size());
  print_table(table);

  return 0;
}
```

Run it:

```bash id="dviqga"
vix run csv.cpp
```

If Rix is not available yet for single-file usage:

```bash id="btj7s5"
vix install -g rix/rix
vix run csv.cpp
```

## Expected output

The output should look like this:

```txt id="r1qs28"
loaded rows: 3
name language
Ada C++
Gaspard Vix
```

The first row is the CSV header.

The following rows are the data rows.

## Basic parsing

Use:

```cpp id="h6ohxf"
const auto table = rix.csv.parse(input);
```

Example:

```cpp id="1xu6j9"
const std::string input =
    "name,language\n"
    "Ada,C++\n"
    "Gaspard,Vix\n";

const auto table = rix.csv.parse(input);
```

The result is a CSV table.

You can iterate over it:

```cpp id="d538k1"
for (const auto &row : table)
{
  for (const auto &field : row)
  {
    rix.debug.print(field);
  }
}
```

## Table shape

A parsed table behaves like rows of fields.

Conceptually:

```txt id="go2pi0"
Table
  -> Row
     -> Field
```

Example:

```cpp id="iwi29q"
const auto table = rix.csv.parse(input);

rix.debug.print("rows:", table.size());
rix.debug.print("first field:", table[0][0]);
```

For this CSV:

```csv id="zzb58j"
name,language
Ada,C++
```

the table contains:

```txt id="sfa36d"
table[0][0] -> name
table[0][1] -> language
table[1][0] -> Ada
table[1][1] -> C++
```

## Parse a header row

CSV does not force a special header model.

The first row can be treated as the header by convention:

```cpp id="ac160i"
const auto table = rix.csv.parse(input);

if (!table.empty())
{
  const auto &header = table[0];

  for (const auto &name : header)
  {
    rix.debug.print("column:", name);
  }
}
```

Then process data rows starting at index `1`:

```cpp id="h1bktc"
for (std::size_t i = 1; i < table.size(); ++i)
{
  const auto &row = table[i];

  rix.debug.print("name:", row[0]);
  rix.debug.print("language:", row[1]);
}
```

## Writing CSV

Use the CSV writer when you need to generate CSV text.

Example shape:

```cpp id="ck6v07"
rixlib::csv::Table table;

table.push_back({"name", "language"});
table.push_back({"Ada", "C++"});
table.push_back({"Gaspard", "Vix"});

const auto output = rix.csv.write(table);

rix.debug.print(output);
```

Expected CSV shape:

```csv id="vtw9mc"
name,language
Ada,C++
Gaspard,Vix
```

Use writing when your application needs to export reports, logs, generated data, or small datasets.

## CSV escaping

CSV writers should escape fields when needed.

For example, values containing commas, quotes, or newlines need proper CSV escaping.

Example input fields:

```txt id="o1d27m"
Ada
C++
Hello, world
She said "hi"
```

The writer should produce CSV-safe output.

Use `rix.csv.write(...)` instead of building CSV manually with string concatenation.

## Simple export example

```cpp id="xmntnp"
#include <rix.hpp>

int main()
{
  rixlib::csv::Table table;

  table.push_back({"name", "project"});
  table.push_back({"Ada", "Rix"});
  table.push_back({"Gaspard", "Vix.cpp"});

  const auto csv = rix.csv.write(table);

  rix.debug.print(csv);

  return 0;
}
```

Run it:

```bash id="rcj3lh"
vix run csv.cpp
```

## Use CSV in a Vix project

Create an application:

```bash id="ibptjk"
vix new csv-app --app
cd csv-app
```

Add Rix:

```bash id="m506uh"
vix add rix/rix
vix install
```

In `vix.app`, add:

```txt id="cahqke"
deps = [
  "rix/rix",
]
```

A small manifest can look like this:

```txt id="mfxsoj"
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

Then use:

```cpp id="e7upvp"
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse("name,lang\nAda,C++\n");

  rix.debug.print("rows:", table.size());

  return 0;
}
```

Build and run:

```bash id="ebl9cq"
vix build
vix run
```

## Facade usage

The recommended application style is:

```cpp id="ybvm6l"
#include <rix.hpp>

const auto table = rix.csv.parse(input);
```

This keeps all Rix packages available through one object:

```cpp id="cu1e5n"
rix.csv
rix.debug
rix.auth
rix.pdf
```

Use this when your project already uses the Rix facade.

## Independent usage

When using `rix/csv` without the full facade, include the independent package header:

```cpp id="sp2gds"
#include <rix/csv.hpp>
```

Then use the independent API from the CSV package.

This is useful when a project wants only CSV support and does not want to mount all Rix facade packages.

For most documentation examples, the public facade remains the preferred path:

```cpp id="e1bix3"
#include <rix.hpp>
```

## Lightweight facade usage

If you want the unified facade but only want CSV mounted, define the feature macro before including `rix.hpp`:

```cpp id="jasxk6"
#define RIX_ENABLE_CSV
#include <rix.hpp>

int main()
{
  const auto table = rix.csv.parse("name,lang\nAda,C++\n");
  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

This keeps the facade style while reducing what gets included.

## Common use cases

Use `rix/csv` for:

```txt id="ovm9s3"
small data imports
test fixtures
local reports
admin exports
configuration-like tabular data
examples and demos
simple analytics input
```

CSV is useful when the data is tabular and does not need a database.

For durable application state, use a database.

For structured nested data, use JSON.

## CSV and debug

CSV works well with `rix/debug`.

Example:

```cpp id="bzr5jd"
const auto table = rix.csv.parse(input);

rix.debug.print("rows:", table.size());

for (const auto &row : table)
{
  rix.debug.print(row.size());
}
```

For real application logging, prefer the Vix logging system.

Use `rix.debug` mainly for examples, quick tools, and local diagnostics.

## CSV and Auth

CSV can be useful for admin-style import workflows.

Example shapes:

```txt id="wbm7a9"
import initial users
read test users
generate audit exports
create local seed data
```

Do not store plain-text production passwords in CSV files.

Do not export password hashes to client-facing files.

Treat user data as sensitive.

## CSV and PDF

CSV can also feed PDF reports.

Example flow:

```txt id="yfibvd"
parse CSV
build table rows
render PDF table
save PDF
```

This keeps data loading separate from document generation.

`rix.csv` reads the data.

`rix.pdf` generates the document.

## Error handling

CSV APIs are intentionally simple for common usage.

For strict applications, validate the table shape after parsing.

Example:

```cpp id="aaqdz5"
const auto table = rix.csv.parse(input);

if (table.empty())
{
  rix.debug.eprint("CSV is empty");
  return 1;
}

if (table[0].size() != 2)
{
  rix.debug.eprint("expected two columns");
  return 1;
}
```

Validate rows before using indexes:

```cpp id="mwe2q5"
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

## Common mistakes

### Assuming every row has the same size

CSV input can be inconsistent.

Check row sizes when the input is external:

```cpp id="gu6enc"
if (row.size() < 2)
{
  continue;
}
```

### Treating the header as data

If the first row is a header, start processing at index `1`:

```cpp id="tw12k3"
for (std::size_t i = 1; i < table.size(); ++i)
{
  const auto &row = table[i];
}
```

### Building CSV manually

Avoid this for real CSV output:

```cpp id="e8dskv"
output += name + "," + language + "\n";
```

Use the CSV writer so fields can be escaped correctly:

```cpp id="q7vsgw"
auto output = rix.csv.write(table);
```

### Using CSV for secrets

Do not store production secrets in CSV files.

Avoid CSV for sensitive authentication data unless you have a controlled import process.

## What you should remember

Use the public facade:

```cpp id="ez2mkz"
#include <rix.hpp>
```

Parse CSV:

```cpp id="ddkebu"
const auto table = rix.csv.parse(input);
```

Iterate rows:

```cpp id="pb8fll"
for (const auto &row : table)
{
  for (const auto &field : row)
  {
    rix.debug.print(field);
  }
}
```

Write CSV:

```cpp id="w3mf2w"
const auto output = rix.csv.write(table);
```

Use `vix add rix/rix` for the facade package.

Use `deps = ["rix/rix"]` in `vix.app`.

Validate row sizes when reading external CSV.

## Next step

Continue with the debug package.

Next: [Debug](/packages/debug/)
