/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import jsPDF from 'jspdf';
import { fontBase64 } from './fonts/font_base64';

export const fontName: string = 'reportFont';

const callAddFont = function (this: jsPDF): void {
  this.addFileToVFS(`${fontName}.ttf`, fontBase64);
  this.addFont(`${fontName}.ttf`, `${fontName}`, 'normal');
};

jsPDF.API.events.push(['addFonts', callAddFont]);
