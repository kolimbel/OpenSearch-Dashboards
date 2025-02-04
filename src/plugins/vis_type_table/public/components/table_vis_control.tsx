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

export const TableVisControl = (props: TableVisControlProps) => {
  const {
    services: { uiSettings },
  } = useOpenSearchDashboards<CoreStart>();
  const [isPopoverOpen, setPopover] = useState(false);

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
          <EuiContextMenuItem
            key="rawCsv"
            onClick={() => exportAsCsv(false, { ...props, uiSettings })}
          >
            {i18n.translate('visTypeTable.tableVisExport.rawCsv', {
              defaultMessage: 'Raw CSV',
            })}
          </EuiContextMenuItem>,
          <EuiContextMenuItem
            key="formattedCsv"
            onClick={() => exportAsCsv(true, { ...props, uiSettings })}
          >
            {i18n.translate('visTypeTable.tableVisExport.formattedCsv', {
              defaultMessage: 'Formatted CSV',
            })}
          </EuiContextMenuItem>,
        ]}
      />
    </EuiPopover>
  );
};
