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
							{ prim: 'NIL', args: [{ prim: 'operation' }] }
						]
					]
				},
				{ prim: 'PAIR' }
			]
		]
	}
];

export const ticketStorage2 = {
	prim: 'Pair',
	args: [{ bytes: '00006dba164f4293b862a5e2c5ab84888ea8d7f8cbe6' }, { int: '39' }]
};

export const ticketCode2 = [
	{
		prim: 'parameter',
		args: [
			{
				prim: 'or',
				args: [
					{ prim: 'ticket', args: [{ prim: 'unit' }], annots: ['%receive'] },
					{
						prim: 'pair',
						args: [
							{
								prim: 'contract',
								args: [{ prim: 'ticket', args: [{ prim: 'unit' }] }],
								annots: ['%destination']
							},
							{ prim: 'nat', annots: ['%amount'] },
							{ prim: 'address', annots: ['%ticketer'] }
						],
						annots: ['%send']
					}
				]
			}
		]
	},
	{
		prim: 'storage',
		args: [
			{
				prim: 'pair',
				args: [
					{ prim: 'address', annots: ['%manager'] },
					{
						prim: 'big_map',
						args: [{ prim: 'address' }, { prim: 'ticket', args: [{ prim: 'unit' }] }],
						annots: ['%tickets']
					}
				]
			}
		]
	},
	{
		prim: 'code',
		args: [
			[
				{ prim: 'AMOUNT' },
				{ prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
				[
					[{ prim: 'COMPARE' }, { prim: 'EQ' }],
					{ prim: 'IF', args: [[], [[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]]] }
				],
				{ prim: 'UNPAIR', args: [{ int: '3' }] },
				{
					prim: 'IF_LEFT',
					args: [
						[
							{ prim: 'READ_TICKET' },
							{ prim: 'CAR', annots: ['@ticketer'] },
							{ prim: 'DUP' },
							{ prim: 'DIG', args: [{ int: '4' }] },
							{ prim: 'NONE', args: [{ prim: 'ticket', args: [{ prim: 'unit' }] }] },
							{ prim: 'DIG', args: [{ int: '2' }] },
							{ prim: 'GET_AND_UPDATE' },
							[
								{
									prim: 'IF_NONE',
									args: [
										[{ prim: 'DIG', args: [{ int: '2' }] }],
										[
											{ prim: 'DIG', args: [{ int: '3' }] },
											{ prim: 'PAIR' },
											{ prim: 'JOIN_TICKETS' },
											[
												{
													prim: 'IF_NONE',
													args: [[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]], []]
												}
											]
										]
									]
								}
							],
							{ prim: 'SOME' },
							{ prim: 'DIG', args: [{ int: '2' }] },
							{ prim: 'GET_AND_UPDATE' },
							[{ prim: 'IF_NONE', args: [[], [[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]]] }],
							{ prim: 'SWAP' },
							{ prim: 'PAIR' },
							{ prim: 'NIL', args: [{ prim: 'operation' }] }
						],
						[
							{ prim: 'DUP', args: [{ int: '2' }], annots: ['@manager'] },
							{ prim: 'SENDER' },
							[
								[{ prim: 'COMPARE' }, { prim: 'EQ' }],
								{ prim: 'IF', args: [[], [[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]]] }
							],
							{ prim: 'UNPAIR', args: [{ int: '3' }] },
							{ prim: 'DIG', args: [{ int: '4' }] },
							{ prim: 'NONE', args: [{ prim: 'ticket', args: [{ prim: 'unit' }] }] },
							{ prim: 'DUP', args: [{ int: '5' }], annots: ['@ticketer'] },
							{ prim: 'GET_AND_UPDATE' },
							[{ prim: 'IF_NONE', args: [[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]], []] }],
							{ prim: 'READ_TICKET' },
							{ prim: 'GET', args: [{ int: '4' }], annots: ['@total_amount'] },
							{ prim: 'DUP', args: [{ int: '5' }], annots: ['@amount'] },
							{ prim: 'SWAP' },
							{ prim: 'SUB' },
							{ prim: 'ISNAT' },
							[
								{
									prim: 'IF_NONE',
									args: [
										[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]],
										[{ prim: 'RENAME', annots: ['@remaining_amount'] }]
									]
								}
							],
							{ prim: 'DIG', args: [{ int: '4' }] },
							{ prim: 'PAIR' },
							{ prim: 'SWAP' },
							{ prim: 'SPLIT_TICKET' },
							[{ prim: 'IF_NONE', args: [[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]], []] }],
							{ prim: 'UNPAIR', annots: ['@to_send', '@to_keep'] },
							{ prim: 'DUG', args: [{ int: '5' }] },
							{ prim: 'SOME' },
							{ prim: 'DIG', args: [{ int: '3' }] },
							{ prim: 'GET_AND_UPDATE' },
							[{ prim: 'IF_NONE', args: [[], [[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]]] }],
							{ prim: 'DIG', args: [{ int: '2' }] },
							{ prim: 'PAIR' },
							{ prim: 'SWAP' },
							{ prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
							{ prim: 'DIG', args: [{ int: '3' }] },
							{ prim: 'TRANSFER_TOKENS' },
							{ prim: 'NIL', args: [{ prim: 'operation' }] },
							{ prim: 'SWAP' },
							{ prim: 'CONS' }
						]
					]
				},
				{ prim: 'PAIR' }
			]
		]
	}
];

export const ticketStorage3 = {
	prim: 'Pair',
	args: [
		[
			{ bytes: '00000d4f0cf2fae2437f924120ef030f53abd4d4e520' },
			{ int: '90' },
			{ int: '10' },
			{ prim: 'False' },
			{ int: '1609898008' },
			{ int: '600' }
		],
		{ int: '139' }
	]
};

export const ticketCode3 = [
	{
		prim: 'parameter',
		args: [
			{
				prim: 'or',
				args: [
					{
						prim: 'or',
						args: [
							{
								prim: 'or',
								args: [
									{
										prim: 'contract',
										args: [{ prim: 'ticket', args: [{ prim: 'nat' }] }],
										annots: ['%buy']
									},
									{
										prim: 'contract',
										args: [{ prim: 'ticket', args: [{ prim: 'nat' }] }],
										annots: ['%cancel']
									}
								]
							},
							{
								prim: 'or',
								args: [
									{
										prim: 'pair',
										args: [
											{ prim: 'nat', annots: ['%opening_price'] },
											{
												prim: 'pair',
												args: [
													{ prim: 'nat', annots: ['%set_reserve_price'] },
													{
														prim: 'pair',
														args: [
															{ prim: 'timestamp', annots: ['%set_start_time'] },
															{
																prim: 'pair',
																args: [
																	{ prim: 'int', annots: ['%set_round_time'] },
																	{
																		prim: 'ticket',
																		args: [{ prim: 'nat' }],
																		annots: ['%ticket']
																	}
																]
															}
														]
													}
												]
											}
										],
										annots: ['%configure']
									},
									{ prim: 'nat', annots: ['%drop_price'] }
								]
							}
						]
					},
					{ prim: 'unit', annots: ['%start'] }
				]
			}
		]
	},
	{
		prim: 'storage',
		args: [
			{
				prim: 'pair',
				args: [
					{
						prim: 'pair',
						args: [
							{ prim: 'address', annots: ['%admin'] },
							{
								prim: 'pair',
								args: [
									{ prim: 'nat', annots: ['%current_price'] },
									{
										prim: 'pair',
										args: [
											{ prim: 'nat', annots: ['%reserve_price'] },
											{
												prim: 'pair',
												args: [
													{ prim: 'bool', annots: ['%in_progress'] },
													{
														prim: 'pair',
														args: [
															{ prim: 'timestamp', annots: ['%start_time'] },
															{ prim: 'int', annots: ['%round_time'] }
														]
													}
												]
											}
										]
									}
								]
							}
						],
						annots: ['%data']
					},
					{
						prim: 'big_map',
						args: [{ prim: 'nat' }, { prim: 'ticket', args: [{ prim: 'nat' }] }],
						annots: ['%tickets']
					}
				]
			}
		]
	},
	{
		prim: 'code',
		args: [
			[
				{ prim: 'UNPAIR' },
				{ prim: 'SWAP' },
				{ prim: 'UNPAIR' },
				{ prim: 'DIG', args: [{ int: '2' }] },
				{
					prim: 'IF_LEFT',
					args: [
						[
							{
								prim: 'IF_LEFT',
								args: [
									[
										{
											prim: 'IF_LEFT',
											args: [
												[
													{ prim: 'NOW' },
													{ prim: 'AMOUNT' },
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '4' }] },
													{ prim: 'CAR' },
													{ prim: 'SENDER' },
													{ prim: 'COMPARE' },
													{ prim: 'NEQ' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '4' }] },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CAR' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '1' }] },
													{ prim: 'DIG', args: [{ int: '4' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '5' }] },
													{ prim: 'CDR' },
													{ prim: 'CAR' },
													{ prim: 'MUL' },
													{ prim: 'SWAP' },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '2' }] },
													{ prim: 'COMPARE' },
													{ prim: 'EQ' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '4' }] },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'DIG', args: [{ int: '4' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '5' }] },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CAR' },
													{ prim: 'ADD' },
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'COMPARE' },
													{ prim: 'LE' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '3' }] },
													{ prim: 'CAR' },
													{ prim: 'CONTRACT', args: [{ prim: 'unit' }] },
													{
														prim: 'IF_NONE',
														args: [
															[
																{ prim: 'DROP', args: [{ int: '4' }] },
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'contract does not match' }
																	]
																},
																{ prim: 'FAILWITH' }
															],
															[
																{ prim: 'SWAP' },
																{
																	prim: 'PUSH',
																	args: [{ prim: 'unit' }, { prim: 'Unit' }]
																},
																{ prim: 'TRANSFER_TOKENS' },
																{ prim: 'DIG', args: [{ int: '3' }] },
																{
																	prim: 'NONE',
																	args: [
																		{ prim: 'ticket', args: [{ prim: 'nat' }] }
																	]
																},
																{
																	prim: 'PUSH',
																	args: [{ prim: 'nat' }, { int: '0' }]
																},
																{ prim: 'GET_AND_UPDATE' },
																{
																	prim: 'IF_NONE',
																	args: [
																		[
																			{ prim: 'DROP', args: [{ int: '4' }] },
																			{
																				prim: 'PUSH',
																				args: [
																					{ prim: 'string' },
																					{ string: 'ticket does not exist' }
																				]
																			},
																			{ prim: 'FAILWITH' }
																		],
																		[
																			{ prim: 'DIG', args: [{ int: '3' }] },
																			{
																				prim: 'PUSH',
																				args: [
																					{ prim: 'mutez' },
																					{ int: '0' }
																				]
																			},
																			{ prim: 'DIG', args: [{ int: '2' }] },
																			{ prim: 'TRANSFER_TOKENS' },
																			{ prim: 'SWAP' },
																			{ prim: 'DIG', args: [{ int: '3' }] },
																			{ prim: 'DUP' },
																			{ prim: 'DUG', args: [{ int: '4' }] },
																			{ prim: 'CDR' },
																			{ prim: 'CDR' },
																			{ prim: 'CDR' },
																			{ prim: 'CDR' },
																			{
																				prim: 'PUSH',
																				args: [
																					{ prim: 'bool' },
																					{ prim: 'False' }
																				]
																			},
																			{ prim: 'PAIR' },
																			{ prim: 'DIG', args: [{ int: '4' }] },
																			{ prim: 'DUP' },
																			{ prim: 'DUG', args: [{ int: '5' }] },
																			{ prim: 'CDR' },
																			{ prim: 'CDR' },
																			{ prim: 'CAR' },
																			{ prim: 'PAIR' },
																			{ prim: 'DIG', args: [{ int: '4' }] },
																			{ prim: 'DUP' },
																			{ prim: 'DUG', args: [{ int: '5' }] },
																			{ prim: 'CDR' },
																			{ prim: 'CAR' },
																			{ prim: 'PAIR' },
																			{ prim: 'DIG', args: [{ int: '4' }] },
																			{ prim: 'CAR' },
																			{ prim: 'PAIR' },
																			{ prim: 'PAIR' },
																			{
																				prim: 'NIL',
																				args: [{ prim: 'operation' }]
																			},
																			{ prim: 'DIG', args: [{ int: '2' }] },
																			{ prim: 'CONS' },
																			{ prim: 'DIG', args: [{ int: '2' }] },
																			{ prim: 'CONS' },
																			{ prim: 'PAIR' }
																		]
																	]
																}
															]
														]
													}
												],
												[
													{ prim: 'SWAP' },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '2' }] },
													{ prim: 'CAR' },
													{ prim: 'SENDER' },
													{ prim: 'COMPARE' },
													{ prim: 'EQ' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'SWAP' },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '2' }] },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CAR' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'DIG', args: [{ int: '2' }] },
													{
														prim: 'NONE',
														args: [{ prim: 'ticket', args: [{ prim: 'nat' }] }]
													},
													{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] },
													{ prim: 'GET_AND_UPDATE' },
													{
														prim: 'IF_NONE',
														args: [
															[
																{ prim: 'DROP', args: [{ int: '3' }] },
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'ticket does not exist' }
																	]
																},
																{ prim: 'FAILWITH' }
															],
															[
																{ prim: 'DIG', args: [{ int: '2' }] },
																{
																	prim: 'PUSH',
																	args: [{ prim: 'mutez' }, { int: '0' }]
																},
																{ prim: 'DIG', args: [{ int: '2' }] },
																{ prim: 'TRANSFER_TOKENS' },
																{ prim: 'SWAP' },
																{ prim: 'DIG', args: [{ int: '2' }] },
																{ prim: 'DUP' },
																{ prim: 'DUG', args: [{ int: '3' }] },
																{ prim: 'CDR' },
																{ prim: 'CDR' },
																{ prim: 'CDR' },
																{ prim: 'CDR' },
																{
																	prim: 'PUSH',
																	args: [{ prim: 'bool' }, { prim: 'False' }]
																},
																{ prim: 'PAIR' },
																{ prim: 'DIG', args: [{ int: '3' }] },
																{ prim: 'DUP' },
																{ prim: 'DUG', args: [{ int: '4' }] },
																{ prim: 'CDR' },
																{ prim: 'CDR' },
																{ prim: 'CAR' },
																{ prim: 'PAIR' },
																{ prim: 'DIG', args: [{ int: '3' }] },
																{ prim: 'DUP' },
																{ prim: 'DUG', args: [{ int: '4' }] },
																{ prim: 'CDR' },
																{ prim: 'CAR' },
																{ prim: 'PAIR' },
																{ prim: 'DIG', args: [{ int: '3' }] },
																{ prim: 'CAR' },
																{ prim: 'PAIR' },
																{ prim: 'PAIR' },
																{ prim: 'NIL', args: [{ prim: 'operation' }] },
																{ prim: 'DIG', args: [{ int: '2' }] },
																{ prim: 'CONS' },
																{ prim: 'PAIR' }
															]
														]
													}
												]
											]
										}
									],
									[
										{
											prim: 'IF_LEFT',
											args: [
												[
													{ prim: 'SWAP' },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '2' }] },
													{ prim: 'CAR' },
													{ prim: 'SOURCE' },
													{ prim: 'COMPARE' },
													{ prim: 'EQ' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'SWAP' },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '2' }] },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CAR' },
													{ prim: 'NOT' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'UNPAIR' },
													{ prim: 'SWAP' },
													{ prim: 'UNPAIR' },
													{ prim: 'SWAP' },
													{ prim: 'UNPAIR' },
													{ prim: 'SWAP' },
													{ prim: 'UNPAIR' },
													{ prim: 'DIG', args: [{ int: '6' }] },
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'SOME' },
													{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] },
													{ prim: 'UPDATE' },
													{ prim: 'SWAP' },
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'PAIR' },
													{ prim: 'PUSH', args: [{ prim: 'bool' }, { prim: 'False' }] },
													{ prim: 'PAIR' },
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'PAIR' },
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'PAIR' },
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'CAR' },
													{ prim: 'PAIR' },
													{ prim: 'PAIR' },
													{ prim: 'NIL', args: [{ prim: 'operation' }] },
													{ prim: 'PAIR' }
												],
												[
													{ prim: 'NOW' },
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '3' }] },
													{ prim: 'CAR' },
													{ prim: 'SENDER' },
													{ prim: 'COMPARE' },
													{ prim: 'EQ' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '3' }] },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CAR' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '3' }] },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CAR' },
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '3' }] },
													{ prim: 'COMPARE' },
													{ prim: 'GE' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '3' }] },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '4' }] },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CAR' },
													{ prim: 'ADD' },
													{ prim: 'SWAP' },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '2' }] },
													{ prim: 'COMPARE' },
													{ prim: 'GT' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '4' }] },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'PAIR' },
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'CAR' },
													{ prim: 'PAIR' },
													{ prim: 'DUP' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'PAIR' },
													{ prim: 'SWAP' },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '2' }] },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CAR' },
													{ prim: 'PAIR' },
													{ prim: 'SWAP' },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '2' }] },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CAR' },
													{ prim: 'PAIR' },
													{ prim: 'SWAP' },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '2' }] },
													{ prim: 'CDR' },
													{ prim: 'CAR' },
													{ prim: 'PAIR' },
													{ prim: 'SWAP' },
													{ prim: 'CAR' },
													{ prim: 'PAIR' },
													{ prim: 'PAIR' },
													{ prim: 'NIL', args: [{ prim: 'operation' }] },
													{ prim: 'PAIR' }
												]
											]
										}
									]
								]
							}
						],
						[
							{ prim: 'DROP' },
							{ prim: 'NOW' },
							{ prim: 'SWAP' },
							{ prim: 'DUP' },
							{ prim: 'DUG', args: [{ int: '2' }] },
							{ prim: 'CAR' },
							{ prim: 'SOURCE' },
							{ prim: 'COMPARE' },
							{ prim: 'EQ' },
							{
								prim: 'IF',
								args: [
									[],
									[
										{ prim: 'PUSH', args: [{ prim: 'string' }, { string: 'failed assertion' }] },
										{ prim: 'FAILWITH' }
									]
								]
							},
							{ prim: 'SWAP' },
							{ prim: 'DUP' },
							{ prim: 'DUG', args: [{ int: '2' }] },
							{ prim: 'CDR' },
							{ prim: 'CDR' },
							{ prim: 'CDR' },
							{ prim: 'CAR' },
							{ prim: 'NOT' },
							{
								prim: 'IF',
								args: [
									[],
									[
										{ prim: 'PUSH', args: [{ prim: 'string' }, { string: 'failed assertion' }] },
										{ prim: 'FAILWITH' }
									]
								]
							},
							{ prim: 'SWAP' },
							{ prim: 'DUP' },
							{ prim: 'DUG', args: [{ int: '2' }] },
							{ prim: 'CDR' },
							{ prim: 'CDR' },
							{ prim: 'CDR' },
							{ prim: 'CDR' },
							{ prim: 'CAR' },
							{ prim: 'SWAP' },
							{ prim: 'DUP' },
							{ prim: 'DUG', args: [{ int: '2' }] },
							{ prim: 'COMPARE' },
							{ prim: 'GE' },
							{
								prim: 'IF',
								args: [
									[],
									[
										{ prim: 'PUSH', args: [{ prim: 'string' }, { string: 'failed assertion' }] },
										{ prim: 'FAILWITH' }
									]
								]
							},
							{ prim: 'DIG', args: [{ int: '2' }] },
							{ prim: 'NONE', args: [{ prim: 'ticket', args: [{ prim: 'nat' }] }] },
							{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] },
							{ prim: 'GET_AND_UPDATE' },
							{
								prim: 'IF_NONE',
								args: [
									[
										{ prim: 'DROP', args: [{ int: '3' }] },
										{ prim: 'PUSH', args: [{ prim: 'string' }, { string: 'no ticket' }] },
										{ prim: 'FAILWITH' }
									],
									[
										{ prim: 'SOME' },
										{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] },
										{ prim: 'UPDATE' },
										{ prim: 'DIG', args: [{ int: '2' }] },
										{ prim: 'DUP' },
										{ prim: 'DUG', args: [{ int: '3' }] },
										{ prim: 'CDR' },
										{ prim: 'CDR' },
										{ prim: 'CDR' },
										{ prim: 'CDR' },
										{ prim: 'PUSH', args: [{ prim: 'bool' }, { prim: 'True' }] },
										{ prim: 'PAIR' },
										{ prim: 'DIG', args: [{ int: '3' }] },
										{ prim: 'DUP' },
										{ prim: 'DUG', args: [{ int: '4' }] },
										{ prim: 'CDR' },
										{ prim: 'CDR' },
										{ prim: 'CAR' },
										{ prim: 'PAIR' },
										{ prim: 'DIG', args: [{ int: '3' }] },
										{ prim: 'DUP' },
										{ prim: 'DUG', args: [{ int: '4' }] },
										{ prim: 'CDR' },
										{ prim: 'CAR' },
										{ prim: 'PAIR' },
										{ prim: 'DIG', args: [{ int: '3' }] },
										{ prim: 'CAR' },
										{ prim: 'PAIR' },
										{ prim: 'DUP' },
										{ prim: 'CDR' },
										{ prim: 'CDR' },
										{ prim: 'CDR' },
										{ prim: 'CDR' },
										{ prim: 'CDR' },
										{ prim: 'DIG', args: [{ int: '3' }] },
										{ prim: 'PAIR' },
										{ prim: 'SWAP' },
										{ prim: 'DUP' },
										{ prim: 'DUG', args: [{ int: '2' }] },
										{ prim: 'CDR' },
										{ prim: 'CDR' },
										{ prim: 'CDR' },
										{ prim: 'CAR' },
										{ prim: 'PAIR' },
										{ prim: 'SWAP' },
										{ prim: 'DUP' },
										{ prim: 'DUG', args: [{ int: '2' }] },
										{ prim: 'CDR' },
										{ prim: 'CDR' },
										{ prim: 'CAR' },
										{ prim: 'PAIR' },
										{ prim: 'SWAP' },
										{ prim: 'DUP' },
										{ prim: 'DUG', args: [{ int: '2' }] },
										{ prim: 'CDR' },
										{ prim: 'CAR' },
										{ prim: 'PAIR' },
										{ prim: 'SWAP' },
										{ prim: 'CAR' },
										{ prim: 'PAIR' },
										{ prim: 'PAIR' },
										{ prim: 'NIL', args: [{ prim: 'operation' }] },
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

export const ticketStorage4 = [
	{ bytes: '00000d4f0cf2fae2437f924120ef030f53abd4d4e520' },
	{ int: '140' },
	{ int: '1' },
	{ int: '141' }
];

export const ticketCode4 = [
	{
		prim: 'parameter',
		args: [
			{
				prim: 'or',
				args: [
					{
						prim: 'or',
						args: [
							{
								prim: 'or',
								args: [
									{
										prim: 'pair',
										args: [
											{
												prim: 'contract',
												args: [
													{
														prim: 'pair',
														args: [
															{ prim: 'nat', annots: ['%opening_price'] },
															{
																prim: 'pair',
																args: [
																	{ prim: 'nat', annots: ['%set_reserve_price'] },
																	{
																		prim: 'pair',
																		args: [
																			{
																				prim: 'timestamp',
																				annots: ['%set_start_time']
																			},
																			{
																				prim: 'pair',
																				args: [
																					{
																						prim: 'int',
																						annots: ['%set_round_time']
																					},
																					{
																						prim: 'ticket',
																						args: [{ prim: 'nat' }],
																						annots: ['%ticket']
																					}
																				]
																			}
																		]
																	}
																]
															}
														]
													}
												],
												annots: ['%destination']
											},
											{
												prim: 'pair',
												args: [
													{ prim: 'nat', annots: ['%opening_price'] },
													{
														prim: 'pair',
														args: [
															{ prim: 'nat', annots: ['%reserve_price'] },
															{
																prim: 'pair',
																args: [
																	{ prim: 'timestamp', annots: ['%start_time'] },
																	{
																		prim: 'pair',
																		args: [
																			{ prim: 'int', annots: ['%round_time'] },
																			{ prim: 'nat', annots: ['%ticket_id'] }
																		]
																	}
																]
															}
														]
													}
												]
											}
										],
										annots: ['%auction']
									},
									{ prim: 'nat', annots: ['%burn'] }
								]
							},
							{
								prim: 'or',
								args: [
									{
										prim: 'map',
										args: [{ prim: 'string' }, { prim: 'bytes' }],
										annots: ['%mint']
									},
									{ prim: 'ticket', args: [{ prim: 'nat' }], annots: ['%receive'] }
								]
							}
						]
					},
					{
						prim: 'pair',
						args: [
							{
								prim: 'contract',
								args: [{ prim: 'ticket', args: [{ prim: 'nat' }] }],
								annots: ['%destination']
							},
							{ prim: 'nat', annots: ['%ticket_id'] }
						],
						annots: ['%send']
					}
				]
			}
		]
	},
	{
		prim: 'storage',
		args: [
			{
				prim: 'pair',
				args: [
					{ prim: 'address', annots: ['%admin'] },
					{
						prim: 'pair',
						args: [
							{
								prim: 'big_map',
								args: [{ prim: 'nat' }, { prim: 'ticket', args: [{ prim: 'nat' }] }],
								annots: ['%tickets']
							},
							{
								prim: 'pair',
								args: [
									{ prim: 'nat', annots: ['%current_id'] },
									{
										prim: 'big_map',
										args: [
											{ prim: 'nat' },
											{
												prim: 'pair',
												args: [
													{ prim: 'nat' },
													{ prim: 'map', args: [{ prim: 'string' }, { prim: 'bytes' }] }
												]
											}
										],
										annots: ['%token_metadata']
									}
								]
							}
						]
					}
				]
			}
		]
	},
	{
		prim: 'code',
		args: [
			[
				{ prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
				{ prim: 'AMOUNT' },
				{ prim: 'COMPARE' },
				{ prim: 'EQ' },
				{
					prim: 'IF',
					args: [
						[],
						[
							{ prim: 'PUSH', args: [{ prim: 'string' }, { string: 'failed assertion' }] },
							{ prim: 'FAILWITH' }
						]
					]
				},
				{ prim: 'UNPAIR' },
				{ prim: 'SWAP' },
				{ prim: 'UNPAIR' },
				{ prim: 'SWAP' },
				{ prim: 'UNPAIR' },
				{ prim: 'SWAP' },
				{ prim: 'UNPAIR' },
				{ prim: 'DIG', args: [{ int: '4' }] },
				{
					prim: 'IF_LEFT',
					args: [
						[
							{
								prim: 'IF_LEFT',
								args: [
									[
										{
											prim: 'IF_LEFT',
											args: [
												[
													{ prim: 'DIG', args: [{ int: '4' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '5' }] },
													{ prim: 'SENDER' },
													{ prim: 'COMPARE' },
													{ prim: 'EQ' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'DIG', args: [{ int: '3' }] },
													{
														prim: 'NONE',
														args: [{ prim: 'ticket', args: [{ prim: 'nat' }] }]
													},
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '3' }] },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'CDR' },
													{ prim: 'GET_AND_UPDATE' },
													{
														prim: 'IF_NONE',
														args: [
															[
																{ prim: 'DROP', args: [{ int: '5' }] },
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'no tickets' }
																	]
																},
																{ prim: 'FAILWITH' }
															],
															[
																{ prim: 'DIG', args: [{ int: '2' }] },
																{ prim: 'DUP' },
																{ prim: 'DUG', args: [{ int: '3' }] },
																{ prim: 'CAR' },
																{
																	prim: 'PUSH',
																	args: [{ prim: 'mutez' }, { int: '0' }]
																},
																{ prim: 'DIG', args: [{ int: '2' }] },
																{ prim: 'DIG', args: [{ int: '4' }] },
																{ prim: 'DUP' },
																{ prim: 'DUG', args: [{ int: '5' }] },
																{ prim: 'CDR' },
																{ prim: 'CDR' },
																{ prim: 'CDR' },
																{ prim: 'CDR' },
																{ prim: 'CAR' },
																{ prim: 'PAIR' },
																{ prim: 'DIG', args: [{ int: '4' }] },
																{ prim: 'DUP' },
																{ prim: 'DUG', args: [{ int: '5' }] },
																{ prim: 'CDR' },
																{ prim: 'CDR' },
																{ prim: 'CDR' },
																{ prim: 'CAR' },
																{ prim: 'PAIR' },
																{ prim: 'DIG', args: [{ int: '4' }] },
																{ prim: 'DUP' },
																{ prim: 'DUG', args: [{ int: '5' }] },
																{ prim: 'CDR' },
																{ prim: 'CDR' },
																{ prim: 'CAR' },
																{ prim: 'PAIR' },
																{ prim: 'DIG', args: [{ int: '4' }] },
																{ prim: 'CDR' },
																{ prim: 'CAR' },
																{ prim: 'PAIR' },
																{ prim: 'TRANSFER_TOKENS' },
																{ prim: 'DIG', args: [{ int: '3' }] },
																{ prim: 'DIG', args: [{ int: '3' }] },
																{ prim: 'PAIR' },
																{ prim: 'DIG', args: [{ int: '2' }] },
																{ prim: 'PAIR' },
																{ prim: 'DIG', args: [{ int: '2' }] },
																{ prim: 'PAIR' },
																{ prim: 'NIL', args: [{ prim: 'operation' }] },
																{ prim: 'DIG', args: [{ int: '2' }] },
																{ prim: 'CONS' },
																{ prim: 'PAIR' }
															]
														]
													}
												],
												[
													{ prim: 'DIG', args: [{ int: '4' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '5' }] },
													{ prim: 'SENDER' },
													{ prim: 'COMPARE' },
													{ prim: 'EQ' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'ADD' },
													{ prim: 'PAIR' },
													{ prim: 'DIG', args: [{ int: '2' }] },
													{
														prim: 'NONE',
														args: [{ prim: 'ticket', args: [{ prim: 'nat' }] }]
													},
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'UPDATE' },
													{ prim: 'PAIR' },
													{ prim: 'SWAP' },
													{ prim: 'PAIR' },
													{ prim: 'NIL', args: [{ prim: 'operation' }] },
													{ prim: 'PAIR' }
												]
											]
										}
									],
									[
										{
											prim: 'IF_LEFT',
											args: [
												[
													{ prim: 'DIG', args: [{ int: '4' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '5' }] },
													{ prim: 'SENDER' },
													{ prim: 'COMPARE' },
													{ prim: 'EQ' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '4' }] },
													{ prim: 'TICKET' },
													{ prim: 'SOME' },
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '4' }] },
													{ prim: 'GET_AND_UPDATE' },
													{ prim: 'DROP' },
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '4' }] },
													{ prim: 'PAIR' },
													{ prim: 'SOME' },
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '4' }] },
													{ prim: 'UPDATE' },
													{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'ADD' },
													{ prim: 'PAIR' },
													{ prim: 'SWAP' },
													{ prim: 'PAIR' },
													{ prim: 'SWAP' },
													{ prim: 'PAIR' },
													{ prim: 'NIL', args: [{ prim: 'operation' }] },
													{ prim: 'PAIR' }
												],
												[
													{ prim: 'READ_TICKET' },
													{ prim: 'UNPAIR' },
													{ prim: 'DROP' },
													{ prim: 'UNPAIR' },
													{ prim: 'DROP' },
													{ prim: 'DIG', args: [{ int: '4' }] },
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'SOME' },
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'DUP' },
													{ prim: 'DUG', args: [{ int: '4' }] },
													{ prim: 'GET_AND_UPDATE' },
													{ prim: 'DROP' },
													{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'COMPARE' },
													{ prim: 'EQ' },
													{
														prim: 'IF',
														args: [
															[],
															[
																{
																	prim: 'PUSH',
																	args: [
																		{ prim: 'string' },
																		{ string: 'failed assertion' }
																	]
																},
																{ prim: 'FAILWITH' }
															]
														]
													},
													{ prim: 'DIG', args: [{ int: '2' }] },
													{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
													{ prim: 'DIG', args: [{ int: '3' }] },
													{ prim: 'ADD' },
													{ prim: 'PAIR' },
													{ prim: 'SWAP' },
													{ prim: 'PAIR' },
													{ prim: 'SWAP' },
													{ prim: 'PAIR' },
													{ prim: 'NIL', args: [{ prim: 'operation' }] },
													{ prim: 'PAIR' }
												]
											]
										}
									]
								]
							}
						],
						[
							{ prim: 'DIG', args: [{ int: '4' }] },
							{ prim: 'DUP' },
							{ prim: 'DUG', args: [{ int: '5' }] },
							{ prim: 'SENDER' },
							{ prim: 'COMPARE' },
							{ prim: 'EQ' },
							{
								prim: 'IF',
								args: [
									[],
									[
										{ prim: 'PUSH', args: [{ prim: 'string' }, { string: 'failed assertion' }] },
										{ prim: 'FAILWITH' }
									]
								]
							},
							{ prim: 'DIG', args: [{ int: '3' }] },
							{ prim: 'NONE', args: [{ prim: 'ticket', args: [{ prim: 'nat' }] }] },
							{ prim: 'DIG', args: [{ int: '2' }] },
							{ prim: 'DUP' },
							{ prim: 'DUG', args: [{ int: '3' }] },
							{ prim: 'CDR' },
							{ prim: 'GET_AND_UPDATE' },
							{
								prim: 'IF_NONE',
								args: [
									[
										{ prim: 'DROP', args: [{ int: '5' }] },
										{ prim: 'PUSH', args: [{ prim: 'string' }, { string: 'no tickets' }] },
										{ prim: 'FAILWITH' }
									],
									[
										{ prim: 'DIG', args: [{ int: '2' }] },
										{ prim: 'CAR' },
										{ prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
										{ prim: 'DIG', args: [{ int: '2' }] },
										{ prim: 'TRANSFER_TOKENS' },
										{ prim: 'DIG', args: [{ int: '3' }] },
										{ prim: 'DIG', args: [{ int: '3' }] },
										{ prim: 'PAIR' },
										{ prim: 'DIG', args: [{ int: '2' }] },
										{ prim: 'PAIR' },
										{ prim: 'DIG', args: [{ int: '2' }] },
										{ prim: 'PAIR' },
										{ prim: 'NIL', args: [{ prim: 'operation' }] },
										{ prim: 'DIG', args: [{ int: '2' }] },
										{ prim: 'CONS' },
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
