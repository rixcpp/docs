# CSV Options

This page explains how to use options with `rix/csv`.

The examples use the public Rix facade:

```cpp id="a0q9k2"
#include <rix.hpp>
```

and access CSV through:

```cpp id="m7x4ra"
rix.csv
```

CSV options let you customize parsing and writing behavior without changing the rest of your application code.

## Basic idea

For simple CSV input, use:

```cpp id="q8w2kg"
const auto table = rix.csv.parse(input);
```

When you need custom behavior, create options and pass them to the parser or writer.

Example shape:

```cpp id="b4n91v"
rixlib::csv::Options options;

const auto table = rix.csv.parse(input, options);
```

Options are useful when your application needs to:

```txt id="is6wsu"
trim fields
transform fields
skip rows
filter rows
customize CSV handling
keep parsing logic reusable
```

## Complete example

Create a file:

```bash id="oi2evn"
mkdir -p ~/rix-csv-options
cd ~/rix-csv-options
touch options.cpp
```

Add:

```cpp id="s4hz0c"
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
  print_table(table);

  return 0;
}
```

Run it:

```bash id="p9x6aj"
vix run options.cpp
```

If Rix is not available yet for single-file usage:

```bash id="f6bj5y"
vix install -g rix/rix
vix run options.cpp
```

## Expected output

The output should look like this:

```txt id="f9xbsg"
rows: 3
name language
Ada C++
Gaspard Vix.cpp
```

The row starting with `Skip` is removed.

The field `Vix` is transformed into `Vix.cpp`.

## Options object

Create an options object:

```cpp id="pcpwxn"
rixlib::csv::Options options;
```

Then pass it to parsing:

```cpp id="ewj7cc"
const auto table = rix.csv.parse(input, options);
```

Use options when the CSV parser should do more than return the raw fields.

## Field transformer

A field transformer receives a field value and returns the value that should be stored in the parsed table.

Example:

```cpp id="od33a9"
options.field_transformer = [](std::string value) {
  if (value == "Vix")
  {
    return std::string{"Vix.cpp"};
  }

  return value;
};
```

Use this for small transformations such as:

```txt id="ozznf1"
normalizing names
rewriting values
cleaning imported data
mapping old values to new values
```

## Trim-like transformer

If your CSV input contains extra spaces, you can use a transformer to normalize fields.

Example shape:

```cpp id="v3o8ae"
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

Then parse:

```cpp id="xkwxsb"
const auto table = rix.csv.parse(input, options);
```

This keeps cleanup logic close to parsing.

## Row filter

A row filter receives a parsed row and decides whether the row should be kept.

Example:

```cpp id="e06xoz"
options.row_filter = [](const rixlib::csv::Row &row) {
  if (!row.empty() && row[0] == "Skip")
  {
    return false;
  }

  return true;
};
```

Return:

```txt id="c846wg"
true  -> keep the row
false -> remove the row
```

Use row filters for:

```txt id="eeb7rg"
skipping empty rows
skipping comments
removing invalid rows
filtering imported data
keeping only rows your app needs
```

## Skip empty rows

Example:

```cpp id="w12h0j"
options.row_filter = [](const rixlib::csv::Row &row) {
  for (const auto &field : row)
  {
    if (!field.empty())
    {
      return true;
    }
  }

  return false;
};
```

This removes rows where every field is empty.

## Skip comment rows

If your CSV input uses comment-style rows:

```csv id="czo8wm"
# generated data
name,language
Ada,C++
Gaspard,Vix
```

you can filter rows whose first field starts with `#`:

```cpp id="t3p7xj"
options.row_filter = [](const rixlib::csv::Row &row) {
  if (!row.empty() && !row[0].empty() && row[0][0] == '#')
  {
    return false;
  }

  return true;
};
```

Then parse normally:

```cpp id="h0qogw"
const auto table = rix.csv.parse(input, options);
```

## Combine transformer and filter

You can use both hooks together.

```cpp id="r214vh"
rixlib::csv::Options options;

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
```

The field transformer runs on field values.

The row filter decides whether each parsed row should be kept.

## Validate after parsing

Options help transform and filter CSV, but you should still validate external input.

Example:

```cpp id="fi3jhf"
const auto table = rix.csv.parse(input, options);

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

Check row size before indexing:

```cpp id="lystvn"
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

## Options and headers

CSV headers are still normal rows.

If the first row is a header, your row filter should normally keep it.

Example:

```cpp id="pk3z5h"
options.row_filter = [](const rixlib::csv::Row &row) {
  if (row.empty())
  {
    return false;
  }

  return true;
};
```

Then process the header separately:

```cpp id="r917jw"
const auto &header = table[0];
```

and data rows from index `1`:

```cpp id="y090na"
for (std::size_t i = 1; i < table.size(); ++i)
{
  const auto &row = table[i];
}
```

## Options in a Vix project

Create an application:

```bash id="prbonm"
vix new csv-options --app
cd csv-options
```

Add Rix:

```bash id="gtt3vo"
vix add rix/rix
vix install
```

In `vix.app`, add:

```txt id="nmrk87"
deps = [
  "rix/rix",
]
```

A small manifest can look like this:

```txt id="gjsm6r"
name = "csv-options"
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

Then use options in `src/main.cpp`:

```cpp id="u7savh"
#include <rix.hpp>

int main()
{
  const std::string input =
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix\n";

  rixlib::csv::Options options;

  options.field_transformer = [](std::string value) {
    if (value == "Vix")
    {
      return std::string{"Vix.cpp"};
    }

    return value;
  };

  const auto table = rix.csv.parse(input, options);

  rix.debug.print("rows:", table.size());

  return 0;
}
```

Build and run:

```bash id="t5q5qz"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments:

```bash id="sznkr8"
vix run options.cpp
```

If Rix is installed globally for single-file usage:

```bash id="pnq5vy"
vix install -g rix/rix
vix run options.cpp
```

For project usage, prefer:

```bash id="oqg5oh"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="wk5b5b"
deps = [
  "rix/rix",
]
```

## Facade usage

The recommended documentation style is:

```cpp id="bc88x0"
#include <rix.hpp>
```

Then:

```cpp id="q7ehws"
const auto table = rix.csv.parse(input, options);
```

This keeps CSV available through the same public object as the other Rix packages:

```cpp id="k0vy4i"
rix.csv
rix.debug
rix.auth
rix.pdf
```

## Independent package usage

If your project only needs CSV, you can install the independent package:

```bash id="dvj6n7"
vix add rix/csv
vix install
```

In `vix.app`:

```txt id="xrqclv"
deps = [
  "rix/csv",
]
```

Then include:

```cpp id="qmx78g"
#include <rix/csv.hpp>
```

Use this style when you do not need the unified `rix.*` facade.

## Lightweight facade usage

If you want the facade style but only want CSV mounted:

```cpp id="tc77j3"
#define RIX_ENABLE_CSV
#include <rix.hpp>

int main()
{
  rixlib::csv::Options options;

  const auto table = rix.csv.parse("name,lang\nAda,C++\n", options);

  return 0;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Common mistakes

### Filtering out the header by accident

If the first row is a header, make sure the filter keeps it.

Wrong:

```cpp id="p4gcfv"
options.row_filter = [](const rixlib::csv::Row &row) {
  return row[0] != "name";
};
```

This removes the header row.

### Accessing empty rows inside a filter

Wrong:

```cpp id="c8r2hb"
options.row_filter = [](const rixlib::csv::Row &row) {
  return row[0] != "Skip";
};
```

Better:

```cpp id="dydxyw"
options.row_filter = [](const rixlib::csv::Row &row) {
  return row.empty() || row[0] != "Skip";
};
```

Check that the row has fields before reading `row[0]`.

### Doing large business logic inside parsing options

Options are best for small parsing-time transformations.

Keep larger application decisions in normal code after parsing.

### Forgetting `deps`

For a Vix project, do not put Rix packages in `packages`.

Use:

```txt id="vxfxfq"
deps = [
  "rix/rix",
]
```

`packages` is for CMake package discovery.

`deps` is for Vix Registry packages.

## What you should remember

Create options:

```cpp id="cuklt0"
rixlib::csv::Options options;
```

Transform fields:

```cpp id="h46eus"
options.field_transformer = [](std::string value) {
  return value;
};
```

Filter rows:

```cpp id="dbson1"
options.row_filter = [](const rixlib::csv::Row &row) {
  return true;
};
```

Parse with options:

```cpp id="uerrc5"
const auto table = rix.csv.parse(input, options);
```

Validate the parsed table before indexing external data.

Use options for small parse-time cleanup.

Use normal application code for larger business rules.

## Next step

Learn how to access CSV rows safely.

Next: [Safe Access](./parse)
