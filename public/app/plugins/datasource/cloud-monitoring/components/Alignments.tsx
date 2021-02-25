import React, { FC } from 'react';

import { SelectableValue } from '@grafana/data';
import { InlineField, Segment } from '@grafana/ui';

export interface Props {
  onChange: (perSeriesAligner: string) => void;
  templateVariableOptions: Array<SelectableValue<string>>;
  alignOptions: Array<SelectableValue<string>>;
  perSeriesAligner: string;
}

export const Alignments: FC<Props> = ({ perSeriesAligner, templateVariableOptions, onChange, alignOptions }) => {
  return (
    <>
      <InlineField label="Alignment">
        <Segment
          onChange={({ value }) => onChange(value!)}
          value={[...alignOptions, ...templateVariableOptions].find((s) => s.value === perSeriesAligner)}
          options={[
            {
              label: 'Template Variables',
              options: templateVariableOptions,
            },
            {
              label: 'Alignment options',
              expanded: true,
              options: alignOptions,
            },
          ]}
          placeholder="Select Alignment"
        ></Segment>
      </InlineField>
    </>
  );
};
