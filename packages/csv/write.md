# Write CSV

This page explains how to write CSV output with `rix/csv`.

The examples use the public Rix facade:

```cpp id="svf4nq"
#include <rix.hpp>
```

and access CSV through:

```cpp id="ed7r9k"
rix.csv
```

Writing turns a table of rows and fields into CSV text.

Use it when your application needs to export small datasets, reports, generated data, test fixtures, or simple tabular output.

## Basic example

Create a file:

```bash id="z3gxel"
mkdir -p ~/rix-csv-write
cd ~/rix-csv-write
touch write.cpp
```

Add:

```cpp id="hh0nqo"
#include <rix.hpp>

int main()
{
  rixlib::csv::Table table;

  table.push_back({"name", "language"});
  table.push_back({"Ada", "C++"});
  table.push_back({"Gaspard", "Vix"});

  const auto output = rix.csv.write(table);

  rix.debug.print(output);

  return 0;
}
```

Run it:

```bash id="i5f8yj"
vix run write.cpp
```

If Rix is not available yet for single-file usage:

```bash id="byv3ei"
vix install -g rix/rix
vix run write.cpp
```

## Expected output

The output should look like this:

```csv id="x276nk"
name,language
Ada,C++
Gaspard,Vix
```

The first row is the header.

The following rows are data rows.

## Create a table

A CSV table is a list of rows.

A row is a list of fields.

```cpp id="bx8w5p"
rixlib::csv::Table table;
```

Add rows with `push_back`:

```cpp id="ulq5u6"
table.push_back({"name", "language"});
table.push_back({"Ada", "C++"});
table.push_back({"Gaspard", "Vix"});
```

Then write it:

```cpp id="vywaig"
const auto output = rix.csv.write(table);
```

## Write a header

CSV does not force a special header type.

The first row can be used as a header by convention:

```cpp id="yxavqz"
rixlib::csv::Table table;

table.push_back({"name", "project"});
table.push_back({"Ada", "Rix"});
table.push_back({"Gaspard", "Vix.cpp"});

const auto output = rix.csv.write(table);
```

Output shape:

```csv id="oxoz7f"
name,project
Ada,Rix
Gaspard,Vix.cpp
```

## Write without a header

If your data does not need a header, start directly with data rows:

```cpp id="n9ok5l"
rixlib::csv::Table table;

table.push_back({"Ada", "C++"});
table.push_back({"Gaspard", "Vix"});

const auto output = rix.csv.write(table);
```

Output shape:

```csv id="sh0s37"
Ada,C++
Gaspard,Vix
```

## Write fields with commas

CSV fields that contain commas must be escaped.

Use the writer instead of building CSV manually.

```cpp id="zqtnoe"
rixlib::csv::Table table;

table.push_back({"name", "note"});
table.push_back({"Ada", "created with C++"});
table.push_back({"Grace", "systems, tools, and documents"});

const auto output = rix.csv.write(table);

rix.debug.print(output);
```

Expected shape:

```csv id="ewpgrm"
name,note
Ada,created with C++
Grace,"systems, tools, and documents"
```

The comma inside the field remains part of the field value.

## Write fields with quotes

Quotes inside fields must be escaped.

```cpp id="w8c8ea"
rixlib::csv::Table table;

table.push_back({"name", "quote"});
table.push_back({"Ada", "She said \"hello\""});

const auto output = rix.csv.write(table);

rix.debug.print(output);
```

Expected shape:

```csv id="iee075"
name,quote
Ada,"She said ""hello"""
```

Use the writer so quote escaping stays correct.

## Write fields with newlines

Fields can contain newlines.

When a field contains a newline, the writer should quote it:

```cpp id="s3eqvd"
rixlib::csv::Table table;

table.push_back({"name", "note"});
table.push_back({"Ada", "line one\nline two"});

const auto output = rix.csv.write(table);

rix.debug.print(output);
```

Expected shape:

```csv id="uy6s0s"
name,note
Ada,"line one
line two"
```

This is why manual string concatenation is unsafe for CSV.

## Avoid manual CSV building

Avoid this:

```cpp id="rbzne0"
std::string output;

output += name;
output += ",";
output += language;
output += "\n";
```

This breaks when fields contain:

```txt id="vm9eui"
commas
quotes
newlines
```

Use:

```cpp id="s3g6vr"
rixlib::csv::Table table;

table.push_back({name, language});

const auto output = rix.csv.write(table);
```

## Complete export example

```cpp id="m6x8y2"
#include <rix.hpp>

int main()
{
  rixlib::csv::Table table;

  table.push_back({"id", "name", "project"});
  table.push_back({"1", "Ada", "Rix"});
  table.push_back({"2", "Gaspard", "Vix.cpp"});
  table.push_back({"3", "Grace", "PDF"});

  const auto output = rix.csv.write(table);

  rix.debug.print(output);

  return 0;
}
```

Run it:

```bash id="lycxjm"
vix run write.cpp
```

Expected output:

```csv id="v9f7fd"
id,name,project
1,Ada,Rix
2,Gaspard,Vix.cpp
3,Grace,PDF
```

## Convert parsed data back to CSV

You can parse CSV, inspect or modify the table, then write it again.

```cpp id="x0d5ay"
#include <rix.hpp>

#include <string>

int main()
{
  const std::string input =
      "name,project\n"
      "Ada,Rix\n"
      "Gaspard,Vix.cpp\n";

  auto table = rix.csv.parse(input);

  table.push_back({"Grace", "PDF"});

  const auto output = rix.csv.write(table);

  rix.debug.print(output);

  return 0;
}
```

This is useful for small transformations.

## Validate before writing

When data comes from outside the program, validate the table before writing it.

```cpp id="caccny"
if (table.empty())
{
  rix.debug.eprint("nothing to write");
  return 1;
}
```

Check row sizes when your output requires a fixed shape:

```cpp id="xlwxz5"
for (std::size_t i = 0; i < table.size(); ++i)
{
  if (table[i].size() != 3)
  {
    rix.debug.eprint("invalid row:", i);
    return 1;
  }
}
```

Then write:

```cpp id="p608w3"
const auto output = rix.csv.write(table);
```

## Save CSV to a file

`rix.csv.write(...)` returns CSV text.

Use normal C++ file output when you want to save it.

```cpp id="q62tb2"
#include <rix.hpp>

#include <fstream>

int main()
{
  rixlib::csv::Table table;

  table.push_back({"name", "project"});
  table.push_back({"Ada", "Rix"});
  table.push_back({"Gaspard", "Vix.cpp"});

  const auto output = rix.csv.write(table);

  std::ofstream file("report.csv");

  if (!file)
  {
    rix.debug.eprint("failed to open report.csv");
    return 1;
  }

  file << output;

  rix.debug.print("created:", "report.csv");

  return 0;
}
```

Run it:

```bash id="cc3dyk"
vix run write.cpp
```

This creates:

```txt id="nnhs8q"
report.csv
```

## Use in a Vix project

Create an application:

```bash id="j6c7ol"
vix new csv-write --app
cd csv-write
```

Add Rix:

```bash id="qi0nci"
vix add rix/rix
vix install
```

In `vix.app`, add:

```txt id="jgqv6h"
deps = [
  "rix/rix",
]
```

A small manifest can look like this:

```txt id="j11wjw"
name = "csv-write"
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

```cpp id="bs6miy"
#include <rix.hpp>

int main()
{
  rixlib::csv::Table table;

  table.push_back({"name", "language"});
  table.push_back({"Ada", "C++"});

  const auto output = rix.csv.write(table);

  rix.debug.print(output);

  return 0;
}
```

Build and run:

```bash id="ntfyyu"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments:

```bash id="h2rrkl"
vix run write.cpp
```

If Rix is installed globally for single-file usage:

```bash id="ymk4bh"
vix install -g rix/rix
vix run write.cpp
```

For project usage, prefer:

```bash id="o2xt3z"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="k2q8g3"
deps = [
  "rix/rix",
]
```

## Facade usage

The recommended documentation style is:

```cpp id="n7063e"
#include <rix.hpp>
```

Then:

```cpp id="jv987a"
const auto output = rix.csv.write(table);
```

This keeps CSV available through the same public object as the other Rix packages:

```cpp id="exeh81"
rix.csv
rix.debug
rix.auth
rix.pdf
```

## Independent package usage

If your project only needs CSV, you can install the independent package:

```bash id="tegz1s"
vix add rix/csv
vix install
```

In `vix.app`:

```txt id="we3d8z"
deps = [
  "rix/csv",
]
```

Then include:

```cpp id="k0zzjh"
#include <rix/csv.hpp>
```

Use this style when you do not need the unified `rix.*` facade.

## Lightweight facade usage

If you want the facade style but only want CSV mounted:

```cpp id="lt1n8h"
#define RIX_ENABLE_CSV
#include <rix.hpp>

int main()
{
  rixlib::csv::Table table;

  table.push_back({"name", "lang"});
  table.push_back({"Ada", "C++"});

  const auto output = rix.csv.write(table);

  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Common mistakes

### Building CSV manually

Wrong:

```cpp id="xoanfc"
output += name + "," + language + "\n";
```

Better:

```cpp id="tpvtvd"
table.push_back({name, language});
const auto output = rix.csv.write(table);
```

### Forgetting quoted-field rules

These fields need escaping:

```txt id="iu7j8n"
Hello, world
She said "hello"
line one
line two
```

Let the CSV writer handle them.

### Forgetting `deps`

For a Vix project, do not put Rix packages in `packages`.

Use:

```txt id="cv36t1"
deps = [
  "rix/rix",
]
```

`packages` is for CMake package discovery.

`deps` is for Vix Registry packages.

### Assuming all rows have the same size

CSV can contain rows with different numbers of fields.

Validate the table if your output requires a fixed number of columns.

```cpp id="xpxr6a"
if (row.size() != 3)
{
  return 1;
}
```

## What you should remember

Create a table:

```cpp id="hw3yvw"
rixlib::csv::Table table;
```

Add rows:

```cpp id="l675j6"
table.push_back({"name", "language"});
table.push_back({"Ada", "C++"});
```

Write CSV:

```cpp id="tr44tl"
const auto output = rix.csv.write(table);
```

Print or save the output:

```cpp id="ugcru1"
rix.debug.print(output);
```

For a Vix project, install Rix:

```bash id="rg6pd5"
vix add rix/rix
vix install
```

and use:

```txt id="t1h09g"
deps = [
  "rix/rix",
]
```

Use the writer instead of manual string concatenation.

Validate row sizes when your output expects a fixed schema.

## Next step

Learn how to use CSV safely with external input.

Next: [Safe Access](./parse)
