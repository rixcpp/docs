# Errors

This page explains how error handling works in `rix/pdf`.

The examples use the public Rix facade:

```cpp id="z7q4mx"
#include <rix.hpp>
```

and access PDF through:

```cpp id="h8n2wa"
rix.pdf
```

`rix/pdf` uses explicit result and status values instead of throwing exceptions for normal PDF operation failures.

This means operations such as saving, writing, loading images, or handling invalid paths return an object you can check.

## Basic error example

Create a file:

```bash id="m5x8qd"
mkdir -p ~/rix-pdf-errors
cd ~/rix-pdf-errors
touch errors.cpp
```

Add:

```cpp id="q3v9xa"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "This example intentionally uses an invalid output path.");

  auto saved = rix.pdf.save(doc, "");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 0;
  }

  return 1;
}
```

Run it:

```bash id="b6m2rp"
vix run errors.cpp
```

If Rix is not available yet for single-file usage:

```bash id="g9k4sn"
vix install -g rix/rix
vix run errors.cpp
```

The output should show a PDF error because the output path is empty.

## Error model

`rix/pdf` exposes two main error-aware return types:

```txt id="t2c8vp"
PdfStatus
PdfResult<T>
```

Use `PdfStatus` when an operation only succeeds or fails.

Use `PdfResult<T>` when an operation returns a value on success.

## PdfStatus

`PdfStatus` is used for operations that do not return a value.

Example:

```cpp id="n4d6qh"
auto saved = rix.pdf.save(doc, "output.pdf");
```

`save` returns a status because it only needs to tell you whether the file was saved.

A status has:

```cpp id="c7q9xm"
saved.ok()
saved.failed()
saved.error()
```

Example:

```cpp id="w8p4cn"
if (saved.failed())
{
  const auto &error = saved.error();

  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(error),
      error.message());

  return 1;
}
```

## PdfResult

`PdfResult<T>` is used for operations that return data.

Example:

```cpp id="u6n3za"
auto bytes = rix.pdf.write(doc);
```

`write` returns PDF bytes on success.

A result has:

```cpp id="x5v8bd"
bytes.ok()
bytes.failed()
bytes.value()
bytes.error()
```

Use `value()` only after checking that the result succeeded.

```cpp id="a8r6mk"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(bytes.error()),
      bytes.error().message());

  return 1;
}

rix.debug.print("bytes:", bytes.value().size());
```

## PdfError

Errors are represented by `PdfError`.

A PDF error contains:

```txt id="p2f7jc"
a stable error code
a human-readable message
```

Access the error:

```cpp id="n8d4vw"
const auto &error = saved.error();
```

Read the message:

```cpp id="v6m3tp"
error.message()
```

Convert the code to a string:

```cpp id="d3q9fa"
rix.pdf.error.to_string(error)
```

or:

```cpp id="r9h5yc"
rix.pdf.error.to_string(error.code())
```

## Error codes

`rix/pdf` exposes stable error codes through `rixlib::pdf::PdfErrorCode`.

Common codes include:

```cpp id="f3b8zd"
rixlib::pdf::PdfErrorCode::InvalidInput
rixlib::pdf::PdfErrorCode::InvalidState
rixlib::pdf::PdfErrorCode::InvalidPageSize
rixlib::pdf::PdfErrorCode::InvalidMargins
rixlib::pdf::PdfErrorCode::InvalidText
rixlib::pdf::PdfErrorCode::InvalidImage
rixlib::pdf::PdfErrorCode::InvalidTable
rixlib::pdf::PdfErrorCode::UnsupportedImageFormat
rixlib::pdf::PdfErrorCode::FileOpenFailed
rixlib::pdf::PdfErrorCode::FileReadFailed
rixlib::pdf::PdfErrorCode::FileWriteFailed
rixlib::pdf::PdfErrorCode::SerializationFailed
rixlib::pdf::PdfErrorCode::WriterError
rixlib::pdf::PdfErrorCode::Unknown
```

These codes are useful when your application needs to make programmatic decisions.

## Check a specific error code

Use:

```cpp id="k4h8nm"
rix.pdf.error.is(error, rixlib::pdf::PdfErrorCode::InvalidInput)
```

Example:

```cpp id="y9w3cq"
if (rix.pdf.error.is(
        saved.error(),
        rixlib::pdf::PdfErrorCode::InvalidInput))
{
  rix.debug.eprint("invalid PDF input");
}
```

You can also use the error directly:

```cpp id="v5x2pm"
if (saved.error().is(rixlib::pdf::PdfErrorCode::InvalidInput))
{
  rix.debug.eprint("invalid PDF input");
}
```

## Convert an error code to text

Use:

```cpp id="z2h7qa"
rix.pdf.error.to_string(rixlib::pdf::PdfErrorCode::InvalidInput)
```

Example:

```cpp id="n6m9kx"
rix.debug.print(
    "code:",
    rix.pdf.error.to_string(
        rixlib::pdf::PdfErrorCode::InvalidInput));
```

## Normal save error pattern

Use this pattern when saving a file:

```cpp id="p8r3vb"
auto saved = rix.pdf.save(doc, "output.pdf");

if (saved.failed())
{
  const auto &error = saved.error();

  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(error),
      error.message());

  return 1;
}
```

This keeps failures explicit and easy to debug.

## Normal write error pattern

Use this pattern when writing bytes:

```cpp id="j6w4bd"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  const auto &error = bytes.error();

  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(error),
      error.message());

  return 1;
}

const auto &pdf_data = bytes.value();
```

Use `write` when the generated PDF should be returned from an HTTP route, stored in another system, or handled manually.

## Save error example

This example intentionally saves to an empty path:

```cpp id="w5y8rp"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "Invalid save path example");

  auto saved = rix.pdf.save(doc, "");

  if (saved.failed())
  {
    const auto &error = saved.error();

    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(error),
        error.message());

    return 0;
  }

  return 1;
}
```

Run:

```bash id="s7d2qh"
vix run errors.cpp
```

The failure is expected.

## Missing folder example

Saving to a nested folder fails if the folder does not exist:

```cpp id="h3f9mx"
auto saved = rix.pdf.save(doc, "output/report.pdf");
```

Create the folder first:

```bash id="c8p4zn"
mkdir -p output
```

Then run again.

## Handle file open errors

```cpp id="e6n9vb"
auto saved = rix.pdf.save(doc, "missing-folder/report.pdf");

if (saved.failed())
{
  const auto &error = saved.error();

  if (rix.pdf.error.is(
          error,
          rixlib::pdf::PdfErrorCode::FileOpenFailed))
  {
    rix.debug.eprint("cannot open output file");
    return 1;
  }

  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(error),
      error.message());

  return 1;
}
```

Use this when the application wants a special message for file path problems.

## Handle write errors

A write error can happen when serialization fails.

```cpp id="r2k7dc"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  const auto &error = bytes.error();

  rix.debug.eprint(
      "pdf write failed:",
      rix.pdf.error.to_string(error),
      error.message());

  return 1;
}
```

If the result succeeds, the bytes are safe to use:

```cpp id="t9x3va"
const auto &data = bytes.value();
```

## Image loading errors

Image loading returns `PdfResult<Image>`.

Example:

```cpp id="m4q6kb"
auto image = rix.pdf.image.load_jpeg("missing.jpg");

if (image.failed())
{
  rix.debug.eprint(
      "pdf image error:",
      rix.pdf.error.to_string(image.error()),
      image.error().message());

  return 1;
}
```

Only use `image.value()` after checking success:

```cpp id="f8c5wy"
auto &page = doc.add_page();

page.image_fit(
    image.value(),
    page.x_left(),
    page.y_top() - 200.0F,
    200.0F,
    160.0F);
```

## Unsupported image format

The first image implementation supports JPEG images.

If a non-JPEG file is loaded through `load_jpeg`, the operation can fail with:

```cpp id="z9r6qh"
rixlib::pdf::PdfErrorCode::UnsupportedImageFormat
```

Example:

```cpp id="q6w4kt"
auto image = rix.pdf.image.load_jpeg("logo.png");

if (image.failed())
{
  if (rix.pdf.error.is(
          image.error(),
          rixlib::pdf::PdfErrorCode::UnsupportedImageFormat))
  {
    rix.debug.eprint("only JPEG images are supported here");
    return 1;
  }
}
```

## Full image error example

```cpp id="b9q3xp"
#include <rix.hpp>

int main()
{
  auto image = rix.pdf.image.load_jpeg("missing.jpg");

  if (image.failed())
  {
    const auto &error = image.error();

    rix.debug.eprint(
        "image error:",
        rix.pdf.error.to_string(error),
        error.message());

    return 0;
  }

  return 1;
}
```

Run:

```bash id="k6v8tn"
vix run errors.cpp
```

The failure is expected if `missing.jpg` does not exist.

## Use errors in an HTTP route

When generating a PDF inside a Vix HTTP route, return an HTTP error if PDF generation fails.

```cpp id="p5m8qa"
#include <vix.hpp>
#include <rix.hpp>

int main()
{
  vix::App app;

  app.get("/report.pdf", [](vix::Request &, vix::Response &res) {
    auto doc = rix.pdf.document();

    auto &page = doc.add_page();

    page.text(
        page.x_left(),
        page.y_top(),
        "Hello from rix.pdf");

    auto bytes = rix.pdf.write(doc);

    if (bytes.failed())
    {
      res.status(500).json({
          "ok", false,
          "error", rix.pdf.error.to_string(bytes.error()),
          "message", bytes.error().message()});

      return;
    }

    res.header("Content-Type", "application/pdf");
    res.send(bytes.value());
  });

  app.run();

  return 0;
}
```

Use `write` in routes because the PDF should be returned as response bytes.

## Error response shape

For APIs, a useful JSON error shape is:

```json id="v2q6hb"
{
  "ok": false,
  "error": "FileOpenFailed",
  "message": "Cannot open PDF file for writing."
}
```

In C++:

```cpp id="y4c7mw"
res.status(500).json({
    "ok", false,
    "error", rix.pdf.error.to_string(error),
    "message", error.message()});
```

This keeps API errors predictable.

## Custom error values

You can create an error value through the facade:

```cpp id="w9t2kn"
auto error = rix.pdf.error.make(
    rixlib::pdf::PdfErrorCode::InvalidInput,
    "Custom PDF input error.");
```

You can create a success error value:

```cpp id="d8x5qc"
auto ok = rix.pdf.error.none();
```

Most applications do not need to create PDF errors manually.

This is mainly useful for adapters, wrappers, tests, and higher-level APIs.

## Check whether an error is success

```cpp id="n2q9rd"
auto ok = rix.pdf.error.none();

if (rix.pdf.error.ok(ok))
{
  rix.debug.print("no error");
}
```

Check failure:

```cpp id="h6m8vb"
auto error = rix.pdf.error.make(
    rixlib::pdf::PdfErrorCode::InvalidInput,
    "Invalid PDF input.");

if (rix.pdf.error.failed(error))
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(error),
      error.message());
}
```

## Complete error-handling example

```cpp id="c4b9xr"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  doc.set_title("PDF error handling");

  auto &page = doc.add_page();

  page.text(
      page.x_left(),
      page.y_top(),
      "This document demonstrates explicit PDF errors.");

  auto saved = rix.pdf.save(doc, "");

  if (saved.failed())
  {
    const auto &error = saved.error();

    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(error),
        error.message());

    if (rix.pdf.error.is(
            error,
            rixlib::pdf::PdfErrorCode::InvalidInput))
    {
      rix.debug.eprint("hint:", "use a real output file path");
    }

    return 0;
  }

  return 1;
}
```

Run:

```bash id="x7d5mp"
vix run errors.cpp
```

## Use in a Vix project

Create a Vix application:

```bash id="s3a6wy"
vix new pdf-errors --app
cd pdf-errors
```

Add Rix:

```bash id="j9m2qr"
vix add rix/rix
vix install
```

In `vix.app`, make sure Rix is listed under `deps`:

```txt id="r5v8nc"
deps = [
  "rix/rix",
]
```

A small `vix.app` can look like this:

```txt id="q8b5zk"
name = "pdf-errors"
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

Then use error handling in `src/main.cpp`:

```cpp id="m6v9xt"
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto saved = rix.pdf.save(doc, "");

  if (saved.failed())
  {
    rix.debug.eprint(
        "pdf error:",
        rix.pdf.error.to_string(saved.error()),
        saved.error().message());

    return 0;
  }

  return 1;
}
```

Build and run:

```bash id="d4x6ma"
vix build
vix run
```

## Single-file usage

For small scripts, examples, and experiments:

```bash id="t2h9qc"
vix run errors.cpp
```

If Rix is installed globally for single-file usage:

```bash id="p8z5kr"
vix install -g rix/rix
vix run errors.cpp
```

For project usage, prefer:

```bash id="n7c4qx"
vix add rix/rix
vix install
```

and keep the dependency in `vix.app`:

```txt id="a9w3vd"
deps = [
  "rix/rix",
]
```

## Use only PDF with the facade

If you want the `rix.*` facade style but only want PDF mounted, define the feature macro before including `rix.hpp`:

```cpp id="f6k9mh"
#define RIX_ENABLE_PDF
#include <rix.hpp>

int main()
{
  auto doc = rix.pdf.document();

  auto saved = rix.pdf.save(doc, "");

  if (saved.failed())
  {
    return 0;
  }

  return 1;
}
```

When at least one `RIX_ENABLE_*` macro is defined, only selected modules are mounted.

## Use the independent package

For independent usage, install:

```bash id="w8q5hd"
vix add rix/pdf
vix install
```

In `vix.app`:

```txt id="b5c9pa"
deps = [
  "rix/pdf",
]
```

Then include:

```cpp id="x4m7nr"
#include <rix/pdf.hpp>
```

Use this style when a project only needs PDF and does not need the full unified Rix facade.

For most application documentation, prefer:

```cpp id="h3r8qt"
#include <rix.hpp>
```

## Common mistakes

### Calling `value()` before checking success

Wrong:

```cpp id="n5x9bc"
auto bytes = rix.pdf.write(doc);

rix.debug.print(bytes.value().size());
```

Correct:

```cpp id="c7d2ma"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  return 1;
}

rix.debug.print(bytes.value().size());
```

### Ignoring save errors

Wrong:

```cpp id="v8w3qk"
rix.pdf.save(doc, "output.pdf");
```

Better:

```cpp id="q2p6yf"
auto saved = rix.pdf.save(doc, "output.pdf");

if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());

  return 1;
}
```

### Saving to a missing folder

This can fail:

```cpp id="m7r5xd"
rix.pdf.save(doc, "output/report.pdf");
```

Create the folder first:

```bash id="h6q9vs"
mkdir -p output
```

### Saving to an empty path

This is invalid:

```cpp id="k8c4nw"
rix.pdf.save(doc, "");
```

Use a real file path:

```cpp id="s9f3qp"
rix.pdf.save(doc, "output.pdf");
```

### Treating normal failures as exceptions

Normal PDF failures are returned as `PdfStatus` or `PdfResult<T>`.

Use:

```cpp id="r7y2vb"
if (result.failed())
{
  // handle error
}
```

Do not rely on exceptions for normal save, write, or image-loading failures.

### Confusing `deps` and `packages`

For a Vix project, do not put Rix packages in `packages`.

Wrong:

```txt id="z3x6pm"
packages = [
  "rix/rix",
]
```

Correct:

```txt id="p6v8ka"
deps = [
  "rix/rix",
]
```

`deps` is for Vix Registry packages.

`packages` is for CMake package discovery.

## What you should remember

Check `save`:

```cpp id="w4b9zd"
auto saved = rix.pdf.save(doc, "output.pdf");

if (saved.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(saved.error()),
      saved.error().message());
}
```

Check `write`:

```cpp id="x3q7hd"
auto bytes = rix.pdf.write(doc);

if (bytes.failed())
{
  rix.debug.eprint(
      "pdf error:",
      rix.pdf.error.to_string(bytes.error()),
      bytes.error().message());
}
```

Convert errors to strings:

```cpp id="a7m4xr"
rix.pdf.error.to_string(error)
```

Check specific error codes:

```cpp id="y8r3qc"
rix.pdf.error.is(
    error,
    rixlib::pdf::PdfErrorCode::InvalidInput)
```

Never call `value()` before checking success.

For a Vix project, install Rix:

```bash id="g9n6fv"
vix add rix/rix
vix install
```

and use:

```txt id="d6t2rx"
deps = [
  "rix/rix",
]
```

## Next step

Review the PDF API reference.

Next: [API Reference](./api-reference)
