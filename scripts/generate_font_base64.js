/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

var fs = require('fs');
var path = require('path');

var fontFileName = process.argv[2];
var FONT_PATH = path.join(__dirname, '../assets', fontFileName);
var OUTPUT_PATH = path.join(__dirname, '../src/plugins/pdf_export/fonts/font_base64.ts');

if (!fs.existsSync(FONT_PATH)) {
  console.error(`❌ Font file not found: ${FONT_PATH}`);
  process.exit(1);
}

var fontBuffer = fs.readFileSync(FONT_PATH);
var base64Font = fontBuffer.toString('base64');

var outputContent = `export const fontBase64 = "${base64Font}";\n`;

fs.writeFileSync(OUTPUT_PATH, outputContent, 'utf8');

console.log(`✅ Base64 font saved to: ${OUTPUT_PATH}`);
