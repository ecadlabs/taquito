export const codeViewsTopLevel = [
	{
		prim: 'view',
		args: [{ string: 'add' }, { prim: 'nat' }, { prim: 'nat' }, [{ prim: 'UNPAIR' }, { prim: 'ADD' }]]
	},
	{
		prim: 'view',
		args: [
			{ string: 'fib' },
			{ prim: 'nat' },
			{ prim: 'nat' },
			[
				{ prim: 'CAR' },
				{ prim: 'DUP' },
				{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] },
				{ prim: 'COMPARE' },
				{ prim: 'EQ' },
				{
					prim: 'IF',
					args: [
						[],
						[
							{ prim: 'DUP' },
							{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
							{ prim: 'COMPARE' },
							{ prim: 'EQ' },
							{
								prim: 'IF',
								args: [
									[],
									[
										{ prim: 'DUP' },
										{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
										{ prim: 'SWAP' },
										{ prim: 'SUB' },
										{ prim: 'ABS' },
										{ prim: 'SELF_ADDRESS' },
										{ prim: 'SWAP' },
										{ prim: 'VIEW', args: [{ string: 'fib' }, { prim: 'nat' }] },
										[
											{
												prim: 'IF_NONE',
												args: [
													[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]],
													[
														{ prim: 'SWAP' },
														{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '2' }] },
														{ prim: 'SWAP' },
														{ prim: 'SUB' },
														{ prim: 'ABS' },
														{ prim: 'SELF_ADDRESS' },
														{ prim: 'SWAP' },
														{ prim: 'VIEW', args: [{ string: 'fib' }, { prim: 'nat' }] },
														[
															{
																prim: 'IF_NONE',
																args: [
																	[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]],
																	[{ prim: 'ADD' }]
																]
															}
														]
													]
												]
											}
										]
									]
								]
							}
						]
					]
				}
			]
		]
	},
	{
		prim: 'view',
		args: [{ string: 'id' }, { prim: 'nat' }, { prim: 'pair', args: [{ prim: 'nat' }, { prim: 'nat' }] }, []]
	},
	{
		prim: 'view',
		args: [
			{ string: 'is_twenty' },
			{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'address' }] },
			{ prim: 'nat' },
			[
				{ prim: 'CAR' },
				{ prim: 'DUP' },
				{ prim: 'CAR' },
				{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '20' }] },
				{ prim: 'COMPARE' },
				{ prim: 'EQ' },
				{
					prim: 'IF',
					args: [
						[{ prim: 'CAR' }],
						[
							{ prim: 'DUP' },
							{ prim: 'CDR' },
							{ prim: 'SWAP' },
							{ prim: 'VIEW', args: [{ string: 'succ' }, { prim: 'nat' }] },
							[{ prim: 'IF_NONE', args: [[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]], []] }]
						]
					]
				}
			]
		]
	},
	{
		prim: 'view',
		args: [
			{ string: 'step_constants' },
			{ prim: 'unit' },
			{
				prim: 'pair',
				args: [
					{ prim: 'pair', args: [{ prim: 'mutez' }, { prim: 'mutez' }] },
					{
						prim: 'pair',
						args: [
							{ prim: 'pair', args: [{ prim: 'address' }, { prim: 'address' }] },
							{ prim: 'address' }
						]
					}
				]
			},
			[
				{ prim: 'DROP' },
				{ prim: 'SOURCE' },
				{ prim: 'SENDER' },
				{ prim: 'SELF_ADDRESS' },
				{ prim: 'PAIR' },
				{ prim: 'PAIR' },
				{ prim: 'BALANCE' },
				{ prim: 'AMOUNT' },
				{ prim: 'PAIR' },
				{ prim: 'PAIR' }
			]
		]
	},
	{
		prim: 'view',
		args: [
			{ string: 'succ' },
			{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'address' }] },
			{ prim: 'nat' },
			[
				{ prim: 'CAR' },
				{ prim: 'UNPAIR' },
				{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
				{ prim: 'ADD' },
				{ prim: 'PAIR' },
				{ prim: 'DUP' },
				{ prim: 'CDR' },
				{ prim: 'SWAP' },
				{ prim: 'VIEW', args: [{ string: 'is_twenty' }, { prim: 'nat' }] },
				[{ prim: 'IF_NONE', args: [[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]], []] }]
			]
		]
	},
	{
		prim: 'view',
		args: [
			{ string: 'test_failwith' },
			{ prim: 'nat' },
			{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'nat' }] },
			[{ prim: 'FAILWITH' }]
		]
	},
	{ prim: 'parameter', args: [{ prim: 'nat' }] },
	{ prim: 'storage', args: [{ prim: 'nat' }] },
	{ prim: 'code', args: [[{ prim: 'CAR' }, { prim: 'NIL', args: [{ prim: 'operation' }] }, { prim: 'PAIR' }]] }
];
export const storageViewsTopLevel = { int: '2' };
