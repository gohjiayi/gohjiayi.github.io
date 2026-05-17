#!/usr/bin/env node

const { execFileSync } = require("child_process");
const path = require("path");

const pdfPath = process.argv[2];

if (!pdfPath) {
  console.error("Usage: node scripts/extract_pdf_text.js <pdf-path>");
  process.exit(1);
}

const absolutePdfPath = path.resolve(pdfPath);

const jxaSource = String.raw`
ObjC.import('Foundation');
ObjC.import('PDFKit');
ObjC.import('stdlib');

function fail(message) {
  $.NSFileHandle.fileHandleWithStandardError.writeData(
    $(message + "\n").dataUsingEncoding($.NSUTF8StringEncoding)
  );
  $.exit(1);
}

function write(message) {
  $.NSFileHandle.fileHandleWithStandardOutput.writeData(
    $(message).dataUsingEncoding($.NSUTF8StringEncoding)
  );
}

function unwrapText(value) {
  if (!value) return "";
  return ObjC.unwrap(value).trim();
}

const args = $.NSProcessInfo.processInfo.arguments;
const pdfPath = ObjC.unwrap(args.lastObject);
const url = $.NSURL.fileURLWithPath(pdfPath);
const document = $.PDFDocument.alloc.initWithURL(url);

if (!document) {
  fail("Could not open PDF at: " + pdfPath);
}

const pages = [];

for (let i = 0; i < document.pageCount; i++) {
  const page = document.pageAtIndex(i);
  const text = unwrapText(page ? page.string : null);
  if (text) {
    pages.push("=== Page " + (i + 1) + " ===\n" + text);
  }
}

if (!pages.length) {
  fail("PDF opened but no extractable text was found: " + pdfPath);
}

write(pages.join("\n\n") + "\n");
`;

try {
  const output = execFileSync(
    "osascript",
    ["-l", "JavaScript", "-e", jxaSource, absolutePdfPath],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
  );
  process.stdout.write(output);
} catch (error) {
  if (error.stderr) {
    process.stderr.write(error.stderr);
  }
  process.exit(error.status || 1);
}
