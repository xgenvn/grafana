import React from 'react';
import { Metrics, LabelFilter, GroupBy, Preprocessor, Alignment } from '.';
import { MetricQuery, MetricDescriptor, PreprocessorType } from '../types';
import CloudMonitoringDatasource from '../datasource';
import { SelectableValue } from '@grafana/data';

export interface Props {
  usedAlignmentPeriod?: number;
  variableOptionGroup: SelectableValue<string>;
  onMetricTypeChange: (query: MetricDescriptor) => void;
  onChange: (query: MetricQuery) => void;
  query: MetricQuery;
  datasource: CloudMonitoringDatasource;
  labels: any;
}

function Editor({
  query,
  labels,
  datasource,
  onChange,
  onMetricTypeChange,
  usedAlignmentPeriod,
  variableOptionGroup,
}: React.PropsWithChildren<Props>) {
  return (
    <Metrics
      templateSrv={datasource.templateSrv}
      projectName={query.projectName}
      metricType={query.metricType}
      templateVariableOptions={variableOptionGroup.options}
      datasource={datasource}
      onChange={onMetricTypeChange}
    >
      {(metric) => (
        <>
          <LabelFilter
            labels={labels}
            filters={query.filters!}
            onChange={(filters) => onChange({ ...query, filters })}
            variableOptionGroup={variableOptionGroup}
          />
          <Preprocessor
            metricDescriptor={metric}
            preprocessor={query.preprocessor}
            onChange={(preprocessor: PreprocessorType) => onChange({ ...query, preprocessor })}
          />
          <GroupBy
            labels={Object.keys(labels)}
            query={query}
            onChange={onChange}
            variableOptionGroup={variableOptionGroup}
            metricDescriptor={metric}
          />
          <Alignment
            templateVariableOptions={variableOptionGroup.options}
            query={query}
            usedAlignmentPeriod={usedAlignmentPeriod}
            onChange={onChange}
          />
        </>
      )}
    </Metrics>
  );
}

export const VisualMetricQueryEditor = React.memo(Editor);
