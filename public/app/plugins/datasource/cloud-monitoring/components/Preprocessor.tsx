import React, { FunctionComponent, useMemo } from 'react';
import { SelectableValue } from '@grafana/data';
import { InlineFields, RadioButtonGroup } from '@grafana/ui';
import { MetricDescriptor, MetricKind, PreprocessorType } from '../types';
import { LABEL_WIDTH } from '../constants';

const NONE_OPTION = { label: 'None', value: PreprocessorType.None };

export interface Props {
  preprocessor?: string;
  onChange: (value: string) => void;
  metricDescriptor?: MetricDescriptor;
}

export const Preprocessor: FunctionComponent<Props> = ({
  preprocessor = PreprocessorType.None,
  metricDescriptor,
  onChange,
}) => {
  const options = useOptions(metricDescriptor);
  console.log({ kind: metricDescriptor?.metricKind, options });
  return (
    <InlineFields label="Pre-processing" transparent labelWidth={LABEL_WIDTH}>
      <RadioButtonGroup
        onChange={(value) => onChange(value ?? PreprocessorType.None)}
        value={preprocessor}
        options={options}
      ></RadioButtonGroup>
    </InlineFields>
  );
};

const useOptions = (metricDescriptor?: MetricDescriptor): Array<SelectableValue<string>> => {
  const metricKind = metricDescriptor?.metricKind;

  return useMemo(() => {
    if (metricKind === MetricKind.GAUGE) {
      return [NONE_OPTION];
    }

    const options = [
      NONE_OPTION,
      {
        label: 'Rate',
        value: PreprocessorType.Rate,
        description: 'Data points are aligned and converted to a rate per time series',
      },
    ];

    const a =
      metricKind === MetricKind.CUMULATIVE
        ? [
            ...options,
            {
              label: 'Delta',
              value: PreprocessorType.Delta,
            },
          ]
        : options;
    return a;
  }, [metricKind]);
};
