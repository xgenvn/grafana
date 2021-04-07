import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { InlineLabel } from './InlineLabel';
import { Props as InlineFieldProps } from './InlineField';

export interface Props extends Omit<InlineFieldProps, 'children'> {
  children: React.ReactNode;
}

export const InlineFields: FC<Props> = ({
  children,
  label,
  tooltip,
  labelWidth = 'auto',
  invalid,
  loading,
  disabled,
  className,
  grow,
  transparent,
  ...htmlProps
}) => {
  const styles = getStyles(grow);

  const labelElement =
    typeof label === 'string' ? (
      <InlineLabel width={labelWidth} tooltip={tooltip} transparent={transparent}>
        {label}
      </InlineLabel>
    ) : (
      label
    );

  return (
    <div className={cx(styles.container, className)} {...htmlProps}>
      {labelElement}
      {children}
    </div>
  );
};

InlineFields.displayName = 'InlineFields';

const getStyles = (grow?: boolean) => {
  return {
    container: css`
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      text-align: left;
      position: relative;
      flex: ${grow ? 1 : 0} 0 auto;
      > * {
        margin-bottom: 0 !important;
      }
    `,
  };
};
