import React, { FC } from 'react';
import _ from 'lodash';

import { getTemplateSrv, TemplateSrv } from '@grafana/runtime';
import { SelectableValue, rangeUtil } from '@grafana/data';
import { Select, InlineFields, Label } from '@grafana/ui';
import { alignmentPeriods, alignOptions } from '../constants';
import { BaseQuery } from '../types';

export interface Props {
  onChange: (query: BaseQuery) => void;
  query: BaseQuery;
  templateVariableOptions: Array<SelectableValue<string>>;
  usedAlignmentPeriod?: number;
}

const templateSrv: TemplateSrv = getTemplateSrv();

export const AlignmentPeriods: FC<Props> = ({ templateVariableOptions, onChange, query, usedAlignmentPeriod }) => {
  const alignment = alignOptions.find((ap) => ap.value === templateSrv.replace(query.perSeriesAligner));
  const formatAlignmentText = usedAlignmentPeriod
    ? `${rangeUtil.secondsToHms(usedAlignmentPeriod)} interval (${alignment ? alignment.text : ''})`
    : '';
  const options = alignmentPeriods.map((ap) => ({
    ...ap,
    label: ap.text,
  }));
  const visibleOptions = options.filter((ap) => !ap.hidden);

  return (
    <>
      <InlineFields label="Period">
        <Select
          onChange={({ value }) => onChange({ ...query, alignmentPeriod: value! })}
          value={[...options, ...templateVariableOptions].find((s) => s.value === query.alignmentPeriod)}
          options={[
            {
              label: 'Template Variables',
              options: templateVariableOptions,
            },
            {
              label: 'Aggregations',
              expanded: true,
              options: visibleOptions,
            },
          ]}
          placeholder="Select Alignment"
        ></Select>
        <Label>{formatAlignmentText}</Label>
      </InlineFields>
    </>
  );
};
