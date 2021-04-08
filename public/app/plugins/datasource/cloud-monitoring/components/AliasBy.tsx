import React, { FunctionComponent, useState } from 'react';
import { debounce } from 'lodash';
import { InlineFields, Input } from '@grafana/ui';

import { LABEL_WIDTH } from '../constants';

export interface Props {
  onChange: (alias: any) => void;
  value?: string;
}

export const AliasBy: FunctionComponent<Props> = ({ value = '', onChange }) => {
  const [alias, setAlias] = useState(value ?? '');

  const propagateOnChange = debounce(onChange, 1000);

  onChange = (e: any) => {
    setAlias(e.target.value);
    propagateOnChange(e.target.value);
  };

  return (
    <InlineFields label="Alias By" grow transparent labelWidth={LABEL_WIDTH}>
      <Input width={70} type="text" value={alias} onChange={onChange} />
    </InlineFields>
  );
};
