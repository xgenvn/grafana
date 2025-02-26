import React, { memo, cloneElement, FC, HTMLAttributes, ReactNode, useCallback } from 'react';
import { css, cx } from '@emotion/css';
import { GrafanaTheme } from '@grafana/data';
import { useTheme, styleMixins, stylesFactory } from '../../themes';
import { Tooltip, PopoverContent } from '../Tooltip/Tooltip';

/**
 * @public
 */
export interface ContainerProps extends HTMLAttributes<HTMLOrSVGElement> {
  /** Content for the card's tooltip */
  tooltip?: PopoverContent;
}

const CardContainer: FC<ContainerProps> = ({ children, tooltip, ...props }) => {
  return tooltip ? (
    <Tooltip placement="top" content={tooltip} theme="info">
      <div {...props}>{children}</div>
    </Tooltip>
  ) : (
    <div {...props}>{children}</div>
  );
};

/**
 * @public
 */
export interface CardInnerProps {
  href?: string;
}

const CardInner: FC<CardInnerProps> = ({ children, href }) => {
  const theme = useTheme();
  const styles = getCardStyles(theme);
  return href ? (
    <a className={styles.innerLink} href={href}>
      {children}
    </a>
  ) : (
    <div className={styles.innerLink}>{children}</div>
  );
};

/**
 * @public
 */
export interface Props extends ContainerProps {
  /** Main heading for the Card **/
  heading: ReactNode;
  /** Card description text */
  description?: string;
  /** Indicates if the card and all its actions can be interacted with */
  disabled?: boolean;
  /** Link to redirect to on card click. If provided, the Card inner content will be rendered inside `a` */
  href?: string;
  /** On click handler for the Card */
  onClick?: () => void;
}

export interface CardInterface extends FC<Props> {
  Tags: typeof Tags;
  Figure: typeof Figure;
  Meta: typeof Meta;
  Actions: typeof Actions;
  SecondaryActions: typeof SecondaryActions;
}

/**
 * Generic card component
 *
 * @public
 */
export const Card: CardInterface = ({
  heading,
  description,
  disabled,
  tooltip,
  href,
  onClick,
  className,
  children,
  ...htmlProps
}) => {
  const theme = useTheme();
  const styles = getCardStyles(theme);
  const [tags, figure, meta, actions, secondaryActions] = ['Tags', 'Figure', 'Meta', 'Actions', 'SecondaryActions'].map(
    (item) => {
      const found = React.Children.toArray(children as React.ReactElement[]).find((child) => {
        return child?.type && (child.type as any).displayName === item;
      });

      if (found) {
        return React.cloneElement(found, { disabled, styles, ...found.props });
      }
      return found;
    }
  );

  const hasActions = Boolean(actions || secondaryActions);
  const disableHover = disabled || (!onClick && !href);
  const disableEvents = disabled && !actions;

  const containerStyles = getContainerStyles(theme, disableEvents, disableHover);
  const onCardClick = useCallback(() => (disableHover ? () => {} : onClick?.()), [disableHover, onClick]);

  return (
    <CardContainer
      tooltip={tooltip}
      tabIndex={disableHover ? undefined : 0}
      className={cx(containerStyles, className)}
      onClick={onCardClick}
      {...htmlProps}
    >
      <CardInner href={href}>
        {figure}
        <div className={styles.inner}>
          <div className={styles.info}>
            <div>
              <div className={styles.heading} role="heading">
                {heading}
              </div>
              {meta}
              {description && <p className={styles.description}>{description}</p>}
            </div>
            {tags}
          </div>
          {hasActions && (
            <div className={styles.actionRow}>
              {actions}
              {secondaryActions}
            </div>
          )}
        </div>
      </CardInner>
    </CardContainer>
  );
};

const getContainerStyles = stylesFactory((theme: GrafanaTheme, disabled = false, disableHover = false) => {
  return css({
    display: 'flex',
    width: '100%',
    background: theme.v2.palette.layer2,
    borderRadius: theme.v2.shape.borderRadius(),
    position: 'relative',
    pointerEvents: disabled ? 'none' : 'auto',
    marginBottom: theme.v2.spacing(1),
    transition: theme.v2.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
      duration: theme.v2.transitions.duration.short,
    }),

    ...(!disableHover && {
      '&:hover': {
        background: theme.v2.palette.getHoverColor(theme.v2.palette.layer2, 0.03),
        cursor: 'pointer',
        zIndex: 1,
      },
      '&:focus': styleMixins.getFocusStyles(theme.v2),
    }),
  });
});

/**
 * @public
 */
export const getCardStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    inner: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      flex-wrap: wrap;
    `,
    heading: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 0;
      font-size: ${theme.typography.size.md};
      line-height: ${theme.typography.lineHeight.xs};
      color: ${theme.colors.text};
      font-weight: ${theme.typography.weight.semibold};
    `,
    info: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    `,
    metadata: css`
      display: flex;
      align-items: center;
      width: 100%;
      font-size: ${theme.typography.size.sm};
      color: ${theme.colors.textSemiWeak};
      margin: ${theme.spacing.xs} 0 0;
      line-height: ${theme.typography.lineHeight.xs};
    `,
    description: css`
      width: 100%;
      margin: ${theme.spacing.sm} 0 0;
      color: ${theme.colors.textSemiWeak};
      line-height: ${theme.typography.lineHeight.md};
    `,
    media: css`
      margin-right: ${theme.spacing.md};
      width: 40px;
      display: flex;
      align-items: center;

      & > * {
        width: 100%;
      }

      &:empty {
        display: none;
      }
    `,
    actionRow: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-top: ${theme.spacing.md};
    `,
    actions: css`
      & > * {
        margin-right: ${theme.spacing.sm};
      }
    `,
    secondaryActions: css`
      display: flex;
      align-items: center;
      color: ${theme.colors.textSemiWeak};
      // align to the right
      margin-left: auto;
      & > * {
        margin-right: ${theme.spacing.sm} !important;
      }
    `,
    separator: css`
      margin: 0 ${theme.spacing.sm};
    `,
    innerLink: css`
      display: flex;
      width: 100%;
      padding: ${theme.spacing.md};
    `,
    tagList: css`
      max-width: 50%;
    `,
  };
});

interface ChildProps {
  styles?: ReturnType<typeof getCardStyles>;
  disabled?: boolean;
}

const Tags: FC<ChildProps> = ({ children, styles }) => {
  return <div className={styles?.tagList}>{children}</div>;
};
Tags.displayName = 'Tags';

const Figure: FC<ChildProps & { align?: 'top' | 'center'; className?: string }> = ({
  children,
  styles,
  align = 'top',
  className,
}) => {
  return (
    <div
      className={cx(
        styles?.media,
        className,
        align === 'center' &&
          css`
            display: flex;
            align-items: center;
          `
      )}
    >
      {children}
    </div>
  );
};

Figure.displayName = 'Figure';

const Meta: FC<ChildProps & { separator?: string }> = memo(({ children, styles, separator = '|' }) => {
  let meta = children;

  // Join meta data elements by separator
  if (Array.isArray(children) && separator) {
    const filtered = React.Children.toArray(children).filter(Boolean);
    if (!filtered.length) {
      return null;
    }
    meta = filtered.reduce((prev, curr, i) => [
      prev,
      <span key={`separator_${i}`} className={styles?.separator}>
        {separator}
      </span>,
      curr,
    ]);
  }
  return <div className={styles?.metadata}>{meta}</div>;
});

Meta.displayName = 'Meta';

interface ActionsProps extends ChildProps {
  children: JSX.Element | JSX.Element[];
  variant?: 'primary' | 'secondary';
}

const BaseActions: FC<ActionsProps> = ({ children, styles, disabled, variant }) => {
  const css = variant === 'primary' ? styles?.actions : styles?.secondaryActions;
  return (
    <div className={css}>
      {Array.isArray(children)
        ? React.Children.map(children, (child) => cloneElement(child, { disabled }))
        : cloneElement(children, { disabled })}
    </div>
  );
};

const Actions: FC<ActionsProps> = ({ children, styles, disabled }) => {
  return (
    <BaseActions variant="primary" disabled={disabled} styles={styles}>
      {children}
    </BaseActions>
  );
};

Actions.displayName = 'Actions';

const SecondaryActions: FC<ActionsProps> = ({ children, styles, disabled }) => {
  return (
    <BaseActions variant="secondary" disabled={disabled} styles={styles}>
      {children}
    </BaseActions>
  );
};

SecondaryActions.displayName = 'SecondaryActions';

Card.Tags = Tags;
Card.Figure = Figure;
Card.Meta = Meta;
Card.Actions = Actions;
Card.SecondaryActions = SecondaryActions;
