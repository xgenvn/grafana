import React, { FC } from 'react';
import _ from 'lodash';

import { getTemplateSrv, TemplateSrv } from '@grafana/runtime';
import { SelectableValue, rangeUtil } from '@grafana/data';
import { Select, Label } from '@grafana/ui';
import { alignmentPeriods, alignOptions } from '../constants';
import { BaseQuery } from '../types';

export interface Props {
  onChange: (query: BaseQuery) => void;
  query: BaseQuery;
  templateVariableOptions: Array<SelectableValue<string>>;
  usedAlignmentPeriod?: number;
  selectWidth?: number;
}

const templateSrv: TemplateSrv = getTemplateSrv();

export const AlignmentPeriod: FC<Props> = ({
  templateVariableOptions,
  onChange,
  query,
  usedAlignmentPeriod,
  selectWidth,
}) => {
  const options = alignmentPeriods.map((ap) => ({
    ...ap,
    label: ap.text,
  }));
  const visibleOptions = options.filter((ap) => !ap.hidden);

  const alignment = alignOptions.find((ap) => ap.value === templateSrv.replace(query.perSeriesAligner));
  const formatAlignmentText = usedAlignmentPeriod
    ? `${rangeUtil.secondsToHms(usedAlignmentPeriod)} interval (${alignment ? alignment.text : ''})`
    : '';

  return (
    <>
      <Select
        width={selectWidth}
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
    </>
  );
};
