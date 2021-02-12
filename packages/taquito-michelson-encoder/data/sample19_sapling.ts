export const rpcContractResponse = {
	balance: '0',
	script: {
		code: [
			{
				prim: 'parameter',
				args: [
					{
						prim: 'list',
						args: [
							{
								prim: 'pair',
								args: [
									{ prim: 'option', args: [ { prim: 'key_hash' } ], annots: [ '%key' ] },
									{ prim: 'sapling_transaction', args: [ { int: '8' } ], annots: [ '%transaction' ] }
								]
							}
						]
					}
				]
			},
			{ prim: 'storage', args: [ { prim: 'sapling_state', args: [ { int: '8' } ] } ] },
			{
				prim: 'code',
				args: [
					[
						{ prim: 'DUP' },
						{ prim: 'CDR' },
						{ prim: 'SWAP' },
						{ prim: 'CAR' },
						{ prim: 'DUP' },
						{ prim: 'NIL', args: [ { prim: 'operation' } ] },
						{ prim: 'SWAP' },
						{
							prim: 'ITER',
							args: [
								[
									{ prim: 'DIG', args: [ { int: '3' } ] },
									{ prim: 'SWAP' },
									{ prim: 'DUP' },
									{ prim: 'DUG', args: [ { int: '2' } ] },
									{ prim: 'CDR' },
									{ prim: 'SAPLING_VERIFY_UPDATE' },
									{
										prim: 'IF_NONE',
										args: [
											[
												{ prim: 'PUSH', args: [ { prim: 'int' }, { int: '10' } ] },
												{ prim: 'FAILWITH' }
											],
											[]
										]
									},
									{ prim: 'DUP' },
									{ prim: 'CDR' },
									{ prim: 'DUG', args: [ { int: '4' } ] },
									{ prim: 'DUP' },
									{ prim: 'CAR' },
									{ prim: 'DUP' },
									{ prim: 'ABS' },
									{ prim: 'PUSH', args: [ { prim: 'mutez' }, { int: '1' } ] },
									{ prim: 'MUL' },
									{ prim: 'PUSH', args: [ { prim: 'int' }, { int: '0' } ] },
									{ prim: 'DIG', args: [ { int: '2' } ] },
									{ prim: 'DUP' },
									{ prim: 'DUG', args: [ { int: '3' } ] },
									{ prim: 'COMPARE' },
									{ prim: 'GT' },
									{
										prim: 'IF',
										args: [
											[
												{ prim: 'SWAP' },
												{ prim: 'DROP' },
												{ prim: 'SWAP' },
												{ prim: 'DROP' },
												{ prim: 'DUG', args: [ { int: '2' } ] },
												{ prim: 'CAR' },
												{
													prim: 'IF_NONE',
													args: [
														[
															{ prim: 'PUSH', args: [ { prim: 'int' }, { int: '15' } ] },
															{ prim: 'FAILWITH' }
														],
														[]
													]
												},
												{ prim: 'IMPLICIT_ACCOUNT' },
												{ prim: 'DIG', args: [ { int: '2' } ] },
												{ prim: 'UNIT' },
												{ prim: 'TRANSFER_TOKENS' },
												{ prim: 'CONS' }
											],
											[
												{ prim: 'DIG', args: [ { int: '2' } ] },
												{ prim: 'DROP' },
												{ prim: 'DIG', args: [ { int: '2' } ] },
												{ prim: 'CAR' },
												{
													prim: 'IF_NONE',
													args: [
														[ { prim: 'SWAP' }, { prim: 'DROP' } ],
														[
															{
																prim: 'PUSH',
																args: [
																	{ prim: 'string' },
																	{
																		string:
																			'WrongCondition: ~ operation.key.is_some()'
																	}
																]
															},
															{ prim: 'FAILWITH' }
														]
													]
												},
												{ prim: 'AMOUNT' },
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
																	{
																		string:
																			'WrongCondition: sp.amount == amount_tez.value'
																	}
																]
															},
															{ prim: 'FAILWITH' }
														]
													]
												}
											]
										]
									}
								]
							]
						},
						{ prim: 'SWAP' },
						{ prim: 'DROP' },
						{ prim: 'NIL', args: [ { prim: 'operation' } ] },
						{ prim: 'SWAP' },
						{ prim: 'ITER', args: [ [ { prim: 'CONS' } ] ] },
						{ prim: 'PAIR' }
					]
				]
			}
		],
		storage: { int: '14' }
	}
};

export const storage = rpcContractResponse.script.code.find((x) => x.prim === 'storage')!.args[0] as any;

export const params = rpcContractResponse.script.code.find((x) => x.prim === 'parameter')!.args[0] as any;

export const rpcContractResponse2 = {
	balance: '0',
	script: {
		code: [
			{
				prim: 'parameter',
				args: [
					{
						prim: 'or',
						args: [
							{
								prim: 'list',
								args: [
									{
										prim: 'pair',
										args: [
											{
												prim: 'sapling_transaction',
												args: [ { int: '8' } ],
												annots: [ '%transaction' ]
											},
											{ prim: 'option', args: [ { prim: 'key_hash' } ], annots: [ '%key' ] }
										]
									}
								],
								annots: [ '%__entry_00__' ]
							},
							{
								prim: 'list',
								args: [
									{
										prim: 'pair',
										args: [
											{
												prim: 'sapling_transaction',
												args: [ { int: '8' } ],
												annots: [ '%transaction' ]
											},
											{ prim: 'option', args: [ { prim: 'key_hash' } ], annots: [ '%key' ] }
										]
									}
								],
								annots: [ '%__entry_01__' ]
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
							{ prim: 'mutez', annots: [ '%balance' ] },
							{ prim: 'sapling_state', args: [ { int: '8' } ], annots: [ '%ledger1' ] },
							{ prim: 'sapling_state', args: [ { int: '8' } ], annots: [ '%ledger2' ] }
						]
					}
				]
			},
			{
				prim: 'code',
				args: [
					[
						{ prim: 'DUP' },
						{ prim: 'CDR' },
						{ prim: 'SWAP' },
						{ prim: 'CAR' },
						{
							prim: 'IF_LEFT',
							args: [
								[
									{ prim: 'DUP' },
									{ prim: 'NIL', args: [ { prim: 'operation' } ] },
									{ prim: 'SWAP' },
									{
										prim: 'ITER',
										args: [
											[
												{ prim: 'DIG', args: [ { int: '3' } ] },
												{ prim: 'DUP' },
												{ prim: 'DUG', args: [ { int: '4' } ] },
												{ prim: 'CDR' },
												{ prim: 'CAR' },
												{ prim: 'SWAP' },
												{ prim: 'DUP' },
												{ prim: 'DUG', args: [ { int: '2' } ] },
												{ prim: 'CAR' },
												{ prim: 'SAPLING_VERIFY_UPDATE' },
												{
													prim: 'IF_NONE',
													args: [
														[
															{ prim: 'PUSH', args: [ { prim: 'int' }, { int: '12' } ] },
															{ prim: 'FAILWITH' }
														],
														[]
													]
												},
												{ prim: 'DIG', args: [ { int: '4' } ] },
												{ prim: 'DUP' },
												{ prim: 'CAR' },
												{ prim: 'SWAP' },
												{ prim: 'CDR' },
												{ prim: 'CDR' },
												{ prim: 'DIG', args: [ { int: '2' } ] },
												{ prim: 'DUP' },
												{ prim: 'DUG', args: [ { int: '3' } ] },
												{ prim: 'CDR' },
												{ prim: 'PAIR' },
												{ prim: 'SWAP' },
												{ prim: 'PAIR' },
												{ prim: 'DUG', args: [ { int: '4' } ] },
												{ prim: 'DUP' },
												{ prim: 'CAR' },
												{ prim: 'DUP' },
												{ prim: 'ABS' },
												{ prim: 'PUSH', args: [ { prim: 'mutez' }, { int: '1' } ] },
												{ prim: 'MUL' },
												{ prim: 'DIG', args: [ { int: '6' } ] },
												{ prim: 'CDR' },
												{ prim: 'SWAP' },
												{ prim: 'DUP' },
												{ prim: 'DUG', args: [ { int: '2' } ] },
												{ prim: 'PAIR' },
												{ prim: 'DUG', args: [ { int: '6' } ] },
												{ prim: 'PUSH', args: [ { prim: 'int' }, { int: '0' } ] },
												{ prim: 'DIG', args: [ { int: '2' } ] },
												{ prim: 'DUP' },
												{ prim: 'DUG', args: [ { int: '3' } ] },
												{ prim: 'COMPARE' },
												{ prim: 'GT' },
												{
													prim: 'IF',
													args: [
														[
															{ prim: 'SWAP' },
															{ prim: 'DROP' },
															{ prim: 'SWAP' },
															{ prim: 'DROP' },
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'CDR' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '18' } ]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[]
																]
															},
															{ prim: 'IMPLICIT_ACCOUNT' },
															{ prim: 'DIG', args: [ { int: '2' } ] },
															{ prim: 'UNIT' },
															{ prim: 'TRANSFER_TOKENS' },
															{ prim: 'CONS' }
														],
														[
															{ prim: 'DIG', args: [ { int: '2' } ] },
															{ prim: 'DROP' },
															{ prim: 'DIG', args: [ { int: '2' } ] },
															{ prim: 'CDR' },
															{
																prim: 'IF_NONE',
																args: [
																	[ { prim: 'SWAP' }, { prim: 'DROP' } ],
																	[
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'string' },
																				{
																					string:
																						'WrongCondition: ~ operation.key.is_some()'
																				}
																			]
																		},
																		{ prim: 'FAILWITH' }
																	]
																]
															},
															{ prim: 'AMOUNT' },
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
																				{
																					string:
																						'WrongCondition: sp.amount == amount_tez.value'
																				}
																			]
																		},
																		{ prim: 'FAILWITH' }
																	]
																]
															}
														]
													]
												}
											]
										]
									},
									{ prim: 'SWAP' },
									{ prim: 'DROP' }
								],
								[
									{ prim: 'DUP' },
									{ prim: 'NIL', args: [ { prim: 'operation' } ] },
									{ prim: 'SWAP' },
									{
										prim: 'ITER',
										args: [
											[
												{ prim: 'DIG', args: [ { int: '3' } ] },
												{ prim: 'DUP' },
												{ prim: 'DUG', args: [ { int: '4' } ] },
												{ prim: 'CDR' },
												{ prim: 'CDR' },
												{ prim: 'SWAP' },
												{ prim: 'DUP' },
												{ prim: 'DUG', args: [ { int: '2' } ] },
												{ prim: 'CAR' },
												{ prim: 'SAPLING_VERIFY_UPDATE' },
												{
													prim: 'IF_NONE',
													args: [
														[
															{ prim: 'PUSH', args: [ { prim: 'int' }, { int: '28' } ] },
															{ prim: 'FAILWITH' }
														],
														[]
													]
												},
												{ prim: 'DIG', args: [ { int: '4' } ] },
												{ prim: 'DUP' },
												{ prim: 'CAR' },
												{ prim: 'SWAP' },
												{ prim: 'CDR' },
												{ prim: 'CAR' },
												{ prim: 'DIG', args: [ { int: '2' } ] },
												{ prim: 'DUP' },
												{ prim: 'DUG', args: [ { int: '3' } ] },
												{ prim: 'CDR' },
												{ prim: 'SWAP' },
												{ prim: 'PAIR' },
												{ prim: 'SWAP' },
												{ prim: 'PAIR' },
												{ prim: 'DUG', args: [ { int: '4' } ] },
												{ prim: 'DUP' },
												{ prim: 'CAR' },
												{ prim: 'DUP' },
												{ prim: 'ABS' },
												{ prim: 'PUSH', args: [ { prim: 'mutez' }, { int: '1' } ] },
												{ prim: 'MUL' },
												{ prim: 'DIG', args: [ { int: '6' } ] },
												{ prim: 'CDR' },
												{ prim: 'SWAP' },
												{ prim: 'DUP' },
												{ prim: 'DUG', args: [ { int: '2' } ] },
												{ prim: 'PAIR' },
												{ prim: 'DUG', args: [ { int: '6' } ] },
												{ prim: 'PUSH', args: [ { prim: 'int' }, { int: '0' } ] },
												{ prim: 'DIG', args: [ { int: '2' } ] },
												{ prim: 'DUP' },
												{ prim: 'DUG', args: [ { int: '3' } ] },
												{ prim: 'COMPARE' },
												{ prim: 'GT' },
												{
													prim: 'IF',
													args: [
														[
															{ prim: 'SWAP' },
															{ prim: 'DROP' },
															{ prim: 'SWAP' },
															{ prim: 'DROP' },
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'CDR' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '34' } ]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[]
																]
															},
															{ prim: 'IMPLICIT_ACCOUNT' },
															{ prim: 'DIG', args: [ { int: '2' } ] },
															{ prim: 'UNIT' },
															{ prim: 'TRANSFER_TOKENS' },
															{ prim: 'CONS' }
														],
														[
															{ prim: 'DIG', args: [ { int: '2' } ] },
															{ prim: 'DROP' },
															{ prim: 'DIG', args: [ { int: '2' } ] },
															{ prim: 'CDR' },
															{
																prim: 'IF_NONE',
																args: [
																	[ { prim: 'SWAP' }, { prim: 'DROP' } ],
																	[
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'string' },
																				{
																					string:
																						'WrongCondition: ~ operation.key.is_some()'
																				}
																			]
																		},
																		{ prim: 'FAILWITH' }
																	]
																]
															},
															{ prim: 'AMOUNT' },
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
																				{
																					string:
																						'WrongCondition: sp.amount == amount_tez.value'
																				}
																			]
																		},
																		{ prim: 'FAILWITH' }
																	]
																]
															}
														]
													]
												}
											]
										]
									},
									{ prim: 'SWAP' },
									{ prim: 'DROP' }
								]
							]
						},
						{ prim: 'NIL', args: [ { prim: 'operation' } ] },
						{ prim: 'SWAP' },
						{ prim: 'ITER', args: [ [ { prim: 'CONS' } ] ] },
						{ prim: 'PAIR' }
					]
				]
			}
		],
		storage: { prim: 'Pair', args: [ { int: '0' }, { int: '17' }, { int: '18' } ] }
	}
};

export const storage2 = rpcContractResponse2.script.code.find((x) => x.prim === 'storage')!.args[0] as any;

export const params2 = rpcContractResponse2.script.code.find((x) => x.prim === 'parameter')!.args[0] as any;

// KT1NQh57yhVyT9cKhvjjaSmZ9YHZgwkAhJsB
export const rpcContractResponse3 = {
	balance: '0',
	script: {
		code: [
			{
				prim: 'parameter',
				args: [
					{
						prim: 'list',
						args: [
							{
								prim: 'pair',
								args: [
									{ prim: 'sapling_transaction', args: [ { int: '8' } ] },
									{ prim: 'option', args: [ { prim: 'key_hash' } ] }
								]
							}
						]
					}
				]
			},
			{ prim: 'storage', args: [ { prim: 'sapling_state', args: [ { int: '8' } ] } ] },
			{
				prim: 'code',
				args: [
					[
						{ prim: 'UNPAIR' },
						{ prim: 'NIL', args: [ { prim: 'operation' } ] },
						{ prim: 'SWAP' },
						{ prim: 'DIP', args: [ [ { prim: 'SWAP' } ] ] },
						{ prim: 'AMOUNT' },
						{ prim: 'SWAP' },
						{ prim: 'DIP', args: [ [ { prim: 'SWAP' } ] ] },
						{
							prim: 'ITER',
							args: [
								[
									{ prim: 'UNPAIR' },
									{ prim: 'DIP', args: [ [ { prim: 'SWAP' } ] ] },
									{ prim: 'SAPLING_VERIFY_UPDATE' },
									[
										{
											prim: 'IF_NONE',
											args: [ [ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ] ], [] ]
										}
									],
									{ prim: 'UNPAIR' },
									{ prim: 'DUP' },
									{
										prim: 'DIP',
										args: [
											[
												{ prim: 'ABS' },
												{ prim: 'PUSH', args: [ { prim: 'mutez' }, { int: '1' } ] },
												{ prim: 'MUL' }
											]
										]
									},
									[
										{ prim: 'GT' },
										{
											prim: 'IF',
											args: [
												[
													{
														prim: 'DIP',
														args: [
															{ int: '2' },
															[
																[
																	{
																		prim: 'IF_NONE',
																		args: [
																			[
																				[
																					{ prim: 'UNIT' },
																					{ prim: 'FAILWITH' }
																				]
																			],
																			[]
																		]
																	}
																],
																{ prim: 'IMPLICIT_ACCOUNT' }
															]
														]
													},
													{ prim: 'SWAP' },
													{
														prim: 'DIP',
														args: [
															[
																{ prim: 'UNIT' },
																{ prim: 'TRANSFER_TOKENS' },
																{ prim: 'SWAP' },
																{ prim: 'DIP', args: [ [ { prim: 'CONS' } ] ] }
															]
														]
													}
												],
												[
													{ prim: 'DIP', args: [ { int: '2' }, [ { prim: 'SWAP' } ] ] },
													{ prim: 'DIP', args: [ [ { prim: 'SWAP' } ] ] },
													{ prim: 'SWAP' },
													{ prim: 'SUB' },
													{
														prim: 'DIP',
														args: [
															{ int: '2' },
															[
																[
																	{
																		prim: 'IF_NONE',
																		args: [
																			[],
																			[
																				[
																					{ prim: 'UNIT' },
																					{ prim: 'FAILWITH' }
																				]
																			]
																		]
																	}
																]
															]
														]
													},
													{ prim: 'SWAP' }
												]
											]
										}
									]
								]
							]
						},
						{
							prim: 'DIP',
							args: [
								[
									{ prim: 'PUSH', args: [ { prim: 'mutez' }, { int: '0' } ] },
									[
										[ { prim: 'COMPARE' }, { prim: 'EQ' } ],
										{ prim: 'IF', args: [ [], [ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ] ] ] }
									]
								]
							]
						},
						{ prim: 'SWAP' },
						{ prim: 'PAIR' }
					]
				]
			}
		],
		storage: { int: '53' }
	}
};

export const storage3 = rpcContractResponse3.script.code.find((x) => x.prim === 'storage')!.args[0] as any;

export const params3 = rpcContractResponse3.script.code.find((x) => x.prim === 'parameter')!.args[0] as any;

// KT1P7WdaJCnyyz83oBrHrFUPsxeVawGy4TSB
export const rpcContractResponse4 = {
	balance: '0',
	script: {
		code: [
			{
				prim: 'parameter',
				args: [
					{
						prim: 'pair',
						args: [
							{ prim: 'bool' },
							{ prim: 'sapling_transaction', args: [ { int: '8' } ], annots: [ ':left' ] },
							{ prim: 'sapling_transaction', args: [ { int: '8' } ], annots: [ ':right' ] }
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
							{ prim: 'sapling_state', args: [ { int: '8' } ], annots: [ ':left' ] },
							{ prim: 'sapling_state', args: [ { int: '8' } ], annots: [ ':right' ] }
						]
					}
				]
			},
			{
				prim: 'code',
				args: [
					[
						{ prim: 'UNPAIR' },
						{ prim: 'UNPAIR' },
						{ prim: 'DIP', args: [ [ { prim: 'UNPAIR' } ] ] },
						{ prim: 'DIP', args: [ { int: '3' }, [ { prim: 'UNPAIR' } ] ] },
						{ prim: 'DIP', args: [ { int: '2' }, [ { prim: 'SWAP' } ] ] },
						{
							prim: 'IF',
							args: [
								[
									{ prim: 'SAPLING_VERIFY_UPDATE' },
									[
										{
											prim: 'IF_NONE',
											args: [ [ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ] ], [] ]
										}
									],
									{ prim: 'UNPAIR' },
									{ prim: 'DROP' },
									{
										prim: 'DIP',
										args: [
											[
												{ prim: 'DIP', args: [ [ { prim: 'DUP' } ] ] },
												{ prim: 'SAPLING_VERIFY_UPDATE' },
												[
													{
														prim: 'IF_NONE',
														args: [ [ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ] ], [] ]
													}
												],
												{ prim: 'UNPAIR' },
												{ prim: 'DROP' },
												{ prim: 'DROP' }
											]
										]
									}
								],
								[
									{ prim: 'DIP', args: [ [ { prim: 'DUP' } ] ] },
									{ prim: 'SAPLING_VERIFY_UPDATE' },
									[
										{
											prim: 'IF_NONE',
											args: [ [ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ] ], [] ]
										}
									],
									{ prim: 'UNPAIR' },
									{ prim: 'DROP' },
									{ prim: 'DROP' },
									{
										prim: 'DIP',
										args: [
											[
												{ prim: 'SAPLING_VERIFY_UPDATE' },
												[
													{
														prim: 'IF_NONE',
														args: [ [ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ] ], [] ]
													}
												],
												{ prim: 'UNPAIR' },
												{ prim: 'DROP' }
											]
										]
									}
								]
							]
						},
						{ prim: 'PAIR' },
						{ prim: 'NIL', args: [ { prim: 'operation' } ] },
						{ prim: 'PAIR' }
					]
				]
			}
		],
		storage: { prim: 'Pair', args: [ { int: '54' }, { int: '55' } ] }
	}
};

export const storage4 = rpcContractResponse4.script.code.find((x) => x.prim === 'storage')!.args[0] as any;

export const params4 = rpcContractResponse4.script.code.find((x) => x.prim === 'parameter')!.args[0] as any;

// KT1R11DJKeYmt7Wzu21fQPeYdByyPWLbDqyF
export const rpcContractResponse5 = {
	balance: '0',
	script: {
		code: [
			{
				prim: 'parameter',
				args: [ { prim: 'list', args: [ { prim: 'sapling_transaction', args: [ { int: '8' } ] } ] } ]
			},
			{ prim: 'storage', args: [ { prim: 'unit' } ] },
			{
				prim: 'code',
				args: [
					[
						{ prim: 'UNPAIR' },
						{ prim: 'SAPLING_EMPTY_STATE', args: [ { int: '8' } ] },
						{ prim: 'SWAP' },
						{
							prim: 'ITER',
							args: [
								[
									{ prim: 'SAPLING_VERIFY_UPDATE' },
									[
										{
											prim: 'IF_NONE',
											args: [ [ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ] ], [] ]
										}
									],
									{ prim: 'UNPAIR' },
									{ prim: 'DROP' }
								]
							]
						},
						{ prim: 'DROP' },
						{ prim: 'NIL', args: [ { prim: 'operation' } ] },
						{ prim: 'PAIR' }
					]
				]
			}
		],
		storage: { prim: 'Unit' }
	}
};

export const storage5 = rpcContractResponse5.script.code.find((x) => x.prim === 'storage')!.args[0] as any;

export const params5 = rpcContractResponse5.script.code.find((x) => x.prim === 'parameter')!.args[0] as any;

// KT1GZBKBSaDDEkEH4xreMJH3oSfjsqRn8MTL
export const rpcContractResponse6 = {
	balance: '0',
	script: {
		code: [
			{
				prim: 'parameter',
				args: [
					{
						prim: 'pair',
						args: [
							{
								prim: 'contract',
								args: [
									{
										prim: 'or',
										args: [
											{ prim: 'sapling_transaction', args: [ { int: '8' } ] },
											{ prim: 'sapling_state', args: [ { int: '8' } ] }
										]
									}
								]
							},
							{ prim: 'sapling_transaction', args: [ { int: '8' } ] }
						]
					}
				]
			},
			{ prim: 'storage', args: [ { prim: 'unit' } ] },
			{
				prim: 'code',
				args: [
					[
						{ prim: 'UNPAIR' },
						{ prim: 'UNPAIR' },
						{ prim: 'SWAP' },
						{ prim: 'SAPLING_EMPTY_STATE', args: [ { int: '8' } ] },
						{ prim: 'SWAP' },
						{ prim: 'SAPLING_VERIFY_UPDATE' },
						[ { prim: 'IF_NONE', args: [ [ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ] ], [] ] } ],
						{ prim: 'UNPAIR' },
						{ prim: 'DROP' },
						{ prim: 'PUSH', args: [ { prim: 'mutez' }, { int: '0' } ] },
						{ prim: 'SWAP' },
						{ prim: 'RIGHT', args: [ { prim: 'sapling_transaction', args: [ { int: '8' } ] } ] },
						{ prim: 'TRANSFER_TOKENS' },
						{ prim: 'NIL', args: [ { prim: 'operation' } ] },
						{ prim: 'SWAP' },
						{ prim: 'CONS' },
						{ prim: 'PAIR' }
					]
				]
			}
		],
		storage: { prim: 'Unit' }
	}
};

export const storage6 = rpcContractResponse6.script.code.find((x) => x.prim === 'storage')!.args[0] as any;

export const params6 = rpcContractResponse6.script.code.find((x) => x.prim === 'parameter')!.args[0] as any;

// KT1XpFASuiYhShqteQ4QjSfR21ERq2R3ZfrH
export const rpcContractResponse7 = {
	balance: '0',
	script: {
		code: [
			{
				prim: 'parameter',
				args: [
					{
						prim: 'or',
						args: [
							{ prim: 'sapling_transaction', args: [ { int: '8' } ] },
							{ prim: 'sapling_state', args: [ { int: '8' } ] }
						]
					}
				]
			},
			{
				prim: 'storage',
				args: [ { prim: 'option', args: [ { prim: 'sapling_transaction', args: [ { int: '8' } ] } ] } ]
			},
			{
				prim: 'code',
				args: [
					[
						{ prim: 'UNPAIR' },
						{
							prim: 'IF_LEFT',
							args: [
								[ { prim: 'DIP', args: [ [ { prim: 'DROP' } ] ] }, { prim: 'SOME' } ],
								[
									{
										prim: 'DIP',
										args: [
											[
												[
													{
														prim: 'IF_NONE',
														args: [ [ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ] ], [] ]
													}
												]
											]
										]
									},
									{ prim: 'SWAP' },
									{ prim: 'SAPLING_VERIFY_UPDATE' },
									[
										{
											prim: 'IF_NONE',
											args: [ [ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ] ], [] ]
										}
									],
									{ prim: 'DROP' },
									{ prim: 'NONE', args: [ { prim: 'sapling_transaction', args: [ { int: '8' } ] } ] }
								]
							]
						},
						{ prim: 'NIL', args: [ { prim: 'operation' } ] },
						{ prim: 'PAIR' }
					]
				]
			}
		],
		storage: { prim: 'None' }
	}
};

export const storage7 = rpcContractResponse7.script.code.find((x) => x.prim === 'storage')!.args[0] as any;

export const params7 = rpcContractResponse7.script.code.find((x) => x.prim === 'parameter')!.args[0] as any;

// KT1KnF4vZMgTRgy9hniwV9pYpPj4b7HEV8fU
export const rpcContractResponse8 = {
	balance: '0',
	script: {
		code: [
			{
				prim: 'parameter',
				args: [
					{
						prim: 'pair',
						args: [
							{ prim: 'sapling_transaction', args: [ { int: '8' } ] },
							{ prim: 'sapling_state', args: [ { int: '8' } ] }
						]
					}
				]
			},
			{ prim: 'storage', args: [ { prim: 'sapling_state', args: [ { int: '8' } ] } ] },
			{
				prim: 'code',
				args: [
					[
						{ prim: 'UNPAIR' },
						{ prim: 'UNPAIR' },
						{ prim: 'DIP', args: [ { int: '2' }, [ { prim: 'DROP' } ] ] },
						{ prim: 'SAPLING_VERIFY_UPDATE' },
						[ { prim: 'IF_NONE', args: [ [ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ] ], [] ] } ],
						{ prim: 'UNPAIR' },
						{ prim: 'DROP' },
						{ prim: 'NIL', args: [ { prim: 'operation' } ] },
						{ prim: 'PAIR' }
					]
				]
			}
		],
		storage: { int: '56' }
	}
};

export const storage8 = rpcContractResponse8.script.code.find((x) => x.prim === 'storage')!.args[0] as any;

export const params8 = rpcContractResponse8.script.code.find((x) => x.prim === 'parameter')!.args[0] as any;
