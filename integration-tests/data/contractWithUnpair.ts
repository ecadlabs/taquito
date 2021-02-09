export const miStr = `parameter int; # the participant's guess
storage   (pair
                int     # the number of guesses made by participants
                address # the address to send the winning pot to if the participants fail
          );
code {
       # (pair parameter storage) : []

       # make sure that the participant has contributed at least 1 tez
       PUSH mutez 1000000;
       AMOUNT;
       IFCMPGE {} { PUSH string "You did not provide enough tez."; FAILWITH; };

       # check that the number of guesses has not been exceeded
       UNPAIR; SWAP; # storage : parameter : []
       DUP;          # storage : storage : parameter : []
       CAR;          # int : storage : parameter : []
       DIP { PUSH int 15; };
       IFCMPLT { # check if guess is correct
                 SWAP; # parameter : storage : []
                 PUSH int 34;
                 IFCMPEQ { # the participant guessed correctly, give them the tokens.
                           SENDER;
                           CONTRACT unit;
                           IF_SOME {} { FAILWITH; };
                           BALANCE;
                           UNIT;
                           TRANSFER_TOKENS;
                           NIL operation; SWAP; CONS; PAIR;
                         }
                         { # the participant guessed incorrectly, increment the number of guesses performed.
                           UNPAIR;
                           PUSH int 1;
                           ADD;
                           PAIR;
                           NIL operation; PAIR;
                         };
               }
               { # attempts exceeded, give winnings to the specified address
                 DIP { DROP; }; # storage : []
                 DUP; CDR;
                 CONTRACT unit;
                 IF_SOME {} { FAILWITH; };
                 BALANCE;
                 UNIT;
                 TRANSFER_TOKENS;
                 NIL operation; SWAP; CONS; PAIR;
               };
     };
`;

export const miObject = [
	{ prim: 'parameter', args: [ { prim: 'int' } ] },
	{ prim: 'storage', args: [ { prim: 'pair', args: [ { prim: 'int' }, { prim: 'address' } ] } ] },
	{
		prim: 'code',
		args: [
			[
				{ prim: 'PUSH', args: [ { prim: 'mutez' }, { int: '1000000' } ] },
				{ prim: 'AMOUNT' },
				[
					{ prim: 'COMPARE' },
					{ prim: 'GE' },
					{
						prim: 'IF',
						args: [
							[],
							[
								{
									prim: 'PUSH',
									args: [ { prim: 'string' }, { string: 'You did not provide enough tez.' } ]
								},
								{ prim: 'FAILWITH' }
							]
						]
					}
				],
				{ prim: 'UNPAIR' },
				{ prim: 'SWAP' },
				{ prim: 'DUP' },
				{ prim: 'CAR' },
				{ prim: 'DIP', args: [ [ { prim: 'PUSH', args: [ { prim: 'int' }, { int: '15' } ] } ] ] },
				[
					{ prim: 'COMPARE' },
					{ prim: 'LT' },
					{
						prim: 'IF',
						args: [
							[
								{ prim: 'SWAP' },
								{ prim: 'PUSH', args: [ { prim: 'int' }, { int: '34' } ] },
								[
									{ prim: 'COMPARE' },
									{ prim: 'EQ' },
									{
										prim: 'IF',
										args: [
											[
												{ prim: 'SENDER' },
												{ prim: 'CONTRACT', args: [ { prim: 'unit' } ] },
												[ { prim: 'IF_NONE', args: [ [ { prim: 'FAILWITH' } ], [] ] } ],
												{ prim: 'BALANCE' },
												{ prim: 'UNIT' },
												{ prim: 'TRANSFER_TOKENS' },
												{ prim: 'NIL', args: [ { prim: 'operation' } ] },
												{ prim: 'SWAP' },
												{ prim: 'CONS' },
												{ prim: 'PAIR' }
											],
											[
												{ prim: 'UNPAIR' },
												{ prim: 'PUSH', args: [ { prim: 'int' }, { int: '1' } ] },
												{ prim: 'ADD' },
												{ prim: 'PAIR' },
												{ prim: 'NIL', args: [ { prim: 'operation' } ] },
												{ prim: 'PAIR' }
											]
										]
									}
								]
							],
							[
								{ prim: 'DIP', args: [ [ { prim: 'DROP' } ] ] },
								{ prim: 'DUP' },
								{ prim: 'CDR' },
								{ prim: 'CONTRACT', args: [ { prim: 'unit' } ] },
								[ { prim: 'IF_NONE', args: [ [ { prim: 'FAILWITH' } ], [] ] } ],
								{ prim: 'BALANCE' },
								{ prim: 'UNIT' },
								{ prim: 'TRANSFER_TOKENS' },
								{ prim: 'NIL', args: [ { prim: 'operation' } ] },
								{ prim: 'SWAP' },
								{ prim: 'CONS' },
								{ prim: 'PAIR' }
							]
						]
					}
				]
			]
		]
	}
];
