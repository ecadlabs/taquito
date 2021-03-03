const setDelegate = (key: string) => {
  return [
    { prim: 'DROP' },
    { prim: 'NIL', args: [{ prim: 'operation' }] },
    {
      prim: 'PUSH',
      args: [{ prim: 'key_hash' }, { string: key }],
    },
    { prim: 'SOME' },
    { prim: 'SET_DELEGATE' },
    { prim: 'CONS' },
  ];
};

const transferImplicit = (key: string, mutez: number) => {
  return [
    { prim: 'DROP' },
    { prim: 'NIL', args: [{ prim: 'operation' }] },
    {
      prim: 'PUSH',
      args: [{ prim: 'key_hash' }, { string: key }],
    },
    { prim: 'IMPLICIT_ACCOUNT' },
    {
      prim: 'PUSH',
      args: [{ prim: 'mutez' }, { int: `${mutez}` }],
    },
    { prim: 'UNIT' },
    { prim: 'TRANSFER_TOKENS' },
    { prim: 'CONS' },
  ];
};

const removeDelegate = () => {
  return [
    { prim: 'DROP' },
    { prim: 'NIL', args: [{ prim: 'operation' }] },
    { prim: 'NONE', args: [{ prim: 'key_hash' }] },
    { prim: 'SET_DELEGATE' },
    { prim: 'CONS' },
  ];
};

const transferToContract = (key: string, amount: number) => {
  return [
    { prim: 'DROP' },
    { prim: 'NIL', args: [{ prim: 'operation' }] },
    {
      prim: 'PUSH',
      args: [{ prim: 'address' }, { string: key }],
    },
    { prim: 'CONTRACT', args: [{ prim: 'unit' }] },
    [
      {
        prim: 'IF_NONE',
        args: [[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]], []],
      },
    ],
    {
      prim: 'PUSH',
      args: [{ prim: 'mutez' }, { int: `${amount}` }],
    },
    { prim: 'UNIT' },
    { prim: 'TRANSFER_TOKENS' },
    { prim: 'CONS' },
  ];
};

// Since v9, the type of delegate is changed from key_hash to baker_hash
const setDelegateV9 = (key: string) => {
  return [
    { prim: 'DROP' },
    { prim: 'NIL', args: [{ prim: 'operation' }] },
    {
      prim: 'PUSH',
      args: [{ prim: 'baker_hash' }, { string: key }],
    },
    { prim: 'SOME' },
    { prim: 'SET_DELEGATE' },
    { prim: 'CONS' },
  ];
};

// Since v9, the type of delegate is changed from key_hash to baker_hash
const removeDelegateV9 = () => {
  return [
    { prim: 'DROP' },
    { prim: 'NIL', args: [{ prim: 'operation' }] },
    { prim: 'NONE', args: [{ prim: 'baker_hash' }] },
    { prim: 'SET_DELEGATE' },
    { prim: 'CONS' },
  ];
};

export const MANAGER_LAMBDA = {
  setDelegate,
  removeDelegate,
  transferImplicit,
  transferToContract,
};

export const MANAGER_LAMBDA_V9 = {
  setDelegate: setDelegateV9,
  removeDelegate: removeDelegateV9,
  transferImplicit,
  transferToContract
};