export const rpcContractResponse = {
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
								prim: 'or',
								args: [
									{
										prim: 'or',
										args: [
											{
												prim: 'pair',
												args: [
													{ prim: 'nat', annots: [ '%_auctionId' ] },
													{ prim: 'address', annots: [ '%_club' ] },
													{ prim: 'nat', annots: [ '%clubFee' ] }
												],
												annots: [ '%acceptAuction' ]
											},
											{
												prim: 'or',
												args: [
													{ prim: 'nat', annots: [ '%bid' ] },
													{
														prim: 'pair',
														args: [
															{ prim: 'address', annots: [ '%club' ] },
															{ prim: 'nat', annots: [ '%id' ] }
														],
														annots: [ '%buyNFT' ]
													}
												]
											}
										]
									},
									{
										prim: 'or',
										args: [
											{ prim: 'address', annots: [ '%cancelFanClub' ] },
											{
												prim: 'or',
												args: [
													{ prim: 'nat', annots: [ '%cancelSelling' ] },
													{
														prim: 'pair',
														args: [
															{ prim: 'nat', annots: [ '%_assetId' ] },
															{ prim: 'int', annots: [ '%_duration' ] },
															{ prim: 'int', annots: [ '%_startPrice' ] }
														],
														annots: [ '%createAuction' ]
													}
												]
											}
										]
									}
								]
							},
							{
								prim: 'or',
								args: [
									{
										prim: 'or',
										args: [
											{ prim: 'unit', annots: [ '%pauseContract' ] },
											{
												prim: 'or',
												args: [
													{
														prim: 'pair',
														args: [
															{ prim: 'nat', annots: [ '%clubFee' ] },
															{ prim: 'nat', annots: [ '%id' ] },
															{ prim: 'nat', annots: [ '%price' ] }
														],
														annots: [ '%putToSell' ]
													},
													{ prim: 'address', annots: [ '%registerFanClub' ] }
												]
											}
										]
									},
									{
										prim: 'or',
										args: [
											{ prim: 'address', annots: [ '%transferAdmin' ] },
											{
												prim: 'or',
												args: [
													{ prim: 'unit', annots: [ '%unpauseContract' ] },
													{ prim: 'address', annots: [ '%updateEuranov' ] }
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
				prim: 'storage',
				args: [
					{
						prim: 'pair',
						args: [
							{
								prim: 'pair',
								args: [
									{
										prim: 'pair',
										args: [
											{ prim: 'address', annots: [ '%_euranov' ] },
											{ prim: 'address', annots: [ '%admin' ] }
										]
									},
									{
										prim: 'big_map',
										args: [
											{ prim: 'address' },
											{
												prim: 'map',
												args: [
													{ prim: 'nat' },
													{
														prim: 'pair',
														args: [
															{
																prim: 'pair',
																args: [
																	{
																		prim: 'pair',
																		args: [
																			{ prim: 'nat', annots: [ '%assetId' ] },
																			{ prim: 'nat', annots: [ '%bidCount' ] }
																		]
																	},
																	{ prim: 'bool', annots: [ '%claimed' ] },
																	{ prim: 'address', annots: [ '%creator' ] }
																]
															},
															{
																prim: 'pair',
																args: [
																	{ prim: 'mutez', annots: [ '%currentBidAmount' ] },
																	{ prim: 'address', annots: [ '%currentBidOwner' ] }
																]
															},
															{ prim: 'int', annots: [ '%duration' ] },
															{ prim: 'timestamp', annots: [ '%startTime' ] }
														]
													}
												]
											}
										],
										annots: [ '%auctions' ]
									},
									{
										prim: 'big_map',
										args: [ { prim: 'address' }, { prim: 'bool' } ],
										annots: [ '%authorizedSC' ]
									}
								]
							},
							{
								prim: 'pair',
								args: [
									{ prim: 'int', annots: [ '%balance' ] },
									{ prim: 'bool', annots: [ '%paused' ] }
								]
							},
							{
								prim: 'map',
								args: [
									{ prim: 'address' },
									{
										prim: 'big_map',
										args: [
											{ prim: 'nat' },
											{
												prim: 'pair',
												args: [
													{ prim: 'nat', annots: [ '%fee' ] },
													{ prim: 'address', annots: [ '%owner' ] },
													{ prim: 'mutez', annots: [ '%price' ] }
												]
											}
										]
									}
								],
								annots: [ '%selling' ]
							},
							{ prim: 'address', annots: [ '%tokenAddress' ] }
						]
					}
				]
			},
			{
				prim: 'code',
				args: [
					[
						{
							prim: 'CAST',
							args: [
								{
									prim: 'pair',
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
																		{ prim: 'nat' },
																		{
																			prim: 'pair',
																			args: [
																				{ prim: 'address' },
																				{ prim: 'nat' }
																			]
																		}
																	]
																},
																{
																	prim: 'or',
																	args: [
																		{ prim: 'nat' },
																		{
																			prim: 'pair',
																			args: [
																				{ prim: 'address' },
																				{ prim: 'nat' }
																			]
																		}
																	]
																}
															]
														},
														{
															prim: 'or',
															args: [
																{ prim: 'address' },
																{
																	prim: 'or',
																	args: [
																		{ prim: 'nat' },
																		{
																			prim: 'pair',
																			args: [
																				{ prim: 'nat' },
																				{
																					prim: 'pair',
																					args: [
																						{ prim: 'int' },
																						{ prim: 'int' }
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
													prim: 'or',
													args: [
														{
															prim: 'or',
															args: [
																{ prim: 'unit' },
																{
																	prim: 'or',
																	args: [
																		{
																			prim: 'pair',
																			args: [
																				{ prim: 'nat' },
																				{
																					prim: 'pair',
																					args: [
																						{ prim: 'nat' },
																						{ prim: 'nat' }
																					]
																				}
																			]
																		},
																		{ prim: 'address' }
																	]
																}
															]
														},
														{
															prim: 'or',
															args: [
																{ prim: 'address' },
																{
																	prim: 'or',
																	args: [ { prim: 'unit' }, { prim: 'address' } ]
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
													prim: 'pair',
													args: [
														{
															prim: 'pair',
															args: [ { prim: 'address' }, { prim: 'address' } ]
														},
														{
															prim: 'pair',
															args: [
																{
																	prim: 'big_map',
																	args: [
																		{ prim: 'address' },
																		{
																			prim: 'map',
																			args: [
																				{ prim: 'nat' },
																				{
																					prim: 'pair',
																					args: [
																						{
																							prim: 'pair',
																							args: [
																								{
																									prim: 'pair',
																									args: [
																										{ prim: 'nat' },
																										{ prim: 'nat' }
																									]
																								},
																								{
																									prim: 'pair',
																									args: [
																										{
																											prim: 'bool'
																										},
																										{
																											prim:
																												'address'
																										}
																									]
																								}
																							]
																						},
																						{
																							prim: 'pair',
																							args: [
																								{
																									prim: 'pair',
																									args: [
																										{
																											prim:
																												'mutez'
																										},
																										{
																											prim:
																												'address'
																										}
																									]
																								},
																								{
																									prim: 'pair',
																									args: [
																										{ prim: 'int' },
																										{
																											prim:
																												'timestamp'
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
																	prim: 'big_map',
																	args: [ { prim: 'address' }, { prim: 'bool' } ]
																}
															]
														}
													]
												},
												{
													prim: 'pair',
													args: [
														{ prim: 'pair', args: [ { prim: 'int' }, { prim: 'bool' } ] },
														{
															prim: 'pair',
															args: [
																{
																	prim: 'map',
																	args: [
																		{ prim: 'address' },
																		{
																			prim: 'big_map',
																			args: [
																				{ prim: 'nat' },
																				{
																					prim: 'pair',
																					args: [
																						{ prim: 'nat' },
																						{
																							prim: 'pair',
																							args: [
																								{ prim: 'address' },
																								{ prim: 'mutez' }
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
														}
													]
												}
											]
										}
									]
								}
							]
						},
						{ prim: 'UNPAIR' },
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
															{ prim: 'SWAP' },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'CAR' },
															{ prim: 'GET', args: [ { int: '4' } ] },
															{ prim: 'SENDER' },
															{ prim: 'GET' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '178' } ]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[]
																]
															},
															{
																prim: 'IF',
																args: [
																	[],
																	[
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'string' },
																				{ string: 'engine: not auth' }
																			]
																		},
																		{ prim: 'FAILWITH' }
																	]
																]
															},
															{ prim: 'SWAP' },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'CAR' },
															{ prim: 'GET', args: [ { int: '3' } ] },
															{ prim: 'SENDER' },
															{ prim: 'GET' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '169' } ]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[]
																]
															},
															{ prim: 'SWAP' },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'CAR' },
															{ prim: 'GET' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '169' } ]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[]
																]
															},
															{ prim: 'GET', args: [ { int: '6' } ] },
															{ prim: 'PUSH', args: [ { prim: 'int' }, { int: '60' } ] },
															{ prim: 'DUP', args: [ { int: '4' } ] },
															{ prim: 'CAR' },
															{ prim: 'GET', args: [ { int: '3' } ] },
															{ prim: 'SENDER' },
															{ prim: 'GET' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '169' } ]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[]
																]
															},
															{ prim: 'DUP', args: [ { int: '4' } ] },
															{ prim: 'CAR' },
															{ prim: 'GET' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '169' } ]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[]
																]
															},
															{ prim: 'GET', args: [ { int: '5' } ] },
															{ prim: 'MUL' },
															{ prim: 'ADD' },
															{ prim: 'NOW' },
															{ prim: 'COMPARE' },
															{ prim: 'GT' },
															{
																prim: 'IF',
																args: [
																	[
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '169' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '169' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'NOT' }
																	],
																	[
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'bool' },
																				{ prim: 'False' }
																			]
																		}
																	]
																]
															},
															{
																prim: 'IF',
																args: [
																	[],
																	[
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'string' },
																				{ string: "Can't finalize auction yet" }
																			]
																		},
																		{ prim: 'FAILWITH' }
																	]
																]
															},
															{ prim: 'SOURCE' },
															{ prim: 'DUP', args: [ { int: '3' } ] },
															{ prim: 'CAR' },
															{ prim: 'GET', args: [ { int: '3' } ] },
															{ prim: 'SENDER' },
															{ prim: 'GET' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '180' } ]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[]
																]
															},
															{ prim: 'DUP', args: [ { int: '3' } ] },
															{ prim: 'CAR' },
															{ prim: 'GET' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '180' } ]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[]
																]
															},
															{ prim: 'CAR' },
															{ prim: 'GET', args: [ { int: '4' } ] },
															{ prim: 'COMPARE' },
															{ prim: 'EQ' },
															{
																prim: 'IF',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'bool' }, { prim: 'True' } ]
																		}
																	],
																	[
																		{ prim: 'SOURCE' },
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'CAR' },
																		{ prim: 'CDR' },
																		{ prim: 'COMPARE' },
																		{ prim: 'EQ' }
																	]
																]
															},
															{
																prim: 'IF',
																args: [
																	[],
																	[
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'string' },
																				{ string: 'Not your auction' }
																			]
																		},
																		{ prim: 'FAILWITH' }
																	]
																]
															},
															{ prim: 'SWAP' },
															{ prim: 'UNPAIR' },
															{ prim: 'UNPAIR' },
															{ prim: 'SWAP' },
															{ prim: 'UNPAIR' },
															{ prim: 'DUP' },
															{ prim: 'SENDER' },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'GET' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '182' } ]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[]
																]
															},
															{ prim: 'DUP' },
															{ prim: 'DUP', args: [ { int: '8' } ] },
															{ prim: 'CAR' },
															{ prim: 'DUP' },
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'GET' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '182' } ]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[]
																]
															},
															{ prim: 'UNPAIR' },
															{ prim: 'UNPAIR' },
															{ prim: 'SWAP' },
															{ prim: 'CDR' },
															{
																prim: 'PUSH',
																args: [ { prim: 'bool' }, { prim: 'True' } ]
															},
															{ prim: 'PAIR' },
															{ prim: 'SWAP' },
															{ prim: 'PAIR' },
															{ prim: 'PAIR' },
															{ prim: 'SOME' },
															{ prim: 'SWAP' },
															{ prim: 'UPDATE' },
															{ prim: 'SOME' },
															{ prim: 'SWAP' },
															{ prim: 'UPDATE' },
															{ prim: 'PAIR' },
															{ prim: 'SWAP' },
															{ prim: 'PAIR' },
															{ prim: 'PAIR' },
															{ prim: 'SWAP' },
															{ prim: 'PUSH', args: [ { prim: 'nat' }, { int: '0' } ] },
															{ prim: 'DUP', args: [ { int: '3' } ] },
															{ prim: 'CAR' },
															{ prim: 'GET', args: [ { int: '3' } ] },
															{ prim: 'SENDER' },
															{ prim: 'GET' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '183' } ]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[]
																]
															},
															{ prim: 'DUP', args: [ { int: '3' } ] },
															{ prim: 'CAR' },
															{ prim: 'GET' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '183' } ]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[]
																]
															},
															{ prim: 'CAR' },
															{ prim: 'CAR' },
															{ prim: 'CDR' },
															{ prim: 'COMPARE' },
															{ prim: 'NEQ' },
															{
																prim: 'IF',
																args: [
																	[
																		{
																			prim: 'NIL',
																			args: [ { prim: 'operation' } ]
																		},
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '185' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '185' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '4' } ] },
																		{
																			prim: 'CONTRACT',
																			args: [ { prim: 'unit' } ]
																		},
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '185' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '100' } ]
																		},
																		{ prim: 'DUP', args: [ { int: '5' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '185' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '5' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '185' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'DUP', args: [ { int: '5' } ] },
																		{ prim: 'GET', args: [ { int: '4' } ] },
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '97' } ]
																		},
																		{ prim: 'SUB' },
																		{ prim: 'ISNAT' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '185' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'MUL' },
																		{ prim: 'EDIV' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '185' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'CAR' },
																		{ prim: 'UNIT' },
																		{ prim: 'TRANSFER_TOKENS' },
																		{ prim: 'CONS' },
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'CAR' },
																		{ prim: 'CAR' },
																		{
																			prim: 'CONTRACT',
																			args: [ { prim: 'unit' } ]
																		},
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '187' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '100' } ]
																		},
																		{ prim: 'DUP', args: [ { int: '5' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '187' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '5' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '187' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'CAR' },
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '3' } ]
																		},
																		{ prim: 'MUL' },
																		{ prim: 'EDIV' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '187' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'CAR' },
																		{ prim: 'UNIT' },
																		{ prim: 'TRANSFER_TOKENS' },
																		{ prim: 'CONS' },
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{
																			prim: 'CONTRACT',
																			args: [ { prim: 'unit' } ]
																		},
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '189' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '100' } ]
																		},
																		{ prim: 'DUP', args: [ { int: '5' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '189' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '5' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '189' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'DUP', args: [ { int: '5' } ] },
																		{ prim: 'GET', args: [ { int: '4' } ] },
																		{ prim: 'MUL' },
																		{ prim: 'EDIV' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '189' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'CAR' },
																		{ prim: 'UNIT' },
																		{ prim: 'TRANSFER_TOKENS' },
																		{ prim: 'CONS' }
																	],
																	[ { prim: 'NIL', args: [ { prim: 'operation' } ] } ]
																]
															},
															{
																prim: 'PUSH',
																args: [ { prim: 'nat' }, { int: '1000000000000' } ]
															},
															{ prim: 'PUSH', args: [ { prim: 'mutez' }, { int: '1' } ] },
															{ prim: 'DUP', args: [ { int: '5' } ] },
															{ prim: 'CAR' },
															{ prim: 'GET', args: [ { int: '3' } ] },
															{ prim: 'SENDER' },
															{ prim: 'GET' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '193' } ]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[]
																]
															},
															{ prim: 'DUP', args: [ { int: '5' } ] },
															{ prim: 'CAR' },
															{ prim: 'GET' },
															{
																prim: 'IF_NONE',
																args: [
																	[
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '193' } ]
																		},
																		{ prim: 'FAILWITH' }
																	],
																	[]
																]
															},
															{ prim: 'GET', args: [ { int: '3' } ] },
															{ prim: 'CAR' },
															{ prim: 'EDIV' },
															{
																prim: 'IF_NONE',
																args: [ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ], [] ]
															},
															{ prim: 'CAR' },
															{ prim: 'MUL' },
															{ prim: 'INT' },
															{ prim: 'DUP', args: [ { int: '4' } ] },
															{ prim: 'GET', args: [ { int: '3' } ] },
															{ prim: 'CAR' },
															{ prim: 'COMPARE' },
															{ prim: 'GE' },
															{
																prim: 'IF',
																args: [
																	[
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'GET', args: [ { int: '6' } ] },
																		{
																			prim: 'CONTRACT',
																			args: [
																				{
																					prim: 'pair',
																					args: [
																						{ prim: 'address' },
																						{
																							prim: 'pair',
																							args: [
																								{ prim: 'address' },
																								{ prim: 'nat' }
																							]
																						}
																					]
																				}
																			],
																			annots: [ '%transfer' ]
																		},
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '195' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'mutez' }, { int: '0' } ]
																		},
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'nat' },
																				{ int: '1000000000000' }
																			]
																		},
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'mutez' }, { int: '1' } ]
																		},
																		{ prim: 'DUP', args: [ { int: '7' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '193' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '7' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '193' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'EDIV' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{ prim: 'UNIT' },
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'CAR' },
																		{ prim: 'MUL' },
																		{ prim: 'DUP', args: [ { int: '6' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '197' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '6' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '197' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'SELF_ADDRESS' },
																		{ prim: 'PAIR', args: [ { int: '3' } ] },
																		{ prim: 'TRANSFER_TOKENS' },
																		{ prim: 'CONS' },
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'UNPAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'UNPAIR' },
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'nat' },
																				{ int: '1000000000000' }
																			]
																		},
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'mutez' }, { int: '1' } ]
																		},
																		{ prim: 'DIG', args: [ { int: '8' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '193' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DIG', args: [ { int: '8' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '193' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'EDIV' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{ prim: 'UNIT' },
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'CAR' },
																		{ prim: 'MUL' },
																		{ prim: 'INT' },
																		{ prim: 'SWAP' },
																		{ prim: 'SUB' },
																		{ prim: 'PAIR' },
																		{ prim: 'PAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'PAIR' },
																		{ prim: 'SWAP' }
																	],
																	[ { prim: 'SWAP' }, { prim: 'DROP' } ]
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
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'CDR' },
																		{
																			prim: 'IF',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'string' },
																							{
																								string:
																									'WrongCondition: ~ self.data.paused'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '166' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '166' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'GET', args: [ { int: '6' } ] },
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'int' }, { int: '60' } ]
																		},
																		{ prim: 'DUP', args: [ { int: '4' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '166' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '4' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '166' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'GET', args: [ { int: '5' } ] },
																		{ prim: 'MUL' },
																		{ prim: 'ADD' },
																		{ prim: 'NOW' },
																		{ prim: 'COMPARE' },
																		{ prim: 'LT' },
																		{
																			prim: 'IF',
																			args: [
																				[],
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'string' },
																							{ string: 'Not active' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				]
																			]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '4' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '152' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
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
																									'engine: not auth'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				]
																			]
																		},
																		{ prim: 'SOURCE' },
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '153' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '153' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '4' } ] },
																		{ prim: 'COMPARE' },
																		{ prim: 'EQ' },
																		{
																			prim: 'IF',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'string' },
																							{
																								string:
																									'It is your token'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '154' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '154' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'AMOUNT' },
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
																							{
																								string:
																									'WrongCondition: sp.amount > self.data.auctions[sp.sender][params].currentBidAmount'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				]
																			]
																		},
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '0' } ]
																		},
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '156' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '156' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'CAR' },
																		{ prim: 'CAR' },
																		{ prim: 'CDR' },
																		{ prim: 'COMPARE' },
																		{ prim: 'NEQ' },
																		{
																			prim: 'IF',
																			args: [
																				[
																					{
																						prim: 'NIL',
																						args: [ { prim: 'operation' } ]
																					},
																					{
																						prim: 'DUP',
																						args: [ { int: '3' } ]
																					},
																					{ prim: 'CAR' },
																					{
																						prim: 'GET',
																						args: [ { int: '3' } ]
																					},
																					{ prim: 'SENDER' },
																					{ prim: 'GET' },
																					{
																						prim: 'IF_NONE',
																						args: [
																							[
																								{
																									prim: 'PUSH',
																									args: [
																										{ prim: 'int' },
																										{ int: '158' }
																									]
																								},
																								{ prim: 'FAILWITH' }
																							],
																							[]
																						]
																					},
																					{
																						prim: 'DUP',
																						args: [ { int: '3' } ]
																					},
																					{ prim: 'GET' },
																					{
																						prim: 'IF_NONE',
																						args: [
																							[
																								{
																									prim: 'PUSH',
																									args: [
																										{ prim: 'int' },
																										{ int: '158' }
																									]
																								},
																								{ prim: 'FAILWITH' }
																							],
																							[]
																						]
																					},
																					{
																						prim: 'GET',
																						args: [ { int: '3' } ]
																					},
																					{ prim: 'CDR' },
																					{
																						prim: 'CONTRACT',
																						args: [ { prim: 'unit' } ]
																					},
																					{
																						prim: 'IF_NONE',
																						args: [
																							[
																								{
																									prim: 'PUSH',
																									args: [
																										{ prim: 'int' },
																										{ int: '158' }
																									]
																								},
																								{ prim: 'FAILWITH' }
																							],
																							[]
																						]
																					},
																					{
																						prim: 'DUP',
																						args: [ { int: '4' } ]
																					},
																					{ prim: 'CAR' },
																					{
																						prim: 'GET',
																						args: [ { int: '3' } ]
																					},
																					{ prim: 'SENDER' },
																					{ prim: 'GET' },
																					{
																						prim: 'IF_NONE',
																						args: [
																							[
																								{
																									prim: 'PUSH',
																									args: [
																										{ prim: 'int' },
																										{ int: '158' }
																									]
																								},
																								{ prim: 'FAILWITH' }
																							],
																							[]
																						]
																					},
																					{
																						prim: 'DUP',
																						args: [ { int: '4' } ]
																					},
																					{ prim: 'GET' },
																					{
																						prim: 'IF_NONE',
																						args: [
																							[
																								{
																									prim: 'PUSH',
																									args: [
																										{ prim: 'int' },
																										{ int: '158' }
																									]
																								},
																								{ prim: 'FAILWITH' }
																							],
																							[]
																						]
																					},
																					{
																						prim: 'GET',
																						args: [ { int: '3' } ]
																					},
																					{ prim: 'CAR' },
																					{ prim: 'UNIT' },
																					{ prim: 'TRANSFER_TOKENS' },
																					{ prim: 'CONS' }
																				],
																				[
																					{
																						prim: 'NIL',
																						args: [ { prim: 'operation' } ]
																					}
																				]
																			]
																		},
																		{ prim: 'DIG', args: [ { int: '2' } ] },
																		{ prim: 'UNPAIR' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'DUP' },
																		{ prim: 'SENDER' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '161' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP' },
																		{ prim: 'DUP', args: [ { int: '9' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '161' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'UNPAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'CDR' },
																		{ prim: 'AMOUNT' },
																		{ prim: 'PAIR' },
																		{ prim: 'PAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'PAIR' },
																		{ prim: 'SOME' },
																		{ prim: 'SWAP' },
																		{ prim: 'UPDATE' },
																		{ prim: 'SOME' },
																		{ prim: 'SWAP' },
																		{ prim: 'UPDATE' },
																		{ prim: 'DUP' },
																		{ prim: 'SENDER' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '162' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP' },
																		{ prim: 'DUP', args: [ { int: '9' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '162' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'UNPAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'CAR' },
																		{ prim: 'SOURCE' },
																		{ prim: 'SWAP' },
																		{ prim: 'PAIR' },
																		{ prim: 'PAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'PAIR' },
																		{ prim: 'SOME' },
																		{ prim: 'SWAP' },
																		{ prim: 'UPDATE' },
																		{ prim: 'SOME' },
																		{ prim: 'SWAP' },
																		{ prim: 'UPDATE' },
																		{ prim: 'DUP' },
																		{ prim: 'SENDER' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '163' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP' },
																		{ prim: 'DIG', args: [ { int: '8' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '163' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'UNPAIR' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'SWAP' },
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '1' } ]
																		},
																		{ prim: 'ADD' },
																		{ prim: 'SWAP' },
																		{ prim: 'PAIR' },
																		{ prim: 'PAIR' },
																		{ prim: 'PAIR' },
																		{ prim: 'SOME' },
																		{ prim: 'SWAP' },
																		{ prim: 'UPDATE' },
																		{ prim: 'SOME' },
																		{ prim: 'SWAP' },
																		{ prim: 'UPDATE' },
																		{ prim: 'PAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'PAIR' },
																		{ prim: 'PAIR' },
																		{ prim: 'SWAP' }
																	],
																	[
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'CDR' },
																		{
																			prim: 'IF',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'string' },
																							{
																								string:
																									'WrongCondition: ~ self.data.paused'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'AMOUNT' },
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'GET', args: [ { int: '5' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '104' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '104' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'GET', args: [ { int: '4' } ] },
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
																							{ string: 'Not the price' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				]
																			]
																		},
																		{ prim: 'SOURCE' },
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'GET', args: [ { int: '5' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '105' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '105' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'COMPARE' },
																		{ prim: 'EQ' },
																		{
																			prim: 'IF',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'string' },
																							{
																								string:
																									'It is your token'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '4' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '106' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
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
																									'engine: not auth'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				]
																			]
																		},
																		{
																			prim: 'NIL',
																			args: [ { prim: 'operation' } ]
																		},
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'GET', args: [ { int: '5' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '109' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '109' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{
																			prim: 'CONTRACT',
																			args: [ { prim: 'unit' } ]
																		},
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '109' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '100' } ]
																		},
																		{ prim: 'AMOUNT' },
																		{ prim: 'DUP', args: [ { int: '6' } ] },
																		{ prim: 'GET', args: [ { int: '5' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '109' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '6' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '109' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'CAR' },
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '97' } ]
																		},
																		{ prim: 'SUB' },
																		{ prim: 'ISNAT' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '109' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'MUL' },
																		{ prim: 'EDIV' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '109' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'CAR' },
																		{ prim: 'UNIT' },
																		{ prim: 'TRANSFER_TOKENS' },
																		{ prim: 'CONS' },
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'CAR' },
																		{ prim: 'CAR' },
																		{
																			prim: 'CONTRACT',
																			args: [ { prim: 'unit' } ]
																		},
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '110' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '100' } ]
																		},
																		{ prim: 'AMOUNT' },
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '3' } ]
																		},
																		{ prim: 'MUL' },
																		{ prim: 'EDIV' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '110' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'CAR' },
																		{ prim: 'UNIT' },
																		{ prim: 'TRANSFER_TOKENS' },
																		{ prim: 'CONS' },
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'CAR' },
																		{
																			prim: 'CONTRACT',
																			args: [ { prim: 'unit' } ]
																		},
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '111' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '100' } ]
																		},
																		{ prim: 'AMOUNT' },
																		{ prim: 'DUP', args: [ { int: '6' } ] },
																		{ prim: 'GET', args: [ { int: '5' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '111' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '6' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '111' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'CAR' },
																		{ prim: 'MUL' },
																		{ prim: 'EDIV' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '111' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'CAR' },
																		{ prim: 'UNIT' },
																		{ prim: 'TRANSFER_TOKENS' },
																		{ prim: 'CONS' },
																		{ prim: 'DIG', args: [ { int: '2' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'GET', args: [ { int: '5' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'SENDER' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '113' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{
																			prim: 'NONE',
																			args: [
																				{
																					prim: 'pair',
																					args: [
																						{ prim: 'nat' },
																						{
																							prim: 'pair',
																							args: [
																								{ prim: 'address' },
																								{ prim: 'mutez' }
																							]
																						}
																					]
																				}
																			]
																		},
																		{ prim: 'DIG', args: [ { int: '6' } ] },
																		{ prim: 'CDR' },
																		{ prim: 'UPDATE' },
																		{ prim: 'SOME' },
																		{ prim: 'SWAP' },
																		{ prim: 'UPDATE' },
																		{ prim: 'UPDATE', args: [ { int: '5' } ] },
																		{ prim: 'SWAP' },
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'nat' },
																				{ int: '1000000000000' }
																			]
																		},
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'mutez' }, { int: '1' } ]
																		},
																		{ prim: 'AMOUNT' },
																		{ prim: 'EDIV' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{ prim: 'UNIT' },
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'CAR' },
																		{ prim: 'MUL' },
																		{ prim: 'INT' },
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'COMPARE' },
																		{ prim: 'GE' },
																		{
																			prim: 'IF',
																			args: [
																				[
																					{ prim: 'SWAP' },
																					{ prim: 'DUP' },
																					{
																						prim: 'DUG',
																						args: [ { int: '2' } ]
																					},
																					{
																						prim: 'GET',
																						args: [ { int: '6' } ]
																					},
																					{
																						prim: 'CONTRACT',
																						args: [
																							{
																								prim: 'pair',
																								args: [
																									{ prim: 'address' },
																									{
																										prim: 'pair',
																										args: [
																											{
																												prim:
																													'address'
																											},
																											{
																												prim:
																													'nat'
																											}
																										]
																									}
																								]
																							}
																						],
																						annots: [ '%transfer' ]
																					},
																					{
																						prim: 'IF_NONE',
																						args: [
																							[
																								{
																									prim: 'PUSH',
																									args: [
																										{ prim: 'int' },
																										{ int: '118' }
																									]
																								},
																								{ prim: 'FAILWITH' }
																							],
																							[]
																						]
																					},
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'mutez' },
																							{ int: '0' }
																						]
																					},
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'nat' },
																							{ int: '1000000000000' }
																						]
																					},
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'mutez' },
																							{ int: '1' }
																						]
																					},
																					{ prim: 'AMOUNT' },
																					{ prim: 'EDIV' },
																					{
																						prim: 'IF_NONE',
																						args: [
																							[
																								{ prim: 'UNIT' },
																								{ prim: 'FAILWITH' }
																							],
																							[]
																						]
																					},
																					{ prim: 'CAR' },
																					{ prim: 'MUL' },
																					{ prim: 'SOURCE' },
																					{ prim: 'SELF_ADDRESS' },
																					{
																						prim: 'PAIR',
																						args: [ { int: '3' } ]
																					},
																					{ prim: 'TRANSFER_TOKENS' },
																					{ prim: 'CONS' },
																					{ prim: 'SWAP' },
																					{ prim: 'UNPAIR' },
																					{ prim: 'SWAP' },
																					{ prim: 'UNPAIR' },
																					{ prim: 'UNPAIR' },
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'nat' },
																							{ int: '1000000000000' }
																						]
																					},
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'mutez' },
																							{ int: '1' }
																						]
																					},
																					{ prim: 'AMOUNT' },
																					{ prim: 'EDIV' },
																					{
																						prim: 'IF_NONE',
																						args: [
																							[
																								{ prim: 'UNIT' },
																								{ prim: 'FAILWITH' }
																							],
																							[]
																						]
																					},
																					{ prim: 'CAR' },
																					{ prim: 'MUL' },
																					{ prim: 'INT' },
																					{ prim: 'SWAP' },
																					{ prim: 'SUB' },
																					{ prim: 'PAIR' },
																					{ prim: 'PAIR' },
																					{ prim: 'SWAP' },
																					{ prim: 'PAIR' },
																					{ prim: 'SWAP' }
																				],
																				[]
																			]
																		}
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
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'CAR' },
															{ prim: 'CAR' },
															{ prim: 'CDR' },
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
																				{ string: 'Not admin' }
																			]
																		},
																		{ prim: 'FAILWITH' }
																	]
																]
															},
															{ prim: 'SWAP' },
															{ prim: 'UNPAIR' },
															{ prim: 'UNPAIR' },
															{ prim: 'SWAP' },
															{ prim: 'UNPAIR' },
															{ prim: 'SWAP' },
															{
																prim: 'PUSH',
																args: [
																	{ prim: 'option', args: [ { prim: 'bool' } ] },
																	{ prim: 'Some', args: [ { prim: 'False' } ] }
																]
															},
															{ prim: 'DUP', args: [ { int: '6' } ] },
															{ prim: 'UPDATE' },
															{ prim: 'SWAP' },
															{ prim: 'PAIR' },
															{ prim: 'SWAP' },
															{ prim: 'PAIR' },
															{ prim: 'PAIR' },
															{ prim: 'DUP' },
															{ prim: 'GET', args: [ { int: '5' } ] },
															{
																prim: 'NONE',
																args: [
																	{
																		prim: 'big_map',
																		args: [
																			{ prim: 'nat' },
																			{
																				prim: 'pair',
																				args: [
																					{ prim: 'nat' },
																					{
																						prim: 'pair',
																						args: [
																							{ prim: 'address' },
																							{ prim: 'mutez' }
																						]
																					}
																				]
																			}
																		]
																	}
																]
															},
															{ prim: 'DUP', args: [ { int: '4' } ] },
															{ prim: 'UPDATE' },
															{ prim: 'UPDATE', args: [ { int: '5' } ] },
															{ prim: 'UNPAIR' },
															{ prim: 'UNPAIR' },
															{ prim: 'SWAP' },
															{ prim: 'UNPAIR' },
															{
																prim: 'NONE',
																args: [
																	{
																		prim: 'map',
																		args: [
																			{ prim: 'nat' },
																			{
																				prim: 'pair',
																				args: [
																					{
																						prim: 'pair',
																						args: [
																							{
																								prim: 'pair',
																								args: [
																									{ prim: 'nat' },
																									{ prim: 'nat' }
																								]
																							},
																							{
																								prim: 'pair',
																								args: [
																									{ prim: 'bool' },
																									{ prim: 'address' }
																								]
																							}
																						]
																					},
																					{
																						prim: 'pair',
																						args: [
																							{
																								prim: 'pair',
																								args: [
																									{ prim: 'mutez' },
																									{ prim: 'address' }
																								]
																							},
																							{
																								prim: 'pair',
																								args: [
																									{ prim: 'int' },
																									{
																										prim:
																											'timestamp'
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
															{ prim: 'DIG', args: [ { int: '5' } ] },
															{ prim: 'UPDATE' },
															{ prim: 'PAIR' },
															{ prim: 'SWAP' },
															{ prim: 'PAIR' },
															{ prim: 'PAIR' }
														],
														[
															{
																prim: 'IF_LEFT',
																args: [
																	[
																		{ prim: 'SOURCE' },
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'GET', args: [ { int: '5' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '95' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '3' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '95' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'GET', args: [ { int: '3' } ] },
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
																									'It is not your token'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				]
																			]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '4' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '96' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
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
																									'engine: not auth'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				]
																			]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'GET', args: [ { int: '5' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'SENDER' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '97' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{
																			prim: 'NONE',
																			args: [
																				{
																					prim: 'pair',
																					args: [
																						{ prim: 'nat' },
																						{
																							prim: 'pair',
																							args: [
																								{ prim: 'address' },
																								{ prim: 'mutez' }
																							]
																						}
																					]
																				}
																			]
																		},
																		{ prim: 'DIG', args: [ { int: '5' } ] },
																		{ prim: 'UPDATE' },
																		{ prim: 'SOME' },
																		{ prim: 'SWAP' },
																		{ prim: 'UPDATE' },
																		{ prim: 'UPDATE', args: [ { int: '5' } ] }
																	],
																	[
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'CDR' },
																		{
																			prim: 'IF',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'string' },
																							{
																								string:
																									'WrongCondition: ~ self.data.paused'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '4' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '134' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
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
																									'engine: not auth'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				]
																			]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'UNPAIR' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'DUP' },
																		{ prim: 'SENDER' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '137' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'NOW' },
																		{ prim: 'DUP', args: [ { int: '8' } ] },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'PAIR' },
																		{ prim: 'SOURCE' },
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'mutez' },
																				{ int: '1000000' }
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '10' } ] },
																		{ prim: 'GET', args: [ { int: '4' } ] },
																		{ prim: 'ISNAT' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '137' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'MUL' },
																		{ prim: 'PAIR' },
																		{ prim: 'PAIR' },
																		{ prim: 'SOURCE' },
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'bool' },
																				{ prim: 'False' }
																			]
																		},
																		{ prim: 'PAIR' },
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '0' } ]
																		},
																		{ prim: 'DIG', args: [ { int: '9' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'PAIR' },
																		{ prim: 'PAIR' },
																		{ prim: 'PAIR' },
																		{ prim: 'SOME' },
																		{ prim: 'DIG', args: [ { int: '7' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '136' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{ prim: 'SIZE' },
																		{ prim: 'UPDATE' },
																		{ prim: 'SOME' },
																		{ prim: 'SWAP' },
																		{ prim: 'UPDATE' },
																		{ prim: 'PAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'PAIR' },
																		{ prim: 'PAIR' }
																	]
																]
															}
														]
													]
												},
												{ prim: 'NIL', args: [ { prim: 'operation' } ] }
											]
										]
									}
								],
								[
									{
										prim: 'IF_LEFT',
										args: [
											[
												{
													prim: 'IF_LEFT',
													args: [
														[
															{ prim: 'DROP' },
															{ prim: 'DUP' },
															{ prim: 'CAR' },
															{ prim: 'CAR' },
															{ prim: 'CDR' },
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
																				{ string: 'Not admin' }
																			]
																		},
																		{ prim: 'FAILWITH' }
																	]
																]
															},
															{ prim: 'UNPAIR' },
															{ prim: 'SWAP' },
															{ prim: 'UNPAIR' },
															{ prim: 'CAR' },
															{
																prim: 'PUSH',
																args: [ { prim: 'bool' }, { prim: 'True' } ]
															},
															{ prim: 'SWAP' },
															{ prim: 'PAIR' },
															{ prim: 'PAIR' },
															{ prim: 'SWAP' },
															{ prim: 'PAIR' }
														],
														[
															{
																prim: 'IF_LEFT',
																args: [
																	[
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'GET', args: [ { int: '4' } ] },
																		{ prim: 'SENDER' },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '86' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
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
																									'engine: not auth'
																							}
																						]
																					},
																					{ prim: 'FAILWITH' }
																				]
																			]
																		},
																		{ prim: 'DUP' },
																		{ prim: 'GET', args: [ { int: '4' } ] },
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '0' } ]
																		},
																		{ prim: 'COMPARE' },
																		{ prim: 'LT' },
																		{
																			prim: 'IF',
																			args: [
																				[],
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'string' },
																							{ string: 'Price invalid' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				]
																			]
																		},
																		{ prim: 'DUP' },
																		{ prim: 'CAR' },
																		{
																			prim: 'PUSH',
																			args: [ { prim: 'nat' }, { int: '1' } ]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'COMPARE' },
																		{ prim: 'GE' },
																		{
																			prim: 'IF',
																			args: [
																				[
																					{ prim: 'DUP' },
																					{ prim: 'CAR' },
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'nat' },
																							{ int: '20' }
																						]
																					},
																					{ prim: 'SWAP' },
																					{ prim: 'COMPARE' },
																					{ prim: 'LE' }
																				],
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'bool' },
																							{ prim: 'False' }
																						]
																					}
																				]
																			]
																		},
																		{
																			prim: 'IF',
																			args: [
																				[],
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'string' },
																							{ string: 'Fee invalid' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				]
																			]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'GET', args: [ { int: '5' } ] },
																		{ prim: 'DUP' },
																		{ prim: 'SENDER' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'GET' },
																		{
																			prim: 'IF_NONE',
																			args: [
																				[
																					{
																						prim: 'PUSH',
																						args: [
																							{ prim: 'int' },
																							{ int: '89' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				],
																				[]
																			]
																		},
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'mutez' },
																				{ int: '1000000' }
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '6' } ] },
																		{ prim: 'GET', args: [ { int: '4' } ] },
																		{ prim: 'MUL' },
																		{ prim: 'SOURCE' },
																		{ prim: 'DUP', args: [ { int: '7' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'PAIR', args: [ { int: '3' } ] },
																		{ prim: 'SOME' },
																		{ prim: 'DIG', args: [ { int: '5' } ] },
																		{ prim: 'GET', args: [ { int: '3' } ] },
																		{ prim: 'UPDATE' },
																		{ prim: 'SOME' },
																		{ prim: 'SWAP' },
																		{ prim: 'UPDATE' },
																		{ prim: 'UPDATE', args: [ { int: '5' } ] }
																	],
																	[
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'CAR' },
																		{ prim: 'CDR' },
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
																							{ string: 'Not admin' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				]
																			]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'SWAP' },
																		{
																			prim: 'PUSH',
																			args: [
																				{
																					prim: 'option',
																					args: [ { prim: 'bool' } ]
																				},
																				{
																					prim: 'Some',
																					args: [ { prim: 'True' } ]
																				}
																			]
																		},
																		{ prim: 'DUP', args: [ { int: '6' } ] },
																		{ prim: 'UPDATE' },
																		{ prim: 'SWAP' },
																		{ prim: 'PAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'PAIR' },
																		{ prim: 'PAIR' },
																		{ prim: 'DUP' },
																		{ prim: 'GET', args: [ { int: '5' } ] },
																		{
																			prim: 'EMPTY_BIG_MAP',
																			args: [
																				{ prim: 'nat' },
																				{
																					prim: 'pair',
																					args: [
																						{ prim: 'nat' },
																						{
																							prim: 'pair',
																							args: [
																								{ prim: 'address' },
																								{ prim: 'mutez' }
																							]
																						}
																					]
																				}
																			]
																		},
																		{ prim: 'SOME' },
																		{ prim: 'DUP', args: [ { int: '4' } ] },
																		{ prim: 'UPDATE' },
																		{ prim: 'UPDATE', args: [ { int: '5' } ] },
																		{ prim: 'UNPAIR' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'UNPAIR' },
																		{
																			prim: 'PUSH',
																			args: [
																				{
																					prim: 'option',
																					args: [
																						{
																							prim: 'map',
																							args: [
																								{ prim: 'nat' },
																								{
																									prim: 'pair',
																									args: [
																										{
																											prim:
																												'pair',
																											args: [
																												{
																													prim:
																														'pair',
																													args: [
																														{
																															prim:
																																'nat'
																														},
																														{
																															prim:
																																'nat'
																														}
																													]
																												},
																												{
																													prim:
																														'pair',
																													args: [
																														{
																															prim:
																																'bool'
																														},
																														{
																															prim:
																																'address'
																														}
																													]
																												}
																											]
																										},
																										{
																											prim:
																												'pair',
																											args: [
																												{
																													prim:
																														'pair',
																													args: [
																														{
																															prim:
																																'mutez'
																														},
																														{
																															prim:
																																'address'
																														}
																													]
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
																																'timestamp'
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
																				{ prim: 'Some', args: [ [] ] }
																			]
																		},
																		{ prim: 'DIG', args: [ { int: '5' } ] },
																		{ prim: 'UPDATE' },
																		{ prim: 'PAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'PAIR' },
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
															{ prim: 'DUG', args: [ { int: '2' } ] },
															{ prim: 'CAR' },
															{ prim: 'CAR' },
															{ prim: 'CDR' },
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
																				{ string: 'Not admin' }
																			]
																		},
																		{ prim: 'FAILWITH' }
																	]
																]
															},
															{ prim: 'SWAP' },
															{ prim: 'UNPAIR' },
															{ prim: 'UNPAIR' },
															{ prim: 'CAR' },
															{ prim: 'DIG', args: [ { int: '3' } ] },
															{ prim: 'SWAP' },
															{ prim: 'PAIR' },
															{ prim: 'PAIR' },
															{ prim: 'PAIR' }
														],
														[
															{
																prim: 'IF_LEFT',
																args: [
																	[
																		{ prim: 'DROP' },
																		{ prim: 'DUP' },
																		{ prim: 'CAR' },
																		{ prim: 'CAR' },
																		{ prim: 'CDR' },
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
																							{ string: 'Not admin' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				]
																			]
																		},
																		{ prim: 'UNPAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'CAR' },
																		{
																			prim: 'PUSH',
																			args: [
																				{ prim: 'bool' },
																				{ prim: 'False' }
																			]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'PAIR' },
																		{ prim: 'PAIR' },
																		{ prim: 'SWAP' },
																		{ prim: 'PAIR' }
																	],
																	[
																		{ prim: 'SWAP' },
																		{ prim: 'DUP' },
																		{ prim: 'DUG', args: [ { int: '2' } ] },
																		{ prim: 'CAR' },
																		{ prim: 'CAR' },
																		{ prim: 'CDR' },
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
																							{ string: 'Not admin' }
																						]
																					},
																					{ prim: 'FAILWITH' }
																				]
																			]
																		},
																		{ prim: 'SWAP' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'UNPAIR' },
																		{ prim: 'CDR' },
																		{ prim: 'DIG', args: [ { int: '3' } ] },
																		{ prim: 'PAIR' },
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
									},
									{ prim: 'NIL', args: [ { prim: 'operation' } ] }
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
		storage: {
			prim: 'Pair',
			args: [
				{
					prim: 'Pair',
					args: [
						{
							prim: 'Pair',
							args: [
								{ string: 'tz1b3cJ4Vz9cERNN3mJVxSkf4ksXrRjpGwao' },
								{ string: 'tz1gi6qyzWuK2ciD2tAXDW2XdudmoQHy5YR9' }
							]
						},
						{ int: '68953' },
						{ int: '68954' }
					]
				},
				{ prim: 'Pair', args: [ { int: '5000000000000000000' }, { prim: 'False' } ] },
				[
					{ prim: 'Elt', args: [ { string: 'KT1LGGwuY8BVnnzuQCNmJgsY49VhqnxmnZh8' }, { int: '68955' } ] },
					{ prim: 'Elt', args: [ { string: 'KT1VWwhVZmpaKCLUPDdJxjF1YQsRtixF5ejy' }, { int: '68978' } ] }
				],
				{ string: 'KT1Dd8G6EVG3HTYZpp4wn8dnzKBEeE1eftTt' }
			]
		}
	}
};

export const storage = rpcContractResponse.script.code.find((x) => x.prim === 'storage')!.args[0] as any;