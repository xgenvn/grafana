import React, { FC, useState, useEffect } from 'react';
import { GrafanaTheme, SelectableValue } from '@grafana/data';
import { Cascader, FieldSet, Field, Input, InputControl, stylesFactory, Select, CascaderOption } from '@grafana/ui';
import { config } from 'app/core/config';
import { css } from '@emotion/css';

import { fetchRulerRules } from '../../api/ruler';
import { AlertRuleFormMethods } from './AlertRuleForm';
import DataSourceSelect from '../DataSourceSelect';

interface Props extends AlertRuleFormMethods {
  setFolder: ({ namespace, group }: { namespace: string; group: string }) => void;
}

export enum ALERT_TYPE {
  THRESHOLD = 'threshold',
  SYSTEM = 'system',
}

const alertTypeOptions: SelectableValue[] = [
  {
    label: 'Threshold',
    value: ALERT_TYPE.THRESHOLD,
    description: 'Metric alert based on a defined threshold',
  },
  {
    label: 'System or application',
    value: ALERT_TYPE.SYSTEM,
    description: 'Alert based on a system or application behavior. Based on Prometheus.',
  },
];

const AlertTypeSection: FC<Props> = ({ register, control, watch, setFolder, errors }) => {
  const styles = getStyles(config.theme);

  const alertType = watch('type') as SelectableValue;
  const datasource = watch('dataSource') as SelectableValue;
  const folderOptions = useFolderSelectOptions(datasource);

  return (
    <FieldSet label="Alert type">
      <Field
        className={styles.formInput}
        label="Alert name"
        error={errors?.name?.message}
        invalid={!!errors.name?.message}
      >
        <Input ref={register({ required: { value: true, message: 'Must enter an alert name' } })} name="name" />
      </Field>
      <div className={styles.flexRow}>
        <Field label="Alert type" className={styles.formInput} error={errors.type?.message}>
          <InputControl as={Select} name="type" options={alertTypeOptions} control={control} />
        </Field>
        <Field className={styles.formInput} label="Select data source">
          <DataSourceSelect control={control} alertType={alertType.value} />
        </Field>
      </div>
      <Field className={styles.formInput}>
        <InputControl
          as={Cascader}
          displayAllSelectedLevels={true}
          separator=" > "
          name="folder"
          options={folderOptions}
          control={control}
          changeOnSelect={false}
          onSelect={(value: string) => {
            const [namespace, group] = value.split(' > ');
            setFolder({ namespace, group });
          }}
        />
      </Field>
    </FieldSet>
  );
};

const useFolderSelectOptions = (datasource: SelectableValue) => {
  const [folderOptions, setFolderOptions] = useState<CascaderOption[]>([]);

  useEffect(() => {
    if (datasource?.value) {
      fetchRulerRules(datasource?.value)
        .then((namespaces) => {
          const options: CascaderOption[] = Object.entries(namespaces).map(([namespace, group]) => {
            return {
              label: namespace,
              value: namespace,
              items: group.map(({ name }) => {
                return { label: name, value: `${namespace} > ${name}` };
              }),
            };
          });
          setFolderOptions(options);
        })
        .catch((error) => {
          if (error.status === 404) {
            setFolderOptions([{ label: 'No folders found', value: '' }]);
          }
        });
    }
  }, [datasource?.value]);

  return folderOptions;
};

const getStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    formInput: css`
      width: 400px;
      & + & {
        margin-left: ${theme.spacing.sm};
      }
    `,
    flexRow: css`
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
    `,
  };
});

export default AlertTypeSection;
