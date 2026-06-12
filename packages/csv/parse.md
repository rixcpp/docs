# Parse CSV

This page explains how to parse CSV text with `rix/csv`.

The examples use the public Rix facade:

```cpp id="h3tf2q"
#include <rix.hpp>
```

and access CSV through:

```cpp id="n5a1rv"
rix.csv
```

Parsing turns CSV text into a table that can be inspected row by row.

## Basic example

Create a file:

```bash id="k5lx9z"
mkdir -p ~/rix-csv-parse
cd ~/rix-csv-parse
touch parse.cpp
```

Add:

```cpp id="lm9x7c"
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

  return 0;
}
```

Run it:

```bash id="q7cqp8"
vix run parse.cpp
```

If Rix is not available yet for single-file usage:

```bash id="jlihaf"
vix install -g rix/rix
vix run parse.cpp
```

## Expected output

The output should look like this:

```txt id="e3p2ei"
rows: 3
name language
Ada C++
Gaspard Vix
```

The first row is the header.

The following rows are data rows.

## Parse a string

Use:

```cpp id="z9bsv7"
const auto table = rix.csv.parse(input);
```

Example:

```cpp id="lsx8bs"
const std::string input =
    "name,language\n"
    "Ada,C++\n"
    "Gaspard,Vix\n";

const auto table = rix.csv.parse(input);
```

The parsed table can be read with normal row and field access:

```cpp id="xkcz42"
rix.debug.print(table[0][0]);
rix.debug.print(table[0][1]);
rix.debug.print(table[1][0]);
rix.debug.print(table[1][1]);
```

For the example above:

```txt id="ev27a9"
table[0][0] -> name
table[0][1] -> language
table[1][0] -> Ada
table[1][1] -> C++
```

## Table model

A parsed CSV value is a table.

Conceptually:

```txt id="r6litf"
Table
  -> Row
     -> Field
```

A table contains rows.

Each row contains fields.

Example:

```cpp id="boq89v"
const auto table = rix.csv.parse(input);

for (const auto &row : table)
{
  for (const auto &field : row)
  {
    rix.debug.print(field);
  }
}
```

## Count rows

Use:

```cpp id="t98qpv"
table.size()
```

Example:

```cpp id="m9qxam"
const auto table = rix.csv.parse(input);

rix.debug.print("row count:", table.size());
```

For this input:

```csv id="pj1wlj"
name,language
Ada,C++
Gaspard,Vix
```

the row count is:

```txt id="cwmo9y"
3
```

because the header is also a row.

## Check for empty CSV

Use:

```cpp id="n453xy"
table.empty()
```

Example:

```cpp id="yxymq1"
const auto table = rix.csv.parse(input);

if (table.empty())
{
  rix.debug.eprint("CSV is empty");
  return 1;
}
```

Check for empty tables before accessing `table[0]`.

## Read the header

CSV does not force a special header type.

The first row can be treated as the header by convention:

```cpp id="l2dpr5"
const auto table = rix.csv.parse(input);

if (!table.empty())
{
  const auto &header = table[0];

  for (const auto &column : header)
  {
    rix.debug.print("column:", column);
  }
}
```

For this input:

```csv id="m9y9el"
name,language
Ada,C++
```

the header is:

```txt id="v7p6oi"
name
language
```

## Read data rows

If the first row is a header, read data rows starting at index `1`:

```cpp id="o1h852"
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

This keeps the header separate from the data.

## Validate row size

External CSV input can be inconsistent.

Do not assume every row has the expected number of fields.

Check each row before reading indexes:

```cpp id="ubsdyr"
for (std::size_t i = 1; i < table.size(); ++i)
{
  const auto &row = table[i];

  if (row.size() < 2)
  {
    rix.debug.eprint("invalid row:", i);
    continue;
  }

  rix.debug.print(row[0], row[1]);
}
```

This avoids accessing a missing field.

## Parse without a header

Some CSV input has no header.

Example:

```cpp id="kzhhar"
const std::string input =
    "Ada,C++\n"
    "Gaspard,Vix\n";

const auto table = rix.csv.parse(input);

for (const auto &row : table)
{
  if (row.size() < 2)
  {
    continue;
  }

  rix.debug.print("name:", row[0]);
  rix.debug.print("language:", row[1]);
}
```

In this case, every row is treated as data.

## Parse quoted fields

CSV fields can contain commas when they are quoted.

Example input:

```cpp id="kc3lr4"
const std::string input =
    "name,note\n"
    "Ada,\"created with C++\"\n"
    "Grace,\"likes systems, tools, and documents\"\n";

const auto table = rix.csv.parse(input);
```

The comma inside the quoted field belongs to the field value.

It should not create a new column.

## Parse quotes inside fields

CSV quotes inside a quoted field are usually escaped by doubling them.

Example input:

```cpp id="yxvcxz"
const std::string input =
    "name,quote\n"
    "Ada,\"She said \"\"hello\"\"\"\n";

const auto table = rix.csv.parse(input);
```

The parsed quote field should represent:

```txt id="od0lrr"
She said "hello"
```

Use CSV parsing instead of splitting strings manually.

## Avoid manual splitting

Avoid this:

```cpp id="sqev13"
std::getline(line, field, ',');
```

Manual splitting breaks when fields contain commas, quotes, or newlines.

Use:

```cpp id="dfwkmm"
const auto table = rix.csv.parse(input);
```

The parser handles CSV structure for you.

## Complete validation example

```cpp id="bso0uw"
#include <rix.hpp>

#include <string>

int main()
{
  const std::string input =
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix\n";

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

  rix.debug.print("header:", table[0][0], table[0][1]);

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

  return 0;
}
```

Run it:

```bash id="acxd3h"
vix run parse.cpp
```

## Use in a Vix project

Create an application:

```bash id="vn6p0b"
vix new csv-parse --app
cd csv-parse
```

Add Rix:

```bash id="dtgkwu"
vix add rix/rix
vix install
```

In `vix.app`, add:

```txt id="ho5of9"
deps = [
  "rix/rix",
]
```

A small manifest can look like this:

```txt id="znp6xw"
name = "csv-parse"
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

```cpp id="cdcs4g"
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

```bash id="hb26cw"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments, you can use:

```bash id="hf8osn"
vix run parse.cpp
```

If Rix is installed globally for single-file usage:

```bash id="e8r4wa"
vix install -g rix/rix
vix run parse.cpp
```

For project usage, prefer:

```bash id="q9380l"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="gp94gr"
deps = [
  "rix/rix",
]
```

## Facade usage

The recommended documentation style is:

```cpp id="xzeeqs"
#include <rix.hpp>
```

Then:

```cpp id="sal3zh"
const auto table = rix.csv.parse(input);
```

This keeps CSV available through the same public object as the other Rix packages:

```cpp id="dvfh67"
rix.csv
rix.debug
rix.auth
rix.pdf
```

## Independent package usage

If your project only needs CSV, you can install the independent package:

```bash id="fgqx77"
vix add rix/csv
vix install
```

In `vix.app`:

```txt id="eaxtdb"
deps = [
  "rix/csv",
]
```

Then include:

```cpp id="f0f7sg"
#include <rix/csv.hpp>
```

Use this style when you do not need the unified `rix.*` facade.

## Lightweight facade usage

If you want the facade style but only want CSV mounted:

```cpp id="huv0lz"
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

### Treating the header as data

If the first row is a header, start from index `1`:

```cpp id="a5m38i"
for (std::size_t i = 1; i < table.size(); ++i)
{
  const auto &row = table[i];
}
```

### Accessing missing fields

Wrong:

```cpp id="ssfzv8"
rix.debug.print(row[0], row[1]);
```

Better:

```cpp id="eov6y6"
if (row.size() >= 2)
{
  rix.debug.print(row[0], row[1]);
}
```

### Splitting CSV manually

Wrong:

```cpp id="hl9kb5"
std::getline(stream, field, ',');
```

Better:

```cpp id="p3mbr3"
const auto table = rix.csv.parse(input);
```

### Forgetting `deps`

For a Vix project, do not put Rix packages in `packages`.

Use:

```txt id="gi0rzg"
deps = [
  "rix/rix",
]
```

`packages` is for CMake package discovery.

`deps` is for Vix Registry packages.

## What you should remember

Parse CSV:

```cpp id="b6s84x"
const auto table = rix.csv.parse(input);
```

Check for empty input:

```cpp id="uxb9xl"
if (table.empty())
{
  return 1;
}
```

Read rows:

```cpp id="nqzm43"
for (const auto &row : table)
{
  for (const auto &field : row)
  {
    rix.debug.print(field);
  }
}
```

Read data rows after a header:

```cpp id="f8vxvx"
for (std::size_t i = 1; i < table.size(); ++i)
{
  const auto &row = table[i];
}
```

Validate row size before indexing:

```cpp id="c1d8ru"
if (row.size() >= 2)
{
  rix.debug.print(row[0], row[1]);
}
```

## Next step

Learn how to write CSV output.

Next: [Write CSV](./write)
