/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { i18n } from '@osd/i18n';
import { EuiPopover, EuiButtonEmpty, EuiContextMenuPanel, EuiContextMenuItem } from '@elastic/eui';
import { OpenSearchDashboardsDatatableRow } from 'src/plugins/expressions';
import { CoreStart } from 'opensearch-dashboards/public';
import { exportAsCsv } from '../utils/convert_to_csv_data';
import { FormattedColumn } from '../types';
import { useOpenSearchDashboards } from '../../../opensearch_dashboards_react/public';
import '../../../pdf_export/font_manager';
import { exportAsPdf } from '../utils/convert_to_pdf_data';

interface TableVisControlProps {
  filename?: string;
  rows: OpenSearchDashboardsDatatableRow[];
  columns: FormattedColumn[];
}

const generationTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
};

export const TableVisControl = (props: TableVisControlProps) => {
  const {
    services: { uiSettings },
  } = useOpenSearchDashboards<CoreStart>();
  const [isPopoverOpen, setPopover] = useState(false);

  const transformFilename = (filename?: string): string => {
    return filename && filename.trim() !== '' ? `${filename}` : 'export';
  };

  const handleCsvExport = (formatted: boolean) => {
    const timestamp = generationTimestamp();
    const filename = transformFilename(props.filename);

    exportAsCsv(formatted, {
      ...props,
      filename,
      generationTimestamp: timestamp,
      uiSettings,
    });
  };

  const handlePdfExport = () => {
    const reportTitle = `${props.filename}`;
    const timestamp = generationTimestamp();
    const filename = transformFilename(props.filename);

    exportAsPdf({
      ...props,
      filename,
      reportTitle: reportTitle ?? '',
      generationTimestamp: timestamp,
      uiSettings,
    });
  };

  return (
    <EuiPopover
      id="dataTableExportData"
      button={
        <EuiButtonEmpty size="xs" iconType="download" onClick={() => setPopover((open) => !open)} />
      }
      isOpen={isPopoverOpen}
      closePopover={() => setPopover(false)}
      panelPaddingSize="none"
    >
      <EuiContextMenuPanel
        size="s"
        items={[
          <EuiContextMenuItem key="rawCsv" onClick={() => handleCsvExport(false)}>
            {i18n.translate('visTypeTable.tableVisExport.rawCsv', {
              defaultMessage: 'Raw CSV',
            })}
          </EuiContextMenuItem>,
          <EuiContextMenuItem key="formattedCsv" onClick={() => handleCsvExport(true)}>
            {i18n.translate('visTypeTable.tableVisExport.formattedCsv', {
              defaultMessage: 'Formatted CSV',
            })}
          </EuiContextMenuItem>,
          <EuiContextMenuItem key="pdf" onClick={handlePdfExport}>
            {i18n.translate('visTypeTable.tableVisExport.pdf', {
              defaultMessage: 'PDF',
            })}
          </EuiContextMenuItem>,
        ]}
      />
    </EuiPopover>
  );
};
