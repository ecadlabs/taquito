export const rpcContractResponse = {
	balance: '4',
	script: {
		code: [
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
											{ prim: 'nat', annots: [ '%buy_tickets' ] },
											{ prim: 'nat', annots: [ '%place_bet' ] }
										]
									},
									{
										prim: 'or',
										args: [
											{ prim: 'unit', annots: [ '%reset_pool' ] },
											{ prim: 'address', annots: [ '%update_oracle' ] }
										]
									}
								]
							},
							{
								prim: 'or',
								args: [
									{ prim: 'unit', annots: [ '%validate_pool' ] },
									{
										prim: 'pair',
										args: [ { prim: 'string' }, { prim: 'timestamp' }, { prim: 'nat' } ],
										annots: [ '%validate_pool_confirm' ]
									}
								]
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
							{
								prim: 'pair',
								args: [
									{
										prim: 'big_map',
										args: [ { prim: 'address' }, { prim: 'mutez' } ],
										annots: [ '%winners' ]
									},
									{
										prim: 'map',
										args: [ { prim: 'address' }, { prim: 'nat' } ],
										annots: [ '%bets' ]
									},
									{ prim: 'mutez', annots: [ '%current_pot' ] },
									{ prim: 'timestamp', annots: [ '%opened_at' ] },
									{
										prim: 'pair',
										args: [
											{ prim: 'string', annots: [ '%pool_type' ] },
											{ prim: 'mutez', annots: [ '%entrance_fee' ] },
											{ prim: 'mutez', annots: [ '%minimum_bet' ] },
											{ prim: 'int', annots: [ '%open_period' ] },
											{ prim: 'int', annots: [ '%validation_delay' ] },
											{ prim: 'int', annots: [ '%ticket_validity' ] },
											{ prim: 'nat', annots: [ '%max_capacity' ] }
										],
										annots: [ '%settings' ]
									},
									{ prim: 'option', args: [ { prim: 'address' } ], annots: [ '%validator' ] },
									{ prim: 'bool', annots: [ '%pending_validation' ] },
									{ prim: 'address', annots: [ '%oracle' ] },
									{ prim: 'address', annots: [ '%admin' ] }
								],
								annots: [ '%data' ]
							},
							{
								prim: 'big_map',
								args: [ { prim: 'address' }, { prim: 'ticket', args: [ { prim: 'timestamp' } ] } ],
								annots: [ '%tickets' ]
							}
						]
					}
				]
			},
			{
				prim: 'code',
				args: [
					[
						{
							prim: 'LAMBDA',
							args: [
								{
									prim: 'pair',
									args: [
										{
											prim: 'pair',
											args: [
												{ prim: 'big_map', args: [ { prim: 'address' }, { prim: 'mutez' } ] },
												{
													prim: 'pair',
													args: [
														{ prim: 'map', args: [ { prim: 'address' }, { prim: 'nat' } ] },
														{
															prim: 'pair',
															args: [
																{ prim: 'mutez' },
																{
																	prim: 'pair',
																	args: [
																		{ prim: 'timestamp' },
																		{
																			prim: 'pair',
																			args: [
																				{
																					prim: 'pair',
																					args: [
																						{ prim: 'string' },
																						{
																							prim: 'pair',
																							args: [
																								{ prim: 'mutez' },
																								{
																									prim: 'pair',
																									args: [
																										{
																											prim:
																												'mutez'
																										},
																										{
																											prim:
																												'pair',
																											args: [
																												{
																													prim:
																														'int'
																												},
																												{
																													prim:
																														'pair',
																													args: [
																														{
																															prim:
																																'int'
																														},
																														{
																															prim:
																																'pair',
																															args: [
																																{
																																	prim:
																																		'int'
																																},
																																{
																																	prim:
																																		'nat'
																																}
																															]
																														}
																													]
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
																					prim: 'pair',
																					args: [
																						{
																							prim: 'option',
																							args: [
																								{ prim: 'address' }
																							]
																						},
																						{
																							prim: 'pair',
																							args: [
																								{ prim: 'bool' },
																								{
																									prim: 'pair',
																									args: [
																										{
																											prim:
																												'address'
																										},
																										{
																											prim:
																												'address'
																										}
																									]
																								}
																							]
																						}
																					]
																				}
																			]
																		}
																	]
																}
															]
														}
													]
												}
											]
										},
										{ prim: 'address' }
									]
								},
								{ prim: 'operation' },
								[
									{ prim: 'UNPAIR' },
									{ prim: 'SWAP' },
									{
										prim: 'CONTRACT',
										args: [
											{
												prim: 'pair',
												args: [
													{ prim: 'string' },
													{ prim: 'pair', args: [ { prim: 'timestamp' }, { prim: 'nat' } ] }
												]
											}
										],
										annots: [ '%validate_pool_confirm' ]
									},
									{
										prim: 'IF_NONE',
										args: [
											[
												{
													prim: 'PUSH',
													args: [ { prim: 'string' }, { string: 'NO_CONTRACT' } ]
												},
												{ prim: 'FAILWITH' }
											],
											[]
										]
									},
									{ prim: 'SWAP' },
									{ prim: 'DUP' },
									{ prim: 'DUG', args: [ { int: '2' } ] },
									{ prim: 'CDR' },
									{ prim: 'CDR' },
									{ prim: 'CDR' },
									{ prim: 'CDR' },
									{ prim: 'CDR' },
									{ prim: 'CDR' },
									{ prim: 'CDR' },
									{ prim: 'CAR' },
									{
										prim: 'CONTRACT',
										args: [
											{
												prim: 'pair',
												args: [
													{ prim: 'string' },
													{
														prim: 'contract',
														args: [
															{
																prim: 'pair',
																args: [
																	{ prim: 'string' },
																	{
																		prim: 'pair',
																		args: [ { prim: 'timestamp' }, { prim: 'nat' } ]
																	}
																]
															}
														]
													}
												]
											}
										],
										annots: [ '%get' ]
									},
									{
										prim: 'IF_NONE',
										args: [
											[
												{ prim: 'PUSH', args: [ { prim: 'string' }, { string: 'NO_ORACLE' } ] },
												{ prim: 'FAILWITH' }
											],
											[]
										]
									},
									{ prim: 'PUSH', args: [ { prim: 'mutez' }, { int: '0' } ] },
									{ prim: 'DIG', args: [ { int: '2' } ] },
									{ prim: 'DIG', args: [ { int: '3' } ] },
									{ prim: 'CDR' },
									{ prim: 'CDR' },
									{ prim: 'CDR' },
									{ prim: 'CDR' },
									{ prim: 'CAR' },
									{ prim: 'CAR' },
									{ prim: 'PAIR' },
									{ prim: 'TRANSFER_TOKENS' }
								]
							]
						},
						{ prim: 'SWAP' },
						{ prim: 'UNPAIR' },
						{ prim: 'SWAP' },
						{ prim: 'UNPAIR' },
						{ prim: 'DIG', args: [ { int: '2' } ] },
						{
							prim: 'IF_LEFT',
							args: [
								[
									{
										prim: 'IF_LEFT',
										args: [
											[
												{ prim: 'DIG', args: [ { int: '3' } ] },
												{ prim: 'DROP' },
												{
													prim: 'IF_LEFT',
													args: [
														[
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'PUSH', args: [ { prim: 'nat' }, { int: '0' } ] },
															{ prim: 'DIG', args: [ { int: '3' } ] },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '4' } ] },
															{ prim: 'COMPARE' },
															{ prim: 'EQ' },
															{
																prim: 'IF',
																args: [
																	[
																		{ prim: 'DROP', args: [ { int: '3' } ] },
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'string' },
																				{ string: 'ZERO_TICKET_AMOUNT' }
																			]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[
																		{ prim: 'DUP' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'DIG', args: [ { int: '3' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '4' } ] },
																		{ prim: 'MUL' },
																		{ prim: 'AMOUNT' },
																		{ prim: 'COMPARE' },
																		{ prim: 'NEQ' },
																		{
																			prim: 'IF',
																			args: [
																				[
																					{
																						prim: 'DROP',
																						args: [ { int: '3' } ]
																					},
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'string' },
																							{
																								string:
																									'INCORRECT_AMOUNT'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[
																					{ prim: 'SWAP' },
																					{
																						prim: 'NONE',
																						args: [
																							{
																								prim: 'ticket',
																								args: [
																									{
																										prim:
																											'timestamp'
																									}
																								]
																							}
																						]
																					},
																					{ prim: 'SENDER' },
																					{ prim: 'GET_AND_UPDATE' },
																					{
																						prim: 'IF_NONE',
																						args: [
																							[
																								{
																									prim: 'DIG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'NOW' },
																								{ prim: 'TICKET' }
																							],
																							[
																								{
																									prim: 'DIG',
																									args: [
																										{ int: '3' }
																									]
																								},
																								{ prim: 'NOW' },
																								{ prim: 'TICKET' },
																								{ prim: 'PAIR' },
																								{
																									prim: 'JOIN_TICKETS'
																								},
																								{
																									prim: 'IF_NONE',
																									args: [
																										[
																											{
																												prim:
																													'PUSH',
																												args: [
																													{
																														prim:
																															'string'
																													},
																													{
																														string:
																															'UNJOIGNABLE_TICKETS'
																													}
																												]
																											},
																											{
																												prim:
																													'FAILWITH'
																											}
																										],
																										[]
																									]
																								}
																							]
																						]
																					},
																					{ prim: 'SOME' },
																					{ prim: 'SENDER' },
																					{ prim: 'GET_AND_UPDATE' },
																					{ prim: 'DROP' },
																					{ prim: 'SWAP' },
																					{ prim: 'PAIR' },
																					{
																						prim: 'NIL',
																						args: [ { prim: 'operation' } ]
																					},
																					{ prim: 'PAIR' }
																				]
																			]
																		}
																	]
																]
															}
														],
														[
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'SWAP' },
															{
																prim: 'NONE',
																args: [
																	{ prim: 'ticket', args: [ { prim: 'timestamp' } ] }
																]
															},
															{ prim: 'SENDER' },
															{ prim: 'GET_AND_UPDATE' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'string' },
																				{ string: 'NO_TICKET' }
																			]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[ { prim: 'READ_TICKET' }, { prim: 'PAIR' } ]
																]
															},
															{ prim: 'UNPAIR' },
															{ prim: 'SWAP' },
															{ prim: 'DROP' },
															{ prim: 'UNPAIR' },
															{ prim: 'DROP' },
															{ prim: 'UNPAIR' },
															{ prim: 'NOW' },
															{ prim: 'DIG', args: [ { int: '4' } ] },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '5' } ] },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CAR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CAR' },
															{ prim: 'DIG', args: [ { int: '2' } ] },
															{ prim: 'ADD' },
															{ prim: 'COMPARE' },
															{ prim: 'LT' },
															{
																prim: 'IF',
																args: [
																	[
																		{ prim: 'DROP', args: [ { int: '4' } ] },
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'string' },
																				{ string: 'INVALID_TICKET' }
																			]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '1' } ]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'COMPARE' },
																		{ prim: 'LT' },
																		{
																			prim: 'IF',
																			args: [
																				[
																					{
																						prim: 'DROP',
																						args: [ { int: '4' } ]
																					},
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'string' },
																							{
																								string:
																									'INVALID_TICKETS_AMOUNT'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[
																					{ prim: 'NOW' },
																					{
																						prim: 'DIG',
																						args: [ { int: '3' } ]
																					},
																					{ prim: 'DUP' },
																					{
																						prim: 'DUG',
																						args: [ { int: '4' } ]
																					},
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CAR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CAR' },
																					{
																						prim: 'DIG',
																						args: [ { int: '4' } ]
																					},
																					{ prim: 'DUP' },
																					{
																						prim: 'DUG',
																						args: [ { int: '5' } ]
																					},
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CAR' },
																					{ prim: 'ADD' },
																					{ prim: 'COMPARE' },
																					{ prim: 'LT' },
																					{
																						prim: 'IF',
																						args: [
																							[
																								{
																									prim: 'DROP',
																									args: [
																										{ int: '4' }
																									]
																								},
																								{
																									prim: 'PUSH',
																									args: [
																										{
																											prim:
																												'string'
																										},
																										{
																											string:
																												'NOT_OPEN'
																										}
																									]
																								},
																								{ prim: 'FAILWITH' }
																							],
																							[
																								{
																									prim: 'DIG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '3' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CAR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{
																									prim: 'DIG',
																									args: [
																										{ int: '3' }
																									]
																								},
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '4' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'CAR' },
																								{ prim: 'SIZE' },
																								{ prim: 'COMPARE' },
																								{ prim: 'GE' },
																								{
																									prim: 'IF',
																									args: [
																										[
																											{
																												prim:
																													'DROP',
																												args: [
																													{
																														int:
																															'4'
																													}
																												]
																											},
																											{
																												prim:
																													'PUSH',
																												args: [
																													{
																														prim:
																															'string'
																													},
																													{
																														string:
																															'MAXIMUM_CAPACITY'
																													}
																												]
																											},
																											{
																												prim:
																													'FAILWITH'
																											}
																										],
																										[
																											{
																												prim:
																													'SWAP'
																											},
																											{
																												prim:
																													'PUSH',
																												args: [
																													{
																														prim:
																															'nat'
																													},
																													{
																														int:
																															'1'
																													}
																												]
																											},
																											{
																												prim:
																													'DIG',
																												args: [
																													{
																														int:
																															'2'
																													}
																												]
																											},
																											{
																												prim:
																													'SUB'
																											},
																											{
																												prim:
																													'ABS'
																											},
																											{
																												prim:
																													'NOW'
																											},
																											{
																												prim:
																													'TICKET'
																											},
																											{
																												prim:
																													'SOME'
																											},
																											{
																												prim:
																													'SENDER'
																											},
																											{
																												prim:
																													'GET_AND_UPDATE'
																											},
																											{
																												prim:
																													'DROP'
																											},
																											{
																												prim:
																													'SWAP'
																											},
																											{
																												prim:
																													'DUP'
																											},
																											{
																												prim:
																													'DUG',
																												args: [
																													{
																														int:
																															'2'
																													}
																												]
																											},
																											{
																												prim:
																													'CDR'
																											},
																											{
																												prim:
																													'CDR'
																											},
																											{
																												prim:
																													'DIG',
																												args: [
																													{
																														int:
																															'2'
																													}
																												]
																											},
																											{
																												prim:
																													'DUP'
																											},
																											{
																												prim:
																													'DUG',
																												args: [
																													{
																														int:
																															'3'
																													}
																												]
																											},
																											{
																												prim:
																													'CDR'
																											},
																											{
																												prim:
																													'CAR'
																											},
																											{
																												prim:
																													'DIG',
																												args: [
																													{
																														int:
																															'4'
																													}
																												]
																											},
																											{
																												prim:
																													'SOME'
																											},
																											{
																												prim:
																													'SENDER'
																											},
																											{
																												prim:
																													'UPDATE'
																											},
																											{
																												prim:
																													'PAIR'
																											},
																											{
																												prim:
																													'DIG',
																												args: [
																													{
																														int:
																															'2'
																													}
																												]
																											},
																											{
																												prim:
																													'CAR'
																											},
																											{
																												prim:
																													'PAIR'
																											},
																											{
																												prim:
																													'PAIR'
																											}
																										]
																									]
																								}
																							]
																						]
																					}
																				]
																			]
																		}
																	]
																]
															},
															{ prim: 'NIL', args: [ { prim: 'operation' } ] },
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
															{ prim: 'DROP' },
															{ prim: 'DUP' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'SENDER' },
															{ prim: 'COMPARE' },
															{ prim: 'NEQ' },
															{
																prim: 'IF',
																args: [
																	[
																		{ prim: 'DROP', args: [ { int: '3' } ] },
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'string' },
																				{ string: 'UNAUTHORIZED_ACTION' }
																			]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[
																		{ prim: 'NOW' },
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'DIG', args: [ { int: '2' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '3' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'DIG', args: [ { int: '3' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '4' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'ADD' },
																		{ prim: 'ADD' },
																		{ prim: 'COMPARE' },
																		{ prim: 'GT' },
																		{
																			prim: 'IF',
																			args: [
																				[
																					{
																						prim: 'DROP',
																						args: [ { int: '3' } ]
																					},
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'string' },
																							{
																								string:
																									'TOO_EARLY_FOR_RESET'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[
																					{ prim: 'SELF_ADDRESS' },
																					{ prim: 'SWAP' },
																					{ prim: 'DUP' },
																					{
																						prim: 'DUG',
																						args: [ { int: '2' } ]
																					},
																					{ prim: 'PAIR' },
																					{
																						prim: 'DIG',
																						args: [ { int: '3' } ]
																					},
																					{ prim: 'SWAP' },
																					{ prim: 'EXEC' },
																					{
																						prim: 'DUG',
																						args: [ { int: '2' } ]
																					},
																					{ prim: 'PAIR' },
																					{
																						prim: 'NIL',
																						args: [ { prim: 'operation' } ]
																					},
																					{
																						prim: 'DIG',
																						args: [ { int: '2' } ]
																					},
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
															{ prim: 'DIG', args: [ { int: '3' } ] },
															{ prim: 'DROP' },
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'DUP' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'SENDER' },
															{ prim: 'COMPARE' },
															{ prim: 'NEQ' },
															{
																prim: 'IF',
																args: [
																	[
																		{ prim: 'DROP', args: [ { int: '3' } ] },
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'string' },
																				{ string: 'NOT_AN_ADMIN' }
																			]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'DIG', args: [ { int: '3' } ] },
																		{ prim: 'PAIR' },
																		{ prim: 'DIG', args: [ { int: '2' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '3' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'PAIR' },
																		{ prim: 'DIG', args: [ { int: '2' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '3' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'PAIR' },
																		{ prim: 'DIG', args: [ { int: '2' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '3' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'PAIR' },
																		{ prim: 'DIG', args: [ { int: '2' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '3' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'PAIR' },
																		{ prim: 'DIG', args: [ { int: '2' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '3' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'PAIR' },
																		{ prim: 'DIG', args: [ { int: '2' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '3' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'PAIR' },
																		{ prim: 'DIG', args: [ { int: '2' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'PAIR' },
																		{ prim: 'PAIR' }
																	]
																]
															},
															{ prim: 'NIL', args: [ { prim: 'operation' } ] },
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
												{ prim: 'DROP' },
												{ prim: 'DUP' },
												{ prim: 'CDR' },
												{ prim: 'CDR' },
												{ prim: 'CDR' },
												{ prim: 'CDR' },
												{ prim: 'CDR' },
												{ prim: 'CDR' },
												{ prim: 'CAR' },
												{
													prim: 'IF',
													args: [
														[
															{ prim: 'DROP', args: [ { int: '3' } ] },
															{
																prim: 'PUSH',
																args: [
																	{ prim: 'string' },
																	{ string: 'ACTIVE_PENDING_VALIDATION' }
																]
															},
															{ prim: 'FAILWITH' }
														],
														[
															{ prim: 'SELF_ADDRESS' },
															{ prim: 'SWAP' },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'PAIR' },
															{ prim: 'DIG', args: [ { int: '3' } ] },
															{ prim: 'SWAP' },
															{ prim: 'EXEC' },
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '3' } ] },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{
																prim: 'PUSH',
																args: [ { prim: 'bool' }, { prim: 'True' } ]
															},
															{ prim: 'PAIR' },
															{ prim: 'DIG', args: [ { int: '3' } ] },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '4' } ] },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CAR' },
															{ prim: 'PAIR' },
															{ prim: 'DIG', args: [ { int: '3' } ] },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '4' } ] },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CAR' },
															{ prim: 'PAIR' },
															{ prim: 'DIG', args: [ { int: '3' } ] },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '4' } ] },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CAR' },
															{ prim: 'PAIR' },
															{ prim: 'DIG', args: [ { int: '3' } ] },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '4' } ] },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CAR' },
															{ prim: 'PAIR' },
															{ prim: 'DIG', args: [ { int: '3' } ] },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '4' } ] },
															{ prim: 'CDR' },
															{ prim: 'CAR' },
															{ prim: 'PAIR' },
															{ prim: 'DIG', args: [ { int: '3' } ] },
															{ prim: 'CAR' },
															{ prim: 'PAIR' },
															{ prim: 'DUP' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'SENDER' },
															{ prim: 'SOME' },
															{ prim: 'PAIR' },
															{ prim: 'SWAP' },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CAR' },
															{ prim: 'PAIR' },
															{ prim: 'SWAP' },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CAR' },
															{ prim: 'PAIR' },
															{ prim: 'SWAP' },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CAR' },
															{ prim: 'PAIR' },
															{ prim: 'SWAP' },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'CDR' },
															{ prim: 'CAR' },
															{ prim: 'PAIR' },
															{ prim: 'SWAP' },
															{ prim: 'CAR' },
															{ prim: 'PAIR' },
															{ prim: 'PAIR' },
															{ prim: 'NIL', args: [ { prim: 'operation' } ] },
															{ prim: 'DIG', args: [ { int: '2' } ] },
															{ prim: 'CONS' },
															{ prim: 'PAIR' }
														]
													]
												}
											],
											[
												{ prim: 'DIG', args: [ { int: '3' } ] },
												{ prim: 'DROP' },
												{ prim: 'DUG', args: [ { int: '2' } ] },
												{ prim: 'DUP' },
												{ prim: 'CDR' },
												{ prim: 'CDR' },
												{ prim: 'CDR' },
												{ prim: 'CDR' },
												{ prim: 'CDR' },
												{ prim: 'CDR' },
												{ prim: 'CAR' },
												{ prim: 'NOT' },
												{
													prim: 'IF',
													args: [
														[
															{ prim: 'DROP', args: [ { int: '3' } ] },
															{
																prim: 'PUSH',
																args: [
																	{ prim: 'string' },
																	{ string: 'NO_PENDING_VALIDATION' }
																]
															},
															{ prim: 'FAILWITH' }
														],
														[
															{ prim: 'DUP' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CDR' },
															{ prim: 'CAR' },
															{ prim: 'SENDER' },
															{ prim: 'COMPARE' },
															{ prim: 'NEQ' },
															{
																prim: 'IF',
																args: [
																	[
																		{ prim: 'DROP', args: [ { int: '3' } ] },
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'string' },
																				{ string: 'UNAUTHORIZED_SENDER' }
																			]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[
																		{ prim: 'NOW' },
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'DIG', args: [ { int: '2' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '3' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'DIG', args: [ { int: '3' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '4' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CDR' },
																		{ prim: 'CAR' },
																		{ prim: 'ADD' },
																		{ prim: 'ADD' },
																		{ prim: 'COMPARE' },
																		{ prim: 'GT' },
																		{
																			prim: 'IF',
																			args: [
																				[
																					{
																						prim: 'DROP',
																						args: [ { int: '3' } ]
																					},
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'string' },
																							{
																								string:
																									'UNAVAILABLE_FOR_VALIDATION'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[
																					{
																						prim: 'DIG',
																						args: [ { int: '2' } ]
																					},
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'nat' },
																							{ int: '100' }
																						]
																					},
																					{ prim: 'SWAP' },
																					{ prim: 'DUP' },
																					{
																						prim: 'DUG',
																						args: [ { int: '2' } ]
																					},
																					{ prim: 'MUL' },
																					{
																						prim: 'DIG',
																						args: [ { int: '2' } ]
																					},
																					{ prim: 'DUP' },
																					{
																						prim: 'DUG',
																						args: [ { int: '3' } ]
																					},
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'PAIR' },
																					{
																						prim: 'DIG',
																						args: [ { int: '2' } ]
																					},
																					{ prim: 'DUP' },
																					{
																						prim: 'DUG',
																						args: [ { int: '3' } ]
																					},
																					{ prim: 'CDR' },
																					{ prim: 'CAR' },
																					{
																						prim: 'ITER',
																						args: [
																							[
																								{ prim: 'SWAP' },
																								{
																									prim: 'DIG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '3' }
																									]
																								},
																								{
																									prim: 'DIG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '3' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'COMPARE' },
																								{ prim: 'EQ' },
																								{
																									prim: 'IF',
																									args: [
																										[
																											{
																												prim:
																													'DROP'
																											},
																											{
																												prim:
																													'PUSH',
																												args: [
																													{
																														prim:
																															'nat'
																													},
																													{
																														int:
																															'0'
																													}
																												]
																											},
																											{
																												prim:
																													'SWAP'
																											},
																											{
																												prim:
																													'CAR'
																											},
																											{
																												prim:
																													'PAIR'
																											}
																										],
																										[
																											{
																												prim:
																													'DIG',
																												args: [
																													{
																														int:
																															'2'
																													}
																												]
																											},
																											{
																												prim:
																													'DUP'
																											},
																											{
																												prim:
																													'DUG',
																												args: [
																													{
																														int:
																															'3'
																													}
																												]
																											},
																											{
																												prim:
																													'DIG',
																												args: [
																													{
																														int:
																															'2'
																													}
																												]
																											},
																											{
																												prim:
																													'DUP'
																											},
																											{
																												prim:
																													'DUG',
																												args: [
																													{
																														int:
																															'3'
																													}
																												]
																											},
																											{
																												prim:
																													'CDR'
																											},
																											{
																												prim:
																													'COMPARE'
																											},
																											{
																												prim:
																													'GT'
																											},
																											{
																												prim:
																													'IF',
																												args: [
																													[
																														{
																															prim:
																																'DIG',
																															args: [
																																{
																																	int:
																																		'2'
																																}
																															]
																														},
																														{
																															prim:
																																'DUP'
																														},
																														{
																															prim:
																																'DUG',
																															args: [
																																{
																																	int:
																																		'3'
																																}
																															]
																														},
																														{
																															prim:
																																'DIG',
																															args: [
																																{
																																	int:
																																		'2'
																																}
																															]
																														},
																														{
																															prim:
																																'DUP'
																														},
																														{
																															prim:
																																'DUG',
																															args: [
																																{
																																	int:
																																		'3'
																																}
																															]
																														},
																														{
																															prim:
																																'CDR'
																														},
																														{
																															prim:
																																'SUB'
																														},
																														{
																															prim:
																																'ABS'
																														},
																														{
																															prim:
																																'SWAP'
																														},
																														{
																															prim:
																																'DUP'
																														},
																														{
																															prim:
																																'DUG',
																															args: [
																																{
																																	int:
																																		'2'
																																}
																															]
																														},
																														{
																															prim:
																																'CDR'
																														},
																														{
																															prim:
																																'SWAP'
																														},
																														{
																															prim:
																																'DUP'
																														},
																														{
																															prim:
																																'DUG',
																															args: [
																																{
																																	int:
																																		'2'
																																}
																															]
																														},
																														{
																															prim:
																																'COMPARE'
																														},
																														{
																															prim:
																																'LT'
																														},
																														{
																															prim:
																																'IF',
																															args: [
																																[
																																	{
																																		prim:
																																			'SWAP'
																																	},
																																	{
																																		prim:
																																			'DROP'
																																	},
																																	{
																																		prim:
																																			'SWAP'
																																	},
																																	{
																																		prim:
																																			'CAR'
																																	},
																																	{
																																		prim:
																																			'PAIR'
																																	}
																																],
																																[
																																	{
																																		prim:
																																			'DROP'
																																	},
																																	{
																																		prim:
																																			'SWAP'
																																	},
																																	{
																																		prim:
																																			'DROP'
																																	}
																																]
																															]
																														}
																													],
																													[
																														{
																															prim:
																																'SWAP'
																														},
																														{
																															prim:
																																'DUP'
																														},
																														{
																															prim:
																																'DUG',
																															args: [
																																{
																																	int:
																																		'2'
																																}
																															]
																														},
																														{
																															prim:
																																'CDR'
																														},
																														{
																															prim:
																																'DIG',
																															args: [
																																{
																																	int:
																																		'3'
																																}
																															]
																														},
																														{
																															prim:
																																'DUP'
																														},
																														{
																															prim:
																																'DUG',
																															args: [
																																{
																																	int:
																																		'4'
																																}
																															]
																														},
																														{
																															prim:
																																'SUB'
																														},
																														{
																															prim:
																																'ABS'
																														},
																														{
																															prim:
																																'SWAP'
																														},
																														{
																															prim:
																																'DUP'
																														},
																														{
																															prim:
																																'DUG',
																															args: [
																																{
																																	int:
																																		'2'
																																}
																															]
																														},
																														{
																															prim:
																																'CDR'
																														},
																														{
																															prim:
																																'SWAP'
																														},
																														{
																															prim:
																																'DUP'
																														},
																														{
																															prim:
																																'DUG',
																															args: [
																																{
																																	int:
																																		'2'
																																}
																															]
																														},
																														{
																															prim:
																																'COMPARE'
																														},
																														{
																															prim:
																																'LT'
																														},
																														{
																															prim:
																																'IF',
																															args: [
																																[
																																	{
																																		prim:
																																			'SWAP'
																																	},
																																	{
																																		prim:
																																			'DROP'
																																	},
																																	{
																																		prim:
																																			'SWAP'
																																	},
																																	{
																																		prim:
																																			'CAR'
																																	},
																																	{
																																		prim:
																																			'PAIR'
																																	}
																																],
																																[
																																	{
																																		prim:
																																			'DROP'
																																	},
																																	{
																																		prim:
																																			'SWAP'
																																	},
																																	{
																																		prim:
																																			'DROP'
																																	}
																																]
																															]
																														}
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
																					{ prim: 'SWAP' },
																					{ prim: 'DUP' },
																					{
																						prim: 'DUG',
																						args: [ { int: '2' } ]
																					},
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'CDR' },
																					{ prim: 'SWAP' },
																					{ prim: 'DUP' },
																					{
																						prim: 'DUG',
																						args: [ { int: '2' } ]
																					},
																					{ prim: 'CAR' },
																					{ prim: 'COMPARE' },
																					{ prim: 'EQ' },
																					{
																						prim: 'IF',
																						args: [
																							[
																								{ prim: 'DROP' },
																								{ prim: 'PAIR' }
																							],
																							[
																								{ prim: 'SWAP' },
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CAR' },
																								{ prim: 'SWAP' },
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CAR' },
																								{ prim: 'GET' },
																								{
																									prim: 'IF_NONE',
																									args: [
																										[
																											{
																												prim:
																													'SWAP'
																											},
																											{
																												prim:
																													'DUP'
																											},
																											{
																												prim:
																													'DUG',
																												args: [
																													{
																														int:
																															'2'
																													}
																												]
																											},
																											{
																												prim:
																													'CAR'
																											},
																											{
																												prim:
																													'DIG',
																												args: [
																													{
																														int:
																															'2'
																													}
																												]
																											},
																											{
																												prim:
																													'DUP'
																											},
																											{
																												prim:
																													'DUG',
																												args: [
																													{
																														int:
																															'3'
																													}
																												]
																											},
																											{
																												prim:
																													'CDR'
																											},
																											{
																												prim:
																													'CDR'
																											},
																											{
																												prim:
																													'CAR'
																											},
																											{
																												prim:
																													'DIG',
																												args: [
																													{
																														int:
																															'2'
																													}
																												]
																											},
																											{
																												prim:
																													'CAR'
																											},
																											{
																												prim:
																													'SWAP'
																											},
																											{
																												prim:
																													'SOME'
																											},
																											{
																												prim:
																													'SWAP'
																											},
																											{
																												prim:
																													'UPDATE'
																											}
																										],
																										[
																											{
																												prim:
																													'DIG',
																												args: [
																													{
																														int:
																															'2'
																													}
																												]
																											},
																											{
																												prim:
																													'DUP'
																											},
																											{
																												prim:
																													'DUG',
																												args: [
																													{
																														int:
																															'3'
																													}
																												]
																											},
																											{
																												prim:
																													'CAR'
																											},
																											{
																												prim:
																													'DIG',
																												args: [
																													{
																														int:
																															'3'
																													}
																												]
																											},
																											{
																												prim:
																													'DUP'
																											},
																											{
																												prim:
																													'DUG',
																												args: [
																													{
																														int:
																															'4'
																													}
																												]
																											},
																											{
																												prim:
																													'CDR'
																											},
																											{
																												prim:
																													'CDR'
																											},
																											{
																												prim:
																													'CAR'
																											},
																											{
																												prim:
																													'DIG',
																												args: [
																													{
																														int:
																															'2'
																													}
																												]
																											},
																											{
																												prim:
																													'ADD'
																											},
																											{
																												prim:
																													'SOME'
																											},
																											{
																												prim:
																													'DIG',
																												args: [
																													{
																														int:
																															'2'
																													}
																												]
																											},
																											{
																												prim:
																													'CAR'
																											},
																											{
																												prim:
																													'UPDATE'
																											}
																										]
																									]
																								},
																								{ prim: 'SWAP' },
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CAR' },
																								{
																									prim: 'IF_NONE',
																									args: [
																										[
																											{
																												prim:
																													'DIG',
																												args: [
																													{
																														int:
																															'2'
																													}
																												]
																											},
																											{
																												prim:
																													'NONE',
																												args: [
																													{
																														prim:
																															'ticket',
																														args: [
																															{
																																prim:
																																	'timestamp'
																															}
																														]
																													}
																												]
																											},
																											{
																												prim:
																													'PAIR'
																											}
																										],
																										[
																											{
																												prim:
																													'PUSH',
																												args: [
																													{
																														prim:
																															'nat'
																													},
																													{
																														int:
																															'1'
																													}
																												]
																											},
																											{
																												prim:
																													'NOW'
																											},
																											{
																												prim:
																													'TICKET'
																											},
																											{
																												prim:
																													'DIG',
																												args: [
																													{
																														int:
																															'4'
																													}
																												]
																											},
																											{
																												prim:
																													'NONE',
																												args: [
																													{
																														prim:
																															'ticket',
																														args: [
																															{
																																prim:
																																	'timestamp'
																															}
																														]
																													}
																												]
																											},
																											{
																												prim:
																													'DIG',
																												args: [
																													{
																														int:
																															'3'
																													}
																												]
																											},
																											{
																												prim:
																													'DUP'
																											},
																											{
																												prim:
																													'DUG',
																												args: [
																													{
																														int:
																															'4'
																													}
																												]
																											},
																											{
																												prim:
																													'GET_AND_UPDATE'
																											},
																											{
																												prim:
																													'IF_NONE',
																												args: [
																													[
																														{
																															prim:
																																'SWAP'
																														},
																														{
																															prim:
																																'SOME'
																														},
																														{
																															prim:
																																'DIG',
																															args: [
																																{
																																	int:
																																		'2'
																																}
																															]
																														},
																														{
																															prim:
																																'GET_AND_UPDATE'
																														},
																														{
																															prim:
																																'PAIR'
																														}
																													],
																													[
																														{
																															prim:
																																'DIG',
																															args: [
																																{
																																	int:
																																		'2'
																																}
																															]
																														},
																														{
																															prim:
																																'PAIR'
																														},
																														{
																															prim:
																																'JOIN_TICKETS'
																														},
																														{
																															prim:
																																'IF_NONE',
																															args: [
																																[
																																	{
																																		prim:
																																			'DROP',
																																		args: [
																																			{
																																				int:
																																					'2'
																																			}
																																		]
																																	},
																																	{
																																		prim:
																																			'PUSH',
																																		args: [
																																			{
																																				prim:
																																					'string'
																																			},
																																			{
																																				string:
																																					'UNJOIGNABLE_TICKETS'
																																			}
																																		]
																																	},
																																	{
																																		prim:
																																			'FAILWITH'
																																	}
																																],
																																[
																																	{
																																		prim:
																																			'SOME'
																																	},
																																	{
																																		prim:
																																			'DIG',
																																		args: [
																																			{
																																				int:
																																					'2'
																																			}
																																		]
																																	},
																																	{
																																		prim:
																																			'GET_AND_UPDATE'
																																	},
																																	{
																																		prim:
																																			'PAIR'
																																	}
																																]
																															]
																														}
																													]
																												]
																											}
																										]
																									]
																								},
																								{ prim: 'UNPAIR' },
																								{ prim: 'DROP' },
																								{
																									prim: 'DIG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CDR' },
																								{
																									prim: 'DIG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'PAIR' },
																								{ prim: 'DUP' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{
																									prim: 'PUSH',
																									args: [
																										{
																											prim:
																												'mutez'
																										},
																										{ int: '0' }
																									]
																								},
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
																								{ prim: 'DUP' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{
																									prim: 'PUSH',
																									args: [
																										{
																											prim: 'bool'
																										},
																										{
																											prim:
																												'False'
																										}
																									]
																								},
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
																								{ prim: 'DUP' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'NOW' },
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
																								{ prim: 'DUP' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{
																									prim: 'NONE',
																									args: [
																										{
																											prim:
																												'address'
																										}
																									]
																								},
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'CDR' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'DUP' },
																								{
																									prim: 'DUG',
																									args: [
																										{ int: '2' }
																									]
																								},
																								{ prim: 'CDR' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
																								{ prim: 'SWAP' },
																								{ prim: 'CAR' },
																								{ prim: 'PAIR' },
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
														]
													]
												},
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
		],
		storage: {
			prim: 'Pair',
			args: [
				{
					prim: 'Pair',
					args: [
						{ int: '24059' },
						[],
						{ int: '0' },
						{ string: '2019-09-09T12:09:37Z' },
						{
							prim: 'Pair',
							args: [
								{ string: 'XTZ-USD' },
								{ int: '2' },
								{ int: '2' },
								{ int: '86400' },
								{ int: '86400' },
								{ int: '2592000' },
								{ int: '9' }
							]
						},
						{ prim: 'None' },
						{ prim: 'False' },
						{ string: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb' },
						{ string: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb' }
					]
				},
				{ int: '24060' }
			]
		}
	}
};

export const storage = rpcContractResponse.script.code.find((x) => x.prim === 'storage')!.args[0] as any;

export const params = rpcContractResponse.script.code.find((x) => x.prim === 'parameter')!.args[0] as any;

export const bigMapValue = {
	prim: 'Pair',
	args: [ { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' }, { string: '2021-03-09T16:32:15Z' }, { int: '2' } ]
};
