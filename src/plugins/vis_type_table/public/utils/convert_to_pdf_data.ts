/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OpenSearchDashboardsDatatable } from 'src/plugins/expressions';
import { CoreStart } from 'opensearch-dashboards/public';
import { PDF_FONT_SIZE } from '../../../share/public';
import { fontName as reportFont } from '../../../pdf_export/font_manager';
import { FormattedColumn } from '../types';

interface PDFDataProps {
  filename?: string;
  rows: OpenSearchDashboardsDatatable['rows'];
  columns: FormattedColumn[];
  uiSettings: CoreStart['uiSettings'];
}

const generateTableData = (
  rows: OpenSearchDashboardsDatatable['rows'],
  columns: FormattedColumn[],
  formatted: boolean
) =>
  rows.map((row) =>
    columns.map((col) => {
      const value = row[col.id];
      return formatted && col.formatter ? col.formatter.convert(value) : value ?? '-';
    })
  );

const marginValue: number = 10;

const configurePDF = (pdf: jsPDF, title: string, fontName: string, fontSize: number) => {
  pdf.setFont(fontName);
  pdf.setFontSize(fontSize * 2);
  pdf.text(title, marginValue, marginValue);
};

export const toPdf = (
  formatted: boolean,
  { filename = '', rows, columns, uiSettings }: PDFDataProps
): jsPDF => {
  const pdf = new jsPDF('landscape');
  const fontSize = uiSettings.get(PDF_FONT_SIZE);

  configurePDF(pdf, filename, reportFont, fontSize);

  autoTable(pdf, {
    head: [columns.map((col) => col.title)],
    body: generateTableData(rows, columns, formatted),
    margin: { left: marginValue, right: marginValue },
    styles: { font: reportFont, fontSize },
  });

  return pdf;
};

export const exportAsPdf = function (pdfData: PDFDataProps) {
  const pdf = toPdf(true, pdfData);
  const filename = pdfData.filename || 'unsaved-data.pdf';
  pdf.save(filename);
};
