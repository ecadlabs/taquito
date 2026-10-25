import {it,expect} from 'vitest';
import {parseAmount,weiToMutezExact,mutezToWei,SubMutezPrecisionError} from '../src/taquito-tezosx';
import {InvalidAmountError} from '@taquito/core';
it.each([0n,1n,9223372036854775807n])('converts exact mutez %s without loss',amount=>{
 expect(weiToMutezExact(mutezToWei(amount))).toBe(amount);
 expect(mutezToWei(amount)).toBe(amount*1000000000000n);
});
it.each([0,1,'1','0x01',1n])('parses a valid amount %s',value=>expect(parseAmount(value)).toBe(BigInt(value)));
it.each([-1,-1n,'-1',1.5,Number.MAX_SAFE_INTEGER+1,NaN,Infinity,'1.5','1e3',' 1',''])('rejects invalid amount %s through every conversion',value=>{
 expect(()=>parseAmount(value)).toThrow(InvalidAmountError);
 expect(()=>weiToMutezExact(value)).toThrow(InvalidAmountError);
 expect(()=>mutezToWei(value)).toThrow(InvalidAmountError);
});
it('rejects sub-mutez loss and mutez overflow',()=>{
 expect(()=>weiToMutezExact(1n)).toThrow(SubMutezPrecisionError);
 expect(()=>weiToMutezExact(9223372036854775808n*1000000000000n)).toThrow(InvalidAmountError);
 expect(()=>mutezToWei(9223372036854775808n)).toThrow(InvalidAmountError);
});
