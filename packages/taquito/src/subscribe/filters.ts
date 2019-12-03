import { OperationEntry } from '@taquito/rpc';

import { OpFilter, FilterExpression, Filter, OpHashFilter, SourceFilter, KindFilter, DestinationFilter } from './interface';

const opHashFilter = (op: OperationEntry, filter: OpHashFilter) => op.hash === filter.opHash;

const sourceFilter = (op: OperationEntry, filter: SourceFilter) => (op.contents || []).some(x => {
  switch (x.kind) {
    case 'endorsement':
      return 'metadata' in x && x.metadata.delegate === filter.source
    case 'activate_account':
      return 'metadata' in x && x.pkh === filter.source
    default:
      return 'source' in x && x.source === filter.source
  }
})

const kindFilter = (op: OperationEntry, filter: KindFilter) => (op.contents || []).some(x => 'kind' in x && x.kind === filter.kind);

const destinationFilter = (op: OperationEntry, filter: DestinationFilter) => (op.contents || []).some(x => {
  switch (x.kind) {
    case 'delegation':
      return x.delegate === filter.destination;
    case 'origination':
      if (
        'metadata' in x &&
        'operation_result' in x.metadata &&
        'originated_contracts' in x.metadata.operation_result &&
        Array.isArray(x.metadata.operation_result.originated_contracts)
      ) {
        return x.metadata.operation_result.originated_contracts.some(
          contract => contract === filter.destination
        );
      }
      break;
    case 'transaction':
      return x.destination === filter.destination;
    default:
      return false;
  }
});

export const evaluateOpFilter = (op: OperationEntry, filter: OpFilter) => {
  if ('opHash' in filter) {
    return opHashFilter(op, filter);
  } else if ('source' in filter) {
    return sourceFilter(op, filter)
  } else if ('kind' in filter) {
    return kindFilter(op, filter);
  } else if ('destination' in filter) {
    return destinationFilter(op, filter)
  }

  return false;
};

export const evaluateExpression = (op: OperationEntry, exp: FilterExpression): boolean => {
  if (Array.isArray(exp.and)) {
    return exp.and.every((x: OpFilter | FilterExpression) => evaluateFilter(op, x));
  } else if (Array.isArray(exp.or)) {
    return exp.or.some((x: OpFilter | FilterExpression) => evaluateFilter(op, x));
  } else {
    throw new Error('Filter expression must contains either and/or property');
  }
};

export const evaluateFilter = (op: OperationEntry, filter: Filter): boolean => {
  const filters: OpFilter[] | FilterExpression[] = [];
  if (!Array.isArray(filter)) {
    filters.push(filter as any);
  } else {
    filters.push(...(filter as any));
  }

  return filters.every((filterOrExp: OpFilter | FilterExpression) => {
    if ('and' in filterOrExp || 'or' in filterOrExp) {
      return evaluateExpression(op, filterOrExp);
    } else {
      return evaluateOpFilter(op, filterOrExp as OpFilter);
    }
  });
};
