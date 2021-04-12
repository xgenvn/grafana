import React, { FC } from 'react';
import { GrafanaTheme } from '@grafana/data';
import { css, cx } from '@emotion/css';
import { useTheme } from '../../themes';
import { InlineLabel } from './InlineLabel';
import { Props as InlineFieldProps } from './InlineField';

export interface Props extends Omit<InlineFieldProps, 'children' | 'invalid' | 'disabled' | 'loading'> {
  children: React.ReactNode;
}

export const InlineFields: FC<Props> = ({
  children,
  label,
  tooltip,
  labelWidth = 'auto',
  className,
  grow,
  transparent,
  ...htmlProps
}) => {
  const theme = useTheme();
  const styles = getStyles(theme, grow);

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

const getStyles = (theme: GrafanaTheme, grow?: boolean) => {
  return {
    container: css`
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      text-align: left;
      position: relative;
      flex: ${grow ? 1 : 0} 0 auto;
      margin: 0 0 ${theme.spacing.xs} 0;
      > * {
        margin-bottom: 0 !important;
      }
    `,
  };
};
