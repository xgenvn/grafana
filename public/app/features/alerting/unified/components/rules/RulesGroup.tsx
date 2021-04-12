import { CombinedRuleGroup, RulesSource } from 'app/types/unified-alerting';
import React, { FC, useMemo, useState, Fragment } from 'react';
import { Icon, Tooltip, useStyles } from '@grafana/ui';
import { GrafanaTheme } from '@grafana/data';
import { css } from '@emotion/css';
import { isAlertingRule } from '../../utils/rules';
import { PromAlertingRuleState } from 'app/types/unified-alerting-dto';
import { StateColoredText } from '../StateColoredText';
import { CollapseToggle } from '../CollapseToggle';
import { RulesTable } from './RulesTable';
import { GRAFANA_RULES_SOURCE_NAME, isCloudRulesSource } from '../../utils/datasource';
import { ActionIcon } from './ActionIcon';
import pluralize from 'pluralize';
import { useHasRuler } from '../../hooks/useHasRuler';
interface Props {
  namespace: string;
  rulesSource: RulesSource;
  group: CombinedRuleGroup;
}

export const RulesGroup: FC<Props> = React.memo(({ group, namespace, rulesSource }) => {
  const styles = useStyles(getStyles);

  const [isCollapsed, setIsCollapsed] = useState(true);

  const hasRuler = useHasRuler(rulesSource);

  const stats = useMemo(
    (): Record<PromAlertingRuleState, number> =>
      group.rules.reduce<Record<PromAlertingRuleState, number>>(
        (stats, rule) => {
          if (rule.promRule && isAlertingRule(rule.promRule)) {
            stats[rule.promRule.state] += 1;
          }
          return stats;
        },
        {
          [PromAlertingRuleState.Firing]: 0,
          [PromAlertingRuleState.Pending]: 0,
          [PromAlertingRuleState.Inactive]: 0,
        }
      ),
    [group]
  );

  const statsComponents: React.ReactNode[] = [];
  if (stats[PromAlertingRuleState.Firing]) {
    statsComponents.push(
      <StateColoredText key="firing" status={PromAlertingRuleState.Firing}>
        {stats[PromAlertingRuleState.Firing]} firing
      </StateColoredText>
    );
  }
  if (stats[PromAlertingRuleState.Pending]) {
    statsComponents.push(
      <StateColoredText key="pending" status={PromAlertingRuleState.Pending}>
        {stats[PromAlertingRuleState.Pending]} pending
      </StateColoredText>
    );
  }

  const actionIcons: React.ReactNode[] = [];
  if (hasRuler) {
    actionIcons.push(<ActionIcon key="edit" icon="pen" tooltip="edit" />);
  }
  if (rulesSource === GRAFANA_RULES_SOURCE_NAME) {
    actionIcons.push(<ActionIcon key="manage-perms" icon="lock" tooltip="manage permissions" />);
  }

  const groupName = isCloudRulesSource(rulesSource) ? `${namespace} > ${group.name}` : namespace;

  return (
    <div className={styles.wrapper} data-testid="rule-group">
      <div className={styles.header} data-testid="rule-group-header">
        <CollapseToggle
          className={styles.collapseToggle}
          isCollapsed={isCollapsed}
          onToggle={setIsCollapsed}
          data-testid="group-collapse-toggle"
        />
        <Icon name={isCollapsed ? 'folder-open' : 'folder'} />
        {isCloudRulesSource(rulesSource) && (
          <Tooltip content={rulesSource.name} placement="top">
            <img className={styles.dataSourceIcon} src={rulesSource.meta.info.logos.small} />
          </Tooltip>
        )}
        <h6 className={styles.heading}>{groupName}</h6>
        <div className={styles.spacer} />
        <div className={styles.headerStats}>
          {group.rules.length} {pluralize('rule', group.rules.length)}
          {!!statsComponents.length && (
            <>
              :{' '}
              {statsComponents.reduce<React.ReactNode[]>(
                (prev, curr, idx) => (prev.length ? [prev, <Fragment key={idx}>, </Fragment>, curr] : [curr]),
                []
              )}
            </>
          )}
        </div>
        {!!actionIcons.length && (
          <>
            <div className={styles.actionsSeparator}>|</div>
            <div className={styles.actionIcons}>{actionIcons}</div>
          </>
        )}
      </div>
      {!isCollapsed && <RulesTable rulesSource={rulesSource} namespace={namespace} group={group} />}
    </div>
  );
});

RulesGroup.displayName = 'RulesGroup';

export const getStyles = (theme: GrafanaTheme) => ({
  wrapper: css`
    & + & {
      margin-top: ${theme.spacing.md};
    }
  `,
  header: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm} 0;
    background-color: ${theme.colors.bg2};
  `,
  headerStats: css`
    span {
      vertical-align: middle;
    }
  `,
  heading: css`
    margin-left: ${theme.spacing.sm};
    margin-bottom: 0;
  `,
  spacer: css`
    flex: 1;
  `,
  collapseToggle: css`
    background: none;
    border: none;
    margin-top: -${theme.spacing.sm};
    margin-bottom: -${theme.spacing.sm};

    svg {
      margin-bottom: 0;
    }
  `,
  dataSourceIcon: css`
    width: ${theme.spacing.md};
    height: ${theme.spacing.md};
    margin-left: ${theme.spacing.md};
  `,
  dataSourceOrigin: css`
    margin-right: 1em;
    color: ${theme.colors.textFaint};
  `,
  actionsSeparator: css`
    margin: 0 ${theme.spacing.sm};
  `,
  actionIcons: css`
    & > * + * {
      margin-left: ${theme.spacing.sm};
    }
  `,
});
