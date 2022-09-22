export const chestStorage = { bytes: 'cafe' };
export const chestCode = [
	{ prim: 'storage', args: [ { prim: 'bytes' } ] },
	{ prim: 'parameter', args: [ { prim: 'pair', args: [ { prim: 'chest_key' }, { prim: 'chest' } ] } ] },
	{
		prim: 'code',
		args: [
			[
				{ prim: 'UNPAIR' },
				{ prim: 'DIP', args: [ [ { prim: 'DROP' } ] ] },
				{ prim: 'UNPAIR' },
				{
					prim: 'DIP',
					args: [ { int: '2' }, [ { prim: 'PUSH', args: [ { prim: 'nat' }, { int: '1000' } ] } ] ]
				},
				{ prim: 'OPEN_CHEST' },
				{
					prim: 'IF_LEFT',
					args: [
						[ { prim: 'NIL', args: [ { prim: 'operation' } ] }, { prim: 'PAIR' } ],
						[
							{
								prim: 'IF',
								args: [
									[
										{ prim: 'PUSH', args: [ { prim: 'bytes' }, { bytes: '01' } ] },
										{ prim: 'NIL', args: [ { prim: 'operation' } ] },
										{ prim: 'PAIR' }
									],
									[
										{ prim: 'PUSH', args: [ { prim: 'bytes' }, { bytes: '00' } ] },
										{ prim: 'NIL', args: [ { prim: 'operation' } ] },
										{ prim: 'PAIR' }
									]
								]
							}
						]
					]
				}
			]
		]
	}
];
