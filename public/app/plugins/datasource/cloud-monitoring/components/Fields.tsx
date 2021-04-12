import React, { InputHTMLAttributes, FunctionComponent } from 'react';
import { Select, InlineField } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { css } from '@emotion/css';

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  tooltip?: string;
  children?: React.ReactNode;
}

interface VariableQueryFieldProps {
  onChange: (value: string) => void;
  options: SelectableValue[];
  value: string;
  label: string;
  allowCustomValue?: boolean;
}

export const VariableQueryField: FunctionComponent<VariableQueryFieldProps> = ({
  label,
  onChange,
  value,
  options,
  allowCustomValue = false,
}) => {
  return (
    <InlineField label={label} labelWidth={20}>
      <Select
        width={25}
        allowCustomValue={allowCustomValue}
        value={value}
        onChange={({ value }) => onChange(value!)}
        options={options}
      />
    </InlineField>
  );
};

export const QueryEditorContainer: FunctionComponent = ({ children }) => (
  <div
    className={css`
      > * {
        /* margin: 4px 0; */
      }
    `}
  >
    {children}
  </div>
);
