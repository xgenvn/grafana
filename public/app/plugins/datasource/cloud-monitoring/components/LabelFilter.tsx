import React, { FunctionComponent, Fragment } from 'react';
import { SelectableValue } from '@grafana/data';
import { Button, InlineFields, Select } from '@grafana/ui';
import { labelsToGroupedOptions, filtersToStringArray, stringArrayToFilters, toOption } from '../functions';
import { Filter } from '../types';
import { CustomControlProps } from '@grafana/ui/src/components/Select/types';
import { LABEL_WIDTH } from '../constants';

export interface Props {
  labels: { [key: string]: string[] };
  filters: string[];
  onChange: (filters: string[]) => void;
  variableOptionGroup: SelectableValue<string>;
}

const removeText = '-- remove filter --';
const removeOption: SelectableValue<string> = { label: removeText, value: removeText, icon: 'times' };
const operators = ['=', '!=', '=~', '!=~'];

const FilterButton = React.forwardRef<HTMLButtonElement, CustomControlProps<string>>(
  ({ value, isOpen, invalid, ...rest }, ref) => {
    return (
      <Button ref={ref} {...rest} variant="secondary" icon="plus">
        Add filter
      </Button>
    );
  }
);

FilterButton.displayName = 'BilterButton';

export const LabelFilter: FunctionComponent<Props> = ({
  labels = {},
  filters: filterArray,
  onChange,
  variableOptionGroup,
}) => {
  const filters = stringArrayToFilters(filterArray);

  const options = [removeOption, variableOptionGroup, ...labelsToGroupedOptions(Object.keys(labels))];

  return (
    <InlineFields
      label="Filter"
      transparent
      labelWidth={LABEL_WIDTH}
      tooltip={
        'To reduce the amount of data charted, apply a filter. A filter has three components: a label, a comparison, and a value. The comparison can be an equality, inequality, or regular expression.'
      }
    >
      {filters.map(({ key, operator, value, condition }, index) => (
        <Fragment key={index}>
          <Select
            allowCustomValue
            value={key}
            options={options}
            onChange={({ value: key = '' }) => {
              if (key === removeText) {
                onChange(filtersToStringArray(filters.filter((_, i) => i !== index)));
              } else {
                onChange(
                  filtersToStringArray(
                    filters.map((f, i) => (i === index ? { key, operator, condition, value: '' } : f))
                  )
                );
              }
            }}
          />
          <Select
            value={operator}
            // className="gf-form-label query-segment-operator"
            options={operators.map(toOption)}
            onChange={({ value: operator = '=' }) =>
              onChange(filtersToStringArray(filters.map((f, i) => (i === index ? { ...f, operator } : f))))
            }
            menuPlacement="bottom"
            renderControl={FilterButton}
          />
          <Select
            allowCustomValue
            value={value}
            placeholder="add filter value"
            options={
              labels.hasOwnProperty(key) ? [variableOptionGroup, ...labels[key].map(toOption)] : [variableOptionGroup]
            }
            onChange={({ value = '' }) =>
              onChange(filtersToStringArray(filters.map((f, i) => (i === index ? { ...f, value } : f))))
            }
          />
          {filters.length > 1 && index + 1 !== filters.length && (
            <label className="gf-form-label query-keyword">{condition}</label>
          )}
        </Fragment>
      ))}
      {Object.values(filters).every(({ value }) => value) && (
        <Select
          allowCustomValue
          // Component={
          //   <a className="gf-form-label query-part">
          //     <Icon name="plus" />
          //   </a>
          // }
          options={[variableOptionGroup, ...labelsToGroupedOptions(Object.keys(labels))]}
          onChange={({ value: key = '' }) =>
            onChange(filtersToStringArray([...filters, { key, operator: '=', condition: 'AND', value: '' } as Filter]))
          }
          menuPlacement="bottom"
          renderControl={FilterButton}
        />
      )}
    </InlineFields>
  );
};
