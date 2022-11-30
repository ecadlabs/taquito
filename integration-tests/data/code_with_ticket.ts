export const ticketStorage = { prim: 'Pair', args: [{ prim: 'None' }, { prim: 'None' }] };

export const ticketCode = [
	{
		prim: 'storage',
		args: [
			{
				prim: 'pair',
				args: [
					{ prim: 'option', args: [{ prim: 'ticket', args: [{ prim: 'int' }] }], annots: ['%x'] },
					{ prim: 'option', args: [{ prim: 'ticket', args: [{ prim: 'string' }] }], annots: ['%y'] }
				]
			}
		]
	},
	{
		prim: 'parameter',
		args: [
			{
				prim: 'or',
				args: [
					{ prim: 'unit', annots: ['%auto_call'] },
					{ prim: 'ticket', args: [{ prim: 'int' }], annots: ['%run'] }
				]
			}
		]
	},
	{
		prim: 'code',
		args: [
			[
				{ prim: 'UNPAIR' },
				{
					prim: 'IF_LEFT',
					args: [
						[
							{ prim: 'DROP' },
							{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '43' }] },
							{ prim: 'PUSH', args: [{ prim: 'int' }, { int: '1' }] },
							{ prim: 'TICKET' },
							[
								{
								  "prim": "IF_NONE",
								  "args": [
								   [
									 [
									   {
										 "prim": "UNIT"
									   },
									   {
										 "prim": "FAILWITH"
									   }
									]
								  ],
								  []
								]
							   }
							],
							{ prim: 'NIL', args: [{ prim: 'operation' }] },
							{ prim: 'SELF', annots: ['%run'] },
							{ prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
							{ prim: 'DIG', args: [{ int: '3' }] },
							{ prim: 'TRANSFER_TOKENS' },
							{ prim: 'CONS' }
						],
						[
							{ prim: 'READ_TICKET' },
							{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '42' }] },
							{ prim: 'PUSH', args: [{ prim: 'string' }, { string: 'abc' }] },
							{ prim: 'TICKET' },
							[
								{
								  "prim": "IF_NONE",
								  "args": [
								   [
									 [
									   {
										 "prim": "UNIT"
									   },
									   {
										 "prim": "FAILWITH"
									   }
									]
								  ],
								  []
								]
							   }
							],
							{ prim: 'DIG', args: [{ int: '3' }] },
							{ prim: 'SWAP' },
							{ prim: 'SOME' },
							{ prim: 'SWAP' },
							{ prim: 'CAR' },
							{ prim: 'PAIR' },
							{ prim: 'DUG', args: [{ int: '2' }] },
							{ prim: 'GET', args: [{ int: '4' }] },
							{ prim: 'DUP' },
							{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '3' }] },
							{ prim: 'SWAP' },
							{ prim: 'EDIV' },
							{
								prim: 'IF_NONE',
								args: [
									[
										{ prim: 'PUSH', args: [{ prim: 'int' }, { int: '20' }] },
										{ prim: 'FAILWITH' }
									],
									[{ prim: 'CAR' }]
								]
							},
							{ prim: 'SWAP' },
							{ prim: 'DUP' },
							{ prim: 'DUG', args: [{ int: '2' }] },
							{ prim: 'SUB' },
							{ prim: 'ISNAT' },
							{
								prim: 'IF_NONE',
								args: [
									[
										{ prim: 'PUSH', args: [{ prim: 'int' }, { int: '20' }] },
										{ prim: 'FAILWITH' }
									],
									[]
								]
							},
							{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '3' }] },
							{ prim: 'DIG', args: [{ int: '2' }] },
							{ prim: 'EDIV' },
							{
								prim: 'IF_NONE',
								args: [
									[
										{ prim: 'PUSH', args: [{ prim: 'int' }, { int: '20' }] },
										{ prim: 'FAILWITH' }
									],
									[{ prim: 'CAR' }]
								]
							},
							{ prim: 'PAIR' },
							{ prim: 'SWAP' },
							{ prim: 'SPLIT_TICKET' },
							{
								prim: 'IF_NONE',
								args: [
									[
										{ prim: 'PUSH', args: [{ prim: 'int' }, { int: '20' }] },
										{ prim: 'FAILWITH' }
									],
									[]
								]
							},
							{ prim: 'UNPAIR' },
							{ prim: 'SWAP' },
							{ prim: 'PAIR' },
							{ prim: 'JOIN_TICKETS' },
							{ prim: 'SWAP' },
							{ prim: 'CDR' },
							{ prim: 'SWAP' },
							{ prim: 'PAIR' },
							{ prim: 'NIL', args: [{ prim: 'operation' }] },
						]
					]
				},
				{ prim: 'PAIR' }
			]
		]
	}
];
