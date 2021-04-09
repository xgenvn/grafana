import React from 'react';
import { InlineFields, Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import CloudMonitoringDatasource from '../../datasource';
import { SLOQuery } from '../../types';
import { LABEL_WIDTH, SELECT_WIDTH, selectors } from '../../constants';

export interface Props {
  onChange: (query: SLOQuery) => void;
  query: SLOQuery;
  templateVariableOptions: Array<SelectableValue<string>>;
  datasource: CloudMonitoringDatasource;
}

export const Selector: React.FC<Props> = ({ query, templateVariableOptions, onChange, datasource }) => {
  return (
    <InlineFields label="Selector" grow transparent labelWidth={LABEL_WIDTH}>
      <Select
        width={SELECT_WIDTH}
        allowCustomValue
        value={[...selectors, ...templateVariableOptions].find((s) => s.value === query?.selectorName ?? '')}
        options={[
          {
            label: 'Template Variables',
            options: templateVariableOptions,
          },
          ...selectors,
        ]}
        onChange={({ value: selectorName }) => onChange({ ...query, selectorName: selectorName ?? '' })}
      />
    </InlineFields>
  );
};
