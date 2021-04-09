import React, { FC } from 'react';
import _ from 'lodash';

import { SelectableValue } from '@grafana/data';
import { InlineField, InlineFields } from '@grafana/ui';
import { LABEL_WIDTH } from '../constants';
import { MetricQuery } from '../types';
import { AlignmentFunction, AlignmentPeriod } from '.';

export interface Props {
  onChange: (query: MetricQuery) => void;
  query: MetricQuery;
  templateVariableOptions: Array<SelectableValue<string>>;
  usedAlignmentPeriod?: number;
}

export const Alignment: FC<Props> = ({ templateVariableOptions, onChange, query, usedAlignmentPeriod }) => {
  return (
    <InlineFields
      label="Alignment"
      transparent
      labelWidth={LABEL_WIDTH}
      tooltip="The process of alignment consists of collecting all data points received in a fixed length of time, applying a function to combine those data points, and assigning a timestamp to the result."
    >
      <AlignmentFunction templateVariableOptions={templateVariableOptions} query={query} onChange={onChange} />
      <InlineField label="Period" className="width-16">
        <AlignmentPeriod
          templateVariableOptions={templateVariableOptions}
          query={query}
          usedAlignmentPeriod={usedAlignmentPeriod}
          onChange={onChange}
        />
      </InlineField>
    </InlineFields>
  );
};
