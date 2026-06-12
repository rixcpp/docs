# Packages

Rix packages are optional userland libraries for Vix.cpp applications.

They are not part of the Vix.cpp core runtime.

They are installed through the Vix Registry and used from normal C++ code.

The recommended public entry point is the unified Rix facade:

```cpp id="2wfsxo"
#include <rix.hpp>
```

Then use package APIs through:

```cpp id="tg6jae"
rix.auth
rix.csv
rix.debug
rix.pdf
```

## Package model

Every Rix package follows the same model:

```txt id="0jfhsh"
Package  : rix/name
Header   : <rix/name.hpp>
Namespace: rixlib::name
Facade   : rix.name
```

Example:

```txt id="c3ii3d"
Package  : rix/auth
Header   : <rix/auth.hpp>
Namespace: rixlib::auth
Facade   : rix.auth
```

The unified facade package is:

```txt id="ess5dq"
Package: rix/rix
Header : <rix.hpp>
Object : rix
```

## Install the facade package

For most applications, install the unified facade:

```bash id="lhfpm3"
vix add rix/rix
vix install
```

If the project uses `vix.app`, declare the dependency in `deps`:

```txt id="0k68oa"
deps = [
  "rix/rix",
]
```

`deps` is for packages from the Vix Registry.

Do not put Rix packages in `packages`.

## Install an independent package

You can also install one package directly.

Example with Auth only:

```bash id="cu5z8u"
vix add rix/auth
vix install
```

Then declare it in `vix.app`:

```txt id="cbsayb"
deps = [
  "rix/auth",
]
```

Independent packages are useful when a project or library only needs one package and does not want the full facade package.

For public documentation examples, the recommended path remains:

```cpp id="80q2b8"
#include <rix.hpp>
```

and:

```cpp id="xo17sp"
rix.<package>
```

## Current packages

Rix currently includes these userland packages:

| Package     | Facade API  | Purpose                                                                     |
| ----------- | ----------- | --------------------------------------------------------------------------- |
| `rix/auth`  | `rix.auth`  | Authentication helpers for users, passwords, sessions, and tokens.          |
| `rix/csv`   | `rix.csv`   | CSV parsing, writing, file loading, file saving, and table helpers.         |
| `rix/debug` | `rix.debug` | Lightweight debug printing, formatting, string rendering, and inspection.   |
| `rix/pdf`   | `rix.pdf`   | PDF document creation, text, tables, drawing, metadata, images, and saving. |

## Auth

`rix/auth` provides authentication helpers for Vix.cpp applications.

Use it for:

- user registration
- login
- password hashing
- session authentication
- session refresh
- logout
- logout all sessions for a user
- token issuing
- explicit error handling
- memory-backed stores
- database-backed stores

Facade example:

```cpp id="59t7ky"
#include <rix.hpp>

int main()
{
  auto auth = rix.auth.memory();
  auto registered = auth.register_user({"ada@example.com", "correct-password"});

  if (registered.failed())
  {
    return 1;
  }

  auto login = auth.login({"ada@example.com", "correct-password"});

  return login.failed() ? 1 : 0;
}
```

Continue with:

- [Auth Overview](/packages/auth/)
- [Auth Quick Start](/packages/auth/quick-start)
- [Register and Login](/packages/auth/register-login)

## CSV

`rix/csv` provides CSV utilities for C++ applications.

Use it for:

- parsing CSV strings
- parsing CSV streams
- writing CSV strings
- writing rows
- loading CSV files
- saving CSV files
- read options
- write options
- dictionary-style rows
- streaming parsing
- table helpers

Facade example:

```cpp id="3todep"
#include <rix.hpp>

int main()
{
  auto table = rix.csv.parse(
      "name,language\n"
      "Ada,C++\n"
      "Gaspard,Vix.cpp\n"
  );

  auto output = rix.csv.write(table);

  return output.empty() ? 1 : 0;
}
```

CSV documentation will cover parsing, writing, options, helpers, and API reference.

## Debug

`rix/debug` provides lightweight debug utilities.

Use it for:

- simple printing
- error printing
- debug-only printing
- rendering printed values into strings
- placeholder-based formatting
- value inspection

Facade example:

```cpp id="04nyxi"
#include <rix.hpp>

int main()
{
  rix.debug.print("Hello", "Rix");
  auto text = rix.debug.format("Package: {}", "rix/debug");
  rix.debug.inspect(text);

  return 0;
}
```

Use `rix.debug` for lightweight debug output and inspection.

For application logging, prefer the Vix logging system.

Debug documentation will cover print, format, inspect, and API reference.

## PDF

`rix/pdf` provides PDF generation utilities.

Use it for:

- creating documents
- adding pages
- drawing text
- drawing headings
- drawing paragraphs
- drawing lines and shapes
- creating tables
- setting metadata
- embedding JPEG images
- writing PDF bytes
- saving PDF files
- simple text PDF generation
- explicit error handling

Facade example:

```cpp id="3xw611"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Hello from rix.pdf"
  );

  auto saved = rix.pdf.save(doc, "hello.pdf");

  return saved.failed() ? 1 : 0;
}
```

PDF documentation will cover documents, text, tables, drawing, metadata, save/write, errors, and API reference.

## Facade vs independent packages

Use the facade when you want one clean public API:

```cpp id="8dy04q"
#include <rix.hpp>

auto auth = rix.auth.memory();
auto table = rix.csv.parse("name,lang\nAda,C++\n");
auto doc = rix.pdf.document();
```

Use an independent package when you only need one package:

```cpp id="xj585k"
#include <rix/auth.hpp>
```

The facade is best for applications.

Independent packages are useful for smaller dependency surfaces, reusable libraries, and advanced package-level usage.

## Packages and `vix.app`

Registry packages belong in `deps`.

Facade dependency:

```txt id="rrqqf9"
deps = [
  "rix/rix",
]
```

Independent package dependencies:

```txt id="8plq78"
deps = [
  "rix/auth",
  "rix/csv",
  "rix/debug",
  "rix/pdf",
]
```

Do not put Rix packages here:

```txt id="b5sc8n"
packages = [
  "rix/rix",
]
```

`packages` is for CMake `find_package`.

`deps` is for Vix Registry packages.

## Single-file usage

For quick experiments, a package can be used from a single file.

Example:

```bash id="fbzr4e"
mkdir -p ~/rix-package-example
cd ~/rix-package-example
touch main.cpp
```

```cpp id="fzixya"
#include <rix.hpp>

int main()
{
  rix.debug.print("Rix packages are available");

  return 0;
}
```

Run:

```bash id="bb7s11"
vix run main.cpp
```

If the facade package is not available yet, install it globally:

```bash id="1ex03s"
vix install -g rix/rix
```

Then run again:

```bash id="e2yv9l"
vix run main.cpp
```

For real applications, prefer local project dependencies:

```bash id="7nql1o"
vix add rix/rix
vix install
```

## What you should remember

Rix packages are optional userland libraries for Vix.cpp applications.

Use the facade for public application code:

```cpp id="kp8gnd"
#include <rix.hpp>
```

Then use:

```cpp id="j51sx2"
rix.auth
rix.csv
rix.debug
rix.pdf
```

Declare Registry packages in `vix.app` using:

```txt id="hwufle"
deps = [
  "rix/rix",
]
```

Use independent packages when you want a smaller direct dependency.

## Next step

Start with Auth.

Next: [Auth Overview](/packages/auth/)
