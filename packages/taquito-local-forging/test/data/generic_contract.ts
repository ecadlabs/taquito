
export const genericStorage = {
  prim: 'Unit',
};

export const genericCode = (op: string) => [
  {
    prim: 'parameter',
    args: [{ prim: 'unit' }],
  },
  {
    prim: 'storage',
    args: [{ prim: 'unit' }],
  },
  {
    prim: 'code',
    args: [{ prim: op }],
  },
];
