import { DataQuery, DataSourceJsonData, SelectableValue } from '@grafana/data';

export enum AuthType {
  JWT = 'jwt',
  GCE = 'gce',
}

export const authTypes = [
  { value: 'Google JWT File', key: AuthType.JWT },
  { value: 'GCE Default Service Account', key: AuthType.GCE },
];

export enum MetricFindQueryTypes {
  Projects = 'projects',
  Services = 'services',
  DefaultProject = 'defaultProject',
  MetricTypes = 'metricTypes',
  LabelKeys = 'labelKeys',
  LabelValues = 'labelValues',
  ResourceTypes = 'resourceTypes',
  Aggregations = 'aggregations',
  Aligners = 'aligners',
  AlignmentPeriods = 'alignmentPeriods',
  Selectors = 'selectors',
  SLOServices = 'sloServices',
  SLO = 'slo',
}

export interface CloudMonitoringVariableQuery extends DataQuery {
  selectedQueryType: string;
  selectedService: string;
  selectedMetricType: string;
  selectedSLOService: string;
  labelKey: string;
  projects: SelectableValue[];
  sloServices: SelectableValue[];
  projectName: string;
}

export interface VariableQueryData {
  selectedQueryType: string;
  metricDescriptors: MetricDescriptor[];
  selectedService: string;
  selectedMetricType: string;
  selectedSLOService: string;
  labels: string[];
  labelKey: string;
  metricTypes: Array<{ value: string; name: string }>;
  services: SelectableValue[];
  projects: SelectableValue[];
  sloServices: SelectableValue[];
  projectName: string;
  loading: boolean;
}

export enum QueryType {
  METRICS = 'metrics',
  SLO = 'slo',
}

export enum EditorMode {
  Visual = 'visual',
  MQL = 'mql',
}

export enum PreprocessorType {
  None = 'none',
  Rate = 'rate',
  Delta = 'delta',
}

export enum MetricKind {
  METRIC_KIND_UNSPECIFIED = 'METRIC_KIND_UNSPECIFIED',
  GAUGE = 'GAUGE',
  DELTA = 'DELTA',
  CUMULATIVE = 'CUMULATIVE',
}

export enum ValueTypes {
  VALUE_TYPE_UNSPECIFIED = 'VALUE_TYPE_UNSPECIFIED',
  BOOL = 'BOOL',
  INT64 = 'INT64',
  DOUBLE = 'DOUBLE',
  STRING = 'STRING',
  DISTRIBUTION = 'DISTRIBUTION',
  MONEY = 'MONEY',
}

export enum AlignmentTypes {
  ALIGN_DELTA = 'ALIGN_DELTA',
  ALIGN_RATE = 'ALIGN_RATE',
  ALIGN_INTERPOLATE = 'ALIGN_INTERPOLATE',
  ALIGN_NEXT_OLDER = 'ALIGN_NEXT_OLDER',
  ALIGN_MIN = 'ALIGN_MIN',
  ALIGN_MAX = 'ALIGN_MAX',
  ALIGN_MEAN = 'ALIGN_MEAN',
  ALIGN_COUNT = 'ALIGN_COUNT',
  ALIGN_SUM = 'ALIGN_SUM',
  ALIGN_STDDEV = 'ALIGN_STDDEV',
  ALIGN_COUNT_TRUE = 'ALIGN_COUNT_TRUE',
  ALIGN_COUNT_FALSE = 'ALIGN_COUNT_FALSE',
  ALIGN_FRACTION_TRUE = 'ALIGN_FRACTION_TRUE',
  ALIGN_PERCENTILE_99 = 'ALIGN_PERCENTILE_99',
  ALIGN_PERCENTILE_95 = 'ALIGN_PERCENTILE_95',
  ALIGN_PERCENTILE_50 = 'ALIGN_PERCENTILE_50',
  ALIGN_PERCENTILE_05 = 'ALIGN_PERCENTILE_05',
  ALIGN_PERCENT_CHANGE = 'ALIGN_PERCENT_CHANGE',
}

export const preprocessors = [
  { label: 'None', value: PreprocessorType.None },
  {
    label: 'Rate',
    value: PreprocessorType.Rate,
    description: 'Data points are aligned and converted to a rate per time series',
  },
  { label: 'Delta', value: PreprocessorType.Delta },
];

export const queryTypes = [
  { label: 'Metrics', value: QueryType.METRICS },
  { label: 'Service Level Objectives (SLO)', value: QueryType.SLO },
];

export interface BaseQuery {
  projectName: string;
  perSeriesAligner?: string;
  alignmentPeriod?: string;
  aliasBy?: string;
}

export interface MetricQuery extends BaseQuery {
  editorMode: EditorMode;
  unit?: string;
  metricType: string;
  crossSeriesReducer: string;
  groupBys?: string[];
  filters?: string[];
  metricKind?: MetricKind;
  valueType?: string;
  view?: string;
  query: string;
  preprocessor?: PreprocessorType;
}

export interface SLOQuery extends BaseQuery {
  selectorName: string;
  serviceId: string;
  serviceName: string;
  sloId: string;
  sloName: string;
  goal?: number;
}

export interface CloudMonitoringQuery extends DataQuery {
  datasourceId?: number; // Should not be necessary anymore
  queryType: QueryType;
  metricQuery: MetricQuery;
  sloQuery?: SLOQuery;
  intervalMs: number;
  type: string;
}

export interface CloudMonitoringOptions extends DataSourceJsonData {
  defaultProject?: string;
  gceDefaultProject?: string;
  authenticationType?: string;
}

export interface AnnotationTarget {
  projectName: string;
  metricType: string;
  refId: string;
  filters: string[];
  metricKind: MetricKind;
  valueType: string;
  title: string;
  text: string;
}

export interface QueryMeta {
  alignmentPeriod: string;
  rawQuery: string;
  rawQueryString: string;
  metricLabels: { [key: string]: string[] };
  resourceLabels: { [key: string]: string[] };
  resourceTypes: string[];
}

export interface MetricDescriptor {
  valueType: string;
  metricKind: MetricKind;
  type: string;
  unit: string;
  service: string;
  serviceShortName: string;
  displayName: string;
  description: string;
}

export interface Segment {
  type: string;
  value: string;
}

export interface Filter {
  key: string;
  operator: string;
  value: string;
  condition?: string;
}
