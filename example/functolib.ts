import {
    TezosToolkit,
    BigMapAbstraction,
    MichelsonMap,
    OriginationOperation,
    OpKind,
    createTransferOperation,
    TransferParams,
    RPCOperation,
    createRevealOperation
  } from "@taquito/taquito"
  import { MichelsonV1Expression, MichelsonV1ExpressionExtended, MichelsonV1ExpressionBase } from "@taquito/rpc"
  import { encodeOpHash } from '@taquito/utils';
  import { RpcClient } from '@taquito/rpc';
  import { fail } from "assert";
  
  import { InMemorySigner, importKey } from "@taquito/signer";
  
  export let config = {
    node_addr: 'http://127.0.0.1',
    node_port: 20000,
    usleep: 50, // 50 milliseconds
    wait_for_block_x_levels: 10
  }
  
  export let bob_flextesa : wallet =
    {
      pkh : "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
      pk : "edpkurPsQ8eUApnLUJ9ZPDvu98E8VNj4KtJa1aZr16Cr5ow5VHKnz4",
      sk : "edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt",
    }
  
  export let alice_flextesa : wallet =
    {
      pkh : "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
      pk : "edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn",
      sk : "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq",
    }
  
  
  export const client = new RpcClient(config.node_addr + ':' + config.node_port);
  
  export type wallet = { sk: string; pk: string; pkh: string }
  
  export function setSigner(tezosKit: TezosToolkit, sk: any) {
    tezosKit.setProvider({
        signer: new InMemorySigner(sk),
    });
  }
  
  type lambda_params = {from : MichelsonV1Expression; to_ : MichelsonV1Expression; body : MichelsonV1Expression }
  
  export type nat = bigint;
  export type int = bigint;
  export type tez = int;
  export type unit = any;
  export type address = string;
  export type bool = boolean;
  export type timestamp = bigint;
  export type bytes = string;
  export type key = string;
  export type key_hash = string
  export type signature = string
  export type lambda<T1,T2> = lambda_params
  
  export type list<T> = T[]
  export type option<T>=T|null
  export type big_map<K,V> = {kind : "literal", value : [K,V][]} | {kind : "abstract", value : bigint}
  export type map<K,V> = [K,V][]
  export type contract = MichelsonV1Expression
  export type operation = MichelsonV1Expression // TODO
  
  export function fail_on_micheline(msg : string,expr:MichelsonV1Expression) : void {
    console.log(`[fail_on_micheline][${msg}] : ${JSON.stringify(expr,null,2)}`);
    throw "fail_on_micheline"
  
  }
  
  function isExtended(expr: MichelsonV1Expression): expr is MichelsonV1ExpressionExtended {
    return (expr as MichelsonV1ExpressionExtended).prim !== undefined;
  }
  
  function isList(expr: MichelsonV1Expression): expr is MichelsonV1Expression[] {
    return (expr as MichelsonV1Expression[]) !== undefined;
  }
  
  function isInt(expr: MichelsonV1Expression): expr is MichelsonV1ExpressionBase {
    return (expr as MichelsonV1ExpressionBase).int !== undefined;
  }
  
  function isBytes(expr: MichelsonV1Expression): expr is MichelsonV1ExpressionBase {
    return (expr as MichelsonV1ExpressionBase).bytes !== undefined;
  }
  
  function isString(expr: MichelsonV1Expression): expr is MichelsonV1ExpressionBase {
    return (expr as MichelsonV1ExpressionBase).string !== undefined;
  }
  
  function isBase(expr : MichelsonV1Expression) : expr is MichelsonV1ExpressionBase {
    return (isInt(expr) || isBytes(expr) || isString(expr));
  }
  
  
  export function extract_list_from_pair(expr : MichelsonV1Expression,msg : string ="record type") : MichelsonV1Expression[]{
    if(isExtended(expr)){
      switch (expr.prim) {
        case 'Pair':
          if (expr.args !== undefined){
          return expr.args}
          else{
          return [];}
      
        default:
          fail_on_micheline(msg,expr);
          return [];
      }
    }
    else{
      fail_on_micheline(msg,expr)
      return []
    }
  }
  
  export function is_left_or_right(expr : MichelsonV1Expression) : boolean{
    if(isExtended(expr)){
      switch(expr.prim){
        case('Left'):
          return true;
        case('Right'):
          return true;
        default:
          return false;
      }
  
    }
    else {
      return false;
    }
  }
  
  export function retrieve_field_index_from_sumtype_typescript(expr : MichelsonV1Expression): [number,MichelsonV1Expression]{
    const aux = function(res : number, e : MichelsonV1Expression) : [number,MichelsonV1Expression]{
      if(isExtended(e)){
        switch (e.prim) {
          case 'Left':
            if (e.args !== undefined){
              if(e.args.length == 1){
                return aux(res,e.args[0]);
              }
              else{
                return [res,e]
              }
            }
            else{
            return [res,e];}
          
          case 'Right':
            if (e.args !== undefined){
              if(e.args.length == 1){
                return aux(res+1,e.args[0]);
              }
              else{
                return [res,e]
              }
            }
            else{
            return [res,e];}
        
          default:
            return [res,e]
        }
      }
      else{
        return [res,e]
      }
      }
      return aux(0,expr);
    }
  
    export function retrieve_path_from_sumtype_typescript(expr : MichelsonV1Expression): [boolean[],MichelsonV1Expression]{
      const aux = function(res : boolean[], e : MichelsonV1Expression) : [boolean[],MichelsonV1Expression]{
        if(isExtended(e)){
          switch (e.prim) {
            case 'Left':
              if (e.args !== undefined){
                if(e.args.length == 1){
                  return aux(res,e.args[0]);
                }
                else{
                  return [[true].concat(res),e]
                }
              }
              else{
              return [res,e];}
            
            case 'Right':
              if (e.args !== undefined){
                if(e.args.length == 1){
                  return aux([false].concat(res),e.args[0]);
                }
                else{
                  return [res,e]
                }
              }
              else{
              return [res,e];}
          
            default:
              return [res,e]
          }
        }
        else{
          return [res,e]
        }
        }
        return aux([],expr);
      }
  
  
  export function operation_encode(o : operation) : MichelsonV1Expression{
    return o
  }
  
  export function bytes_encode(b : bytes) : MichelsonV1Expression{
    return {bytes : b}
  }
  
  export function key_encode(k : key) : MichelsonV1Expression{
    return {string : k}
  }
  
  export function key_hash_encode(k : key_hash) : MichelsonV1Expression{
    return {string : k}
  }
  
  export function timestamp_encode(t : timestamp) : MichelsonV1Expression{
     return {int : t.toString()}
  }
  
  export function bool_encode(b : bool) : MichelsonV1Expression {
    return b? {prim : 'True'} : {prim: 'False'}
  }
  
  export function string_encode(s : string) : MichelsonV1Expression {
    return {string : s}
  }
  
  export function address_encode(a : address) : MichelsonV1Expression {
    return string_encode(a);
  }
  
  export function nat_encode(n : nat): MichelsonV1Expression {
    return {int : n.toString()};
  }
  
  export function int_encode(n : int): MichelsonV1Expression {
    return {int : n.toString()};
  }
  
  export function tez_encode(n : tez): MichelsonV1Expression {
    return {int : n.toString()};
  }
  
  export function signature_encode(s : signature): MichelsonV1Expression {
    return {string : s}
  }
  
  export function unit_encode(x : unit) : any {
    return {prim : "Unit"};
  }
  
  export function unit_decode(x : MichelsonV1Expression) : unit {
    return null;
  }
  
  export function list_encode<Type>(t_encode : (t : Type) => MichelsonV1Expression) : (x : Type[]) => MichelsonV1Expression{
    return (x : Type[]) =>
    {
      return x.map(function(v) : MichelsonV1Expression{
        return (t_encode(v))
      })
    }
  }
  
  export function set_encode<Type>(t_encode : (t : Type) => MichelsonV1Expression) : (x : Type[]) => MichelsonV1Expression{
    return (x : Type[]) =>
    {
      return x.map(function(v) : MichelsonV1Expression{
        return (t_encode(v))
      })
    }
  }
  export function option_encode<Type>(t_encode : (t : Type) => MichelsonV1Expression) : (x : option<Type>) => MichelsonV1Expression{
    return (x : option<Type>) =>
    {
  switch (x) {
    case null:
      return {prim : 'None'}
  
    default:
      return{prim : 'Some',args:[t_encode(x)]}
  }
    }
  }
  
  export function map_encode<K,V>(k_encode : (k : K) => MichelsonV1Expression,v_encode : (v : V) => MichelsonV1Expression)
  {return (bm : map<K,V>) =>
    {var res : MichelsonV1Expression[] = [];
      bm.forEach( (pair) => {
      let k : K = pair[0];
      let v : V = pair[1];
      let new_pair = {prim : 'Elt', args : [k_encode(k),v_encode(v)]}
      res.push(new_pair);
    })
  return res;}
  }
  
  export function big_map_encode<K,V>(k_encode : (k : K) => MichelsonV1Expression,v_encode : (v : V) => MichelsonV1Expression)
  {return (bm : big_map<K,V>) : MichelsonV1Expression =>{
    
    if((bm.kind == "abstract")){
      var res1 : MichelsonV1Expression = {int : bm.value.toString()}
      return(res1);
    }
    else{
      var res2 : MichelsonV1Expression[] = [];
      bm.value.forEach( (pair) => {
      let k : K = pair[0];
      let v : V = pair[1];
      let new_pair = {prim : 'Elt', args : [k_encode(k),v_encode(v)]}
      res2.push(new_pair);
    })
  return res2;}}
  }
  
  export function lambda_encode<K,V>(k_encode : (k : K) => MichelsonV1Expression,v_encode : (v : V) => MichelsonV1Expression)
  {
    return (l : lambda<K,V>) =>
    {return {prim : `LAMBDA`,args : [l.from,l.to_,l.body]}}
  }
  
  export function tuple2_encode<T1,T2>(x_encode : (x : T1) => MichelsonV1Expression,y_encode : (y : T2) => MichelsonV1Expression)
  /* : (x : [T1,T2]) => MichelsonV1Expression */
  {
    return (x : [T1,T2]) =>
      {
      return {prim : 'Pair', args : [x_encode(x[0]),y_encode(x[1])]
      }
  }
  }
  
  
  
  export function tuple3_encode<T1,T2,T3>(x_encode : (x : T1) => MichelsonV1Expression,y_encode : (y : T2) => MichelsonV1Expression,z_encode : (z : T3) => MichelsonV1Expression)
  /* : (x : [T1,T2]) => MichelsonV1Expression */
  {
    return (x : [T1,T2,T3]) =>
      {
      return {prim : 'Pair', args : [x_encode(x[0]),y_encode(x[1]),z_encode(x[2])]
      }
  }
  }
  
  export function tuple4_encode<T1,T2,T3,T4>(x_encode : (x : T1) => MichelsonV1Expression,y_encode : (y : T2) => MichelsonV1Expression,z_encode : (z : T3) => MichelsonV1Expression,
  t_encode : (t:T4) => MichelsonV1Expression)
  /* : (x : [T1,T2]) => MichelsonV1Expression */
  {
    return (x : [T1,T2,T3,T4]) =>
      {
      return {prim : 'Pair', args : [x_encode(x[0]),y_encode(x[1]),z_encode(x[2]),t_encode(x[3])]
      }
  }
  }
  
  export function tuple5_encode<T1,T2,T3,T4,T5>(x_encode : (x : T1) => MichelsonV1Expression,y_encode : (y : T2) => MichelsonV1Expression,z_encode : (z : T3) => MichelsonV1Expression,
  t_encode : (t:T4) => MichelsonV1Expression,u_encode : (u : T5) => MichelsonV1Expression)
  /* : (x : [T1,T2]) => MichelsonV1Expression */
  {
    return (x : [T1,T2,T3,T4,T5]) =>
      {
      return {prim : 'Pair', args : [x_encode(x[0]),y_encode(x[1]),z_encode(x[2]),t_encode(x[3]),u_encode(x[4])]
      }
  }
  }
  
  export function tuple6_encode<T1,T2,T3,T4,T5,T6>(x_encode : (x : T1) => MichelsonV1Expression,y_encode : (y : T2) => MichelsonV1Expression,z_encode : (z : T3) => MichelsonV1Expression,
  t_encode : (t:T4) => MichelsonV1Expression,u_encode : (u : T5) => MichelsonV1Expression,v_encode : (v : T6) => MichelsonV1Expression)
  /* : (x : [T1,T2]) => MichelsonV1Expression */
  {
    return (x : [T1,T2,T3,T4,T5,T6]) =>
      {
      return {prim : 'Pair', args : [x_encode(x[0]),y_encode(x[1]),z_encode(x[2]),t_encode(x[3]),u_encode(x[4]),v_encode(x[5])]
      }
  }
  }
  
  
  
  export function contract_encode(e : MichelsonV1Expression) : (x : contract) => MichelsonV1Expression
  {
    return (x : contract) =>
    {
      return x // TODO
    }
  }
  
  export function general_int_decode(m : MichelsonV1Expression,specific_message : string) : nat{
    if(isInt(m)){
      if (m.int == undefined){
        fail_on_micheline(specific_message,m);
        throw specific_message;
      }
      else{
      return BigInt(m.int)
      }
    }
    else{
      fail_on_micheline(specific_message,m);
      throw specific_message;
    }
  }
  
  export function general_string_decode(m : MichelsonV1Expression,specific_message : string) : string{
    if(isString(m)){
      if(m.string !== undefined){
        return m.string;
      }else{
        fail_on_micheline(specific_message,m)
          throw specific_message;
      }
    }
    else{
      fail_on_micheline(specific_message,m);
      throw specific_message;
    }
  }
  
  export function string_decode(m : MichelsonV1Expression) : string {
    return general_string_decode(m,"string_decode")
  }
  
  export function address_decode(m : MichelsonV1Expression) : address{
    return general_string_decode(m,"address_decode")
  }
  
  export function bytes_decode(m : MichelsonV1Expression) : bytes{
    return general_string_decode(m,"bytes_decode")
  }
  
  export function key_decode(m : MichelsonV1Expression) : bytes{
    return general_string_decode(m,"key_decode")
  }
  
  export function signature_decode(m : MichelsonV1Expression) : signature{
    return general_string_decode(m,"signature")
  }
  
  export function key_hash_decode(m : MichelsonV1Expression) : bytes{
    return general_string_decode(m,"key_hash_decode")
  }
  
  export function nat_decode(m : MichelsonV1Expression) : nat{
   return (general_int_decode(m,"nat_decode"))
  }
  
  export function int_decode(m : MichelsonV1Expression) : int{
    return (general_int_decode(m,"int_decode"))
   }
  
  export function tez_decode(m : MichelsonV1Expression) : tez{
    return (general_int_decode(m,"tez_decode"))
  }
  
  export function timestamp_decode(m : MichelsonV1Expression) : timestamp {
   return (general_int_decode(m,"timestamp_decode"))
  }
  
  export function bool_decode(m : MichelsonV1Expression) : boolean{
    if(isExtended(m)){
      switch (m.prim) {
        case 'True':
          return true;
        
        case 'False':
          return false;
      
        default:
          fail_on_micheline("bool_decode",m)
          throw "bool_decode"
  }}
  else{
    fail_on_micheline("bool_decode",m)
    throw "bool_decode"
  }}
  
  
  export function option_decode<Type>(t_decode :  (m : MichelsonV1Expression) => Type) : (m : MichelsonV1Expression) => option<Type>{
    return (m : MichelsonV1Expression) =>
    {
      if (isExtended(m))
      {switch (m.prim) {
        case 'Some':
          if (m.args != undefined && m.args.length == 1)
          {return t_decode(m.args[0])}
          else
          {return null}
        case 'None':
          return null
        default:
          {fail_on_micheline("option_decode",m); throw "option decode"}
      }
    }
      else
      {fail_on_micheline("option_decode",m); throw "option decode"}
  }}
  
  export function list_decode<Type>(t_decode :  (m : MichelsonV1Expression) => Type) : (x : MichelsonV1Expression) => list<Type>{
    return (x : MichelsonV1Expression) =>
    {
      if(isList(x))
      {
        return x.map(function(v : MichelsonV1Expression) : Type{
        return (t_decode(v))
      })
    }
      else
      {fail_on_micheline("list_decode",x)
      throw ""}
    }
  }
  
  export function set_decode<Type>(t_decode :  (m : MichelsonV1Expression) => Type) : (x : MichelsonV1Expression) => list<Type>{
    return (x : MichelsonV1Expression) =>
    {
      if(isList(x))
      {
        return x.map(function(v : MichelsonV1Expression) : Type{
        return (t_decode(v))
      })
    }
      else
      {fail_on_micheline("set_decode",x)
      throw ""}
    }
  }
  
  export function big_map_decode<K,V>(k_decode : (m : MichelsonV1Expression) => K,v_decode : (m : MichelsonV1Expression) => V) :
  (m : MichelsonV1Expression) => big_map<K,V>
  {return (m : MichelsonV1Expression) =>
    {if((isInt(m) && m.int !== undefined)) {
      return {kind : "abstract", value : BigInt (m.int)}
    }
    else
    {
      if(isList(m)){
      var value : [K,V][] = []
      m.forEach( (x : MichelsonV1Expression) =>
      {
        if(isExtended(x) && x.prim == 'Elt' && x.args !== undefined && x.args.length == 2){
          let x1 = k_decode(x.args[0])
          let x2 = v_decode(x.args[1])
          value.push([x1,x2])
        }
      }
      )
      var res : big_map<K,V> = {kind : "literal", value}
      return res;
      }
      else
      {
      fail_on_micheline("big_map_decode",m);
      throw "Could not decode big_map"
    }
  }
  }
  }
  
  export function lambda_decode<K,V>(k_decode : (m : MichelsonV1Expression) => K,v_decode : (m : MichelsonV1Expression) => V) :
  (m : MichelsonV1Expression) => lambda<K,V>
  {return (m : MichelsonV1Expression) =>
    {if(isExtended(m) && m.prim == 'LAMBDA' && m.args !== undefined && m.args.length == 3){
      let res : lambda<K,V> = {from : m.args[0],to_ : m.args[1], body : m.args[2]}
      return res
    }
    else
    fail_on_micheline("lambda_decode",m); throw "lambda_decode"
  }
  }
  
  export function map_decode<K,V>(k_decode : (m : MichelsonV1Expression) => K,v_decode : (m : MichelsonV1Expression) => V) :
  (m : MichelsonV1Expression) => map<K,V>
  {return (m : MichelsonV1Expression) =>
    {if(isList(m)){
      var value : [K,V][] = []
      m.forEach( (x : MichelsonV1Expression) =>
      {
        if(isExtended(x) && x.prim == 'Elt' && x.args != undefined && x.args.length == 2){
          let x1 = k_decode(x.args[0])
          let x2 = v_decode(x.args[1])
          value.push([x1,x2])
        }
      }
      )
      var res : map<K,V> = value
      return res;
      }
      else
      {
      fail_on_micheline("map_decode",m);
      throw "Could not decode big_map"
    }
  }
  }
  
  export function contract_decode(m : MichelsonV1Expression) : (x : MichelsonV1Expression) => contract
  {
    return (m : MichelsonV1Expression) =>
    {
     return m;
    }
  }
  
  export function tuple7_encode<T1,T2,T3,T4,T5,T6,T7>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6])]}
             }
         }
  export function tuple8_encode<T1,T2,T3,T4,T5,T6,T7,T8>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7])]}
             }
         }
  export function tuple9_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8])]}
             }
         }
  export function tuple10_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9])]}
             }
         }
  export function tuple11_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10])]}
             }
         }
  export function tuple12_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11])]}
             }
         }
  export function tuple13_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12])]}
             }
         }
  export function tuple14_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13])]}
             }
         }
  export function tuple15_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14])]}
             }
         }
  export function tuple16_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15])]}
             }
         }
  export function tuple17_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16])]}
             }
         }
  export function tuple18_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17])]}
             }
         }
  export function tuple19_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18])]}
             }
         }
  export function tuple20_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19])]}
             }
         }
  export function tuple21_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20])]}
             }
         }
  export function tuple22_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21])]}
             }
         }
  export function tuple23_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22])]}
             }
         }
  export function tuple24_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23])]}
             }
         }
  export function tuple25_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24])]}
             }
         }
  export function tuple26_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25])]}
             }
         }
  export function tuple27_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26])]}
             }
         }
  export function tuple28_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27])]}
             }
         }
  export function tuple29_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28])]}
             }
         }
  export function tuple30_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29])]}
             }
         }
  export function tuple31_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30])]}
             }
         }
  export function tuple32_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31])]}
             }
         }
  export function tuple33_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32])]}
             }
         }
  export function tuple34_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33])]}
             }
         }
  export function tuple35_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34])]}
             }
         }
  export function tuple36_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression,x36_encode : (x36 : T36) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34]),x36_encode(x[35])]}
             }
         }
  export function tuple37_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression,x36_encode : (x36 : T36) => MichelsonV1Expression,x37_encode : (x37 : T37) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34]),x36_encode(x[35]),x37_encode(x[36])]}
             }
         }
  export function tuple38_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression,x36_encode : (x36 : T36) => MichelsonV1Expression,x37_encode : (x37 : T37) => MichelsonV1Expression,x38_encode : (x38 : T38) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34]),x36_encode(x[35]),x37_encode(x[36]),x38_encode(x[37])]}
             }
         }
  export function tuple39_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression,x36_encode : (x36 : T36) => MichelsonV1Expression,x37_encode : (x37 : T37) => MichelsonV1Expression,x38_encode : (x38 : T38) => MichelsonV1Expression,x39_encode : (x39 : T39) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34]),x36_encode(x[35]),x37_encode(x[36]),x38_encode(x[37]),x39_encode(x[38])]}
             }
         }
  export function tuple40_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression,x36_encode : (x36 : T36) => MichelsonV1Expression,x37_encode : (x37 : T37) => MichelsonV1Expression,x38_encode : (x38 : T38) => MichelsonV1Expression,x39_encode : (x39 : T39) => MichelsonV1Expression,x40_encode : (x40 : T40) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34]),x36_encode(x[35]),x37_encode(x[36]),x38_encode(x[37]),x39_encode(x[38]),x40_encode(x[39])]}
             }
         }
  export function tuple41_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression,x36_encode : (x36 : T36) => MichelsonV1Expression,x37_encode : (x37 : T37) => MichelsonV1Expression,x38_encode : (x38 : T38) => MichelsonV1Expression,x39_encode : (x39 : T39) => MichelsonV1Expression,x40_encode : (x40 : T40) => MichelsonV1Expression,x41_encode : (x41 : T41) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34]),x36_encode(x[35]),x37_encode(x[36]),x38_encode(x[37]),x39_encode(x[38]),x40_encode(x[39]),x41_encode(x[40])]}
             }
         }
  export function tuple42_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression,x36_encode : (x36 : T36) => MichelsonV1Expression,x37_encode : (x37 : T37) => MichelsonV1Expression,x38_encode : (x38 : T38) => MichelsonV1Expression,x39_encode : (x39 : T39) => MichelsonV1Expression,x40_encode : (x40 : T40) => MichelsonV1Expression,x41_encode : (x41 : T41) => MichelsonV1Expression,x42_encode : (x42 : T42) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34]),x36_encode(x[35]),x37_encode(x[36]),x38_encode(x[37]),x39_encode(x[38]),x40_encode(x[39]),x41_encode(x[40]),x42_encode(x[41])]}
             }
         }
  export function tuple43_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression,x36_encode : (x36 : T36) => MichelsonV1Expression,x37_encode : (x37 : T37) => MichelsonV1Expression,x38_encode : (x38 : T38) => MichelsonV1Expression,x39_encode : (x39 : T39) => MichelsonV1Expression,x40_encode : (x40 : T40) => MichelsonV1Expression,x41_encode : (x41 : T41) => MichelsonV1Expression,x42_encode : (x42 : T42) => MichelsonV1Expression,x43_encode : (x43 : T43) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34]),x36_encode(x[35]),x37_encode(x[36]),x38_encode(x[37]),x39_encode(x[38]),x40_encode(x[39]),x41_encode(x[40]),x42_encode(x[41]),x43_encode(x[42])]}
             }
         }
  export function tuple44_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression,x36_encode : (x36 : T36) => MichelsonV1Expression,x37_encode : (x37 : T37) => MichelsonV1Expression,x38_encode : (x38 : T38) => MichelsonV1Expression,x39_encode : (x39 : T39) => MichelsonV1Expression,x40_encode : (x40 : T40) => MichelsonV1Expression,x41_encode : (x41 : T41) => MichelsonV1Expression,x42_encode : (x42 : T42) => MichelsonV1Expression,x43_encode : (x43 : T43) => MichelsonV1Expression,x44_encode : (x44 : T44) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34]),x36_encode(x[35]),x37_encode(x[36]),x38_encode(x[37]),x39_encode(x[38]),x40_encode(x[39]),x41_encode(x[40]),x42_encode(x[41]),x43_encode(x[42]),x44_encode(x[43])]}
             }
         }
  export function tuple45_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression,x36_encode : (x36 : T36) => MichelsonV1Expression,x37_encode : (x37 : T37) => MichelsonV1Expression,x38_encode : (x38 : T38) => MichelsonV1Expression,x39_encode : (x39 : T39) => MichelsonV1Expression,x40_encode : (x40 : T40) => MichelsonV1Expression,x41_encode : (x41 : T41) => MichelsonV1Expression,x42_encode : (x42 : T42) => MichelsonV1Expression,x43_encode : (x43 : T43) => MichelsonV1Expression,x44_encode : (x44 : T44) => MichelsonV1Expression,x45_encode : (x45 : T45) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34]),x36_encode(x[35]),x37_encode(x[36]),x38_encode(x[37]),x39_encode(x[38]),x40_encode(x[39]),x41_encode(x[40]),x42_encode(x[41]),x43_encode(x[42]),x44_encode(x[43]),x45_encode(x[44])]}
             }
         }
  export function tuple46_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression,x36_encode : (x36 : T36) => MichelsonV1Expression,x37_encode : (x37 : T37) => MichelsonV1Expression,x38_encode : (x38 : T38) => MichelsonV1Expression,x39_encode : (x39 : T39) => MichelsonV1Expression,x40_encode : (x40 : T40) => MichelsonV1Expression,x41_encode : (x41 : T41) => MichelsonV1Expression,x42_encode : (x42 : T42) => MichelsonV1Expression,x43_encode : (x43 : T43) => MichelsonV1Expression,x44_encode : (x44 : T44) => MichelsonV1Expression,x45_encode : (x45 : T45) => MichelsonV1Expression,x46_encode : (x46 : T46) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34]),x36_encode(x[35]),x37_encode(x[36]),x38_encode(x[37]),x39_encode(x[38]),x40_encode(x[39]),x41_encode(x[40]),x42_encode(x[41]),x43_encode(x[42]),x44_encode(x[43]),x45_encode(x[44]),x46_encode(x[45])]}
             }
         }
  export function tuple47_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression,x36_encode : (x36 : T36) => MichelsonV1Expression,x37_encode : (x37 : T37) => MichelsonV1Expression,x38_encode : (x38 : T38) => MichelsonV1Expression,x39_encode : (x39 : T39) => MichelsonV1Expression,x40_encode : (x40 : T40) => MichelsonV1Expression,x41_encode : (x41 : T41) => MichelsonV1Expression,x42_encode : (x42 : T42) => MichelsonV1Expression,x43_encode : (x43 : T43) => MichelsonV1Expression,x44_encode : (x44 : T44) => MichelsonV1Expression,x45_encode : (x45 : T45) => MichelsonV1Expression,x46_encode : (x46 : T46) => MichelsonV1Expression,x47_encode : (x47 : T47) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34]),x36_encode(x[35]),x37_encode(x[36]),x38_encode(x[37]),x39_encode(x[38]),x40_encode(x[39]),x41_encode(x[40]),x42_encode(x[41]),x43_encode(x[42]),x44_encode(x[43]),x45_encode(x[44]),x46_encode(x[45]),x47_encode(x[46])]}
             }
         }
  export function tuple48_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression,x36_encode : (x36 : T36) => MichelsonV1Expression,x37_encode : (x37 : T37) => MichelsonV1Expression,x38_encode : (x38 : T38) => MichelsonV1Expression,x39_encode : (x39 : T39) => MichelsonV1Expression,x40_encode : (x40 : T40) => MichelsonV1Expression,x41_encode : (x41 : T41) => MichelsonV1Expression,x42_encode : (x42 : T42) => MichelsonV1Expression,x43_encode : (x43 : T43) => MichelsonV1Expression,x44_encode : (x44 : T44) => MichelsonV1Expression,x45_encode : (x45 : T45) => MichelsonV1Expression,x46_encode : (x46 : T46) => MichelsonV1Expression,x47_encode : (x47 : T47) => MichelsonV1Expression,x48_encode : (x48 : T48) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34]),x36_encode(x[35]),x37_encode(x[36]),x38_encode(x[37]),x39_encode(x[38]),x40_encode(x[39]),x41_encode(x[40]),x42_encode(x[41]),x43_encode(x[42]),x44_encode(x[43]),x45_encode(x[44]),x46_encode(x[45]),x47_encode(x[46]),x48_encode(x[47])]}
             }
         }
  export function tuple49_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression,x36_encode : (x36 : T36) => MichelsonV1Expression,x37_encode : (x37 : T37) => MichelsonV1Expression,x38_encode : (x38 : T38) => MichelsonV1Expression,x39_encode : (x39 : T39) => MichelsonV1Expression,x40_encode : (x40 : T40) => MichelsonV1Expression,x41_encode : (x41 : T41) => MichelsonV1Expression,x42_encode : (x42 : T42) => MichelsonV1Expression,x43_encode : (x43 : T43) => MichelsonV1Expression,x44_encode : (x44 : T44) => MichelsonV1Expression,x45_encode : (x45 : T45) => MichelsonV1Expression,x46_encode : (x46 : T46) => MichelsonV1Expression,x47_encode : (x47 : T47) => MichelsonV1Expression,x48_encode : (x48 : T48) => MichelsonV1Expression,x49_encode : (x49 : T49) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34]),x36_encode(x[35]),x37_encode(x[36]),x38_encode(x[37]),x39_encode(x[38]),x40_encode(x[39]),x41_encode(x[40]),x42_encode(x[41]),x43_encode(x[42]),x44_encode(x[43]),x45_encode(x[44]),x46_encode(x[45]),x47_encode(x[46]),x48_encode(x[47]),x49_encode(x[48])]}
             }
         }
  export function tuple50_encode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49,T50>(x1_encode : (x1 : T1) => MichelsonV1Expression,x2_encode : (x2 : T2) => MichelsonV1Expression,x3_encode : (x3 : T3) => MichelsonV1Expression,x4_encode : (x4 : T4) => MichelsonV1Expression,x5_encode : (x5 : T5) => MichelsonV1Expression,x6_encode : (x6 : T6) => MichelsonV1Expression,x7_encode : (x7 : T7) => MichelsonV1Expression,x8_encode : (x8 : T8) => MichelsonV1Expression,x9_encode : (x9 : T9) => MichelsonV1Expression,x10_encode : (x10 : T10) => MichelsonV1Expression,x11_encode : (x11 : T11) => MichelsonV1Expression,x12_encode : (x12 : T12) => MichelsonV1Expression,x13_encode : (x13 : T13) => MichelsonV1Expression,x14_encode : (x14 : T14) => MichelsonV1Expression,x15_encode : (x15 : T15) => MichelsonV1Expression,x16_encode : (x16 : T16) => MichelsonV1Expression,x17_encode : (x17 : T17) => MichelsonV1Expression,x18_encode : (x18 : T18) => MichelsonV1Expression,x19_encode : (x19 : T19) => MichelsonV1Expression,x20_encode : (x20 : T20) => MichelsonV1Expression,x21_encode : (x21 : T21) => MichelsonV1Expression,x22_encode : (x22 : T22) => MichelsonV1Expression,x23_encode : (x23 : T23) => MichelsonV1Expression,x24_encode : (x24 : T24) => MichelsonV1Expression,x25_encode : (x25 : T25) => MichelsonV1Expression,x26_encode : (x26 : T26) => MichelsonV1Expression,x27_encode : (x27 : T27) => MichelsonV1Expression,x28_encode : (x28 : T28) => MichelsonV1Expression,x29_encode : (x29 : T29) => MichelsonV1Expression,x30_encode : (x30 : T30) => MichelsonV1Expression,x31_encode : (x31 : T31) => MichelsonV1Expression,x32_encode : (x32 : T32) => MichelsonV1Expression,x33_encode : (x33 : T33) => MichelsonV1Expression,x34_encode : (x34 : T34) => MichelsonV1Expression,x35_encode : (x35 : T35) => MichelsonV1Expression,x36_encode : (x36 : T36) => MichelsonV1Expression,x37_encode : (x37 : T37) => MichelsonV1Expression,x38_encode : (x38 : T38) => MichelsonV1Expression,x39_encode : (x39 : T39) => MichelsonV1Expression,x40_encode : (x40 : T40) => MichelsonV1Expression,x41_encode : (x41 : T41) => MichelsonV1Expression,x42_encode : (x42 : T42) => MichelsonV1Expression,x43_encode : (x43 : T43) => MichelsonV1Expression,x44_encode : (x44 : T44) => MichelsonV1Expression,x45_encode : (x45 : T45) => MichelsonV1Expression,x46_encode : (x46 : T46) => MichelsonV1Expression,x47_encode : (x47 : T47) => MichelsonV1Expression,x48_encode : (x48 : T48) => MichelsonV1Expression,x49_encode : (x49 : T49) => MichelsonV1Expression,x50_encode : (x50 : T50) => MichelsonV1Expression)
         {
           return (x : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49,T50]) =>
             {
               return {prim : 'Pair', args : [x1_encode(x[0]),x2_encode(x[1]),x3_encode(x[2]),x4_encode(x[3]),x5_encode(x[4]),x6_encode(x[5]),x7_encode(x[6]),x8_encode(x[7]),x9_encode(x[8]),x10_encode(x[9]),x11_encode(x[10]),x12_encode(x[11]),x13_encode(x[12]),x14_encode(x[13]),x15_encode(x[14]),x16_encode(x[15]),x17_encode(x[16]),x18_encode(x[17]),x19_encode(x[18]),x20_encode(x[19]),x21_encode(x[20]),x22_encode(x[21]),x23_encode(x[22]),x24_encode(x[23]),x25_encode(x[24]),x26_encode(x[25]),x27_encode(x[26]),x28_encode(x[27]),x29_encode(x[28]),x30_encode(x[29]),x31_encode(x[30]),x32_encode(x[31]),x33_encode(x[32]),x34_encode(x[33]),x35_encode(x[34]),x36_encode(x[35]),x37_encode(x[36]),x38_encode(x[37]),x39_encode(x[38]),x40_encode(x[39]),x41_encode(x[40]),x42_encode(x[41]),x43_encode(x[42]),x44_encode(x[43]),x45_encode(x[44]),x46_encode(x[45]),x47_encode(x[46]),x48_encode(x[47]),x49_encode(x[48]),x50_encode(x[49])]}
             }
         }
  
  
  export function tuple2_decode<T1,T2>(x_decode : (x : MichelsonV1Expression) => T1,y_decode : (y : MichelsonV1Expression) => T2) :
  (x : MichelsonV1Expression) => [T1,T2]
  /* : (x : [T1,T2]) => MichelsonV1Expression */
  {
    return (x : MichelsonV1Expression) =>
      {
        if(isExtended(x)){
          if(x.prim == 'Pair' && x.args !== undefined){
            return [x_decode(x.args[0]),y_decode(x.args[1])]
          }
          else{
            fail_on_micheline("tuple2_decode",x)
            throw "tuple2_decode"
          }
        }
        else{
          if(isList(x)){
            return([x_decode(x[0]),y_decode(x[1])])
          }
          else{
          fail_on_micheline("tuple2_decode",x)
          throw "tuple2_decode"
        }
      }
  }
  }
  
  export function concat3<T1,T2,T3>(x : T1, l : [T2,T3]) : [T1,T2,T3] {
    return [x,l[0],l[1]]
    }
  export function tuple3_decode<T1,T2,T3>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3): (x : MichelsonV1Expression) => [T1,T2,T3]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat3(t1_decode(x.args[0]),(tuple2_decode(t2_decode,t3_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple3_decode",x)
            throw "tuple3_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 3){
                return concat3(t1_decode(x[0]),(tuple2_decode(t2_decode,t3_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple3_decode",x)
            throw "tuple3_decode"
          }
          }
      }
  }
  
  export function concat4<T1,T2,T3,T4>(x : T1, l : [T2,T3,T4]) : [T1,T2,T3,T4] {
    return [x,l[0],l[1],l[2]]
    }
  export function tuple4_decode<T1,T2,T3,T4>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4): (x : MichelsonV1Expression) => [T1,T2,T3,T4]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat4(t1_decode(x.args[0]),(tuple3_decode(t2_decode,t3_decode,t4_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple4_decode",x)
            throw "tuple4_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 4){
                return concat4(t1_decode(x[0]),(tuple3_decode(t2_decode,t3_decode,t4_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple4_decode",x)
            throw "tuple4_decode"
          }
          }
      }
  }
  
  export function concat5<T1,T2,T3,T4,T5>(x : T1, l : [T2,T3,T4,T5]) : [T1,T2,T3,T4,T5] {
    return [x,l[0],l[1],l[2],l[3]]
    }
  export function tuple5_decode<T1,T2,T3,T4,T5>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat5(t1_decode(x.args[0]),(tuple4_decode(t2_decode,t3_decode,t4_decode,t5_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple5_decode",x)
            throw "tuple5_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 5){
                return concat5(t1_decode(x[0]),(tuple4_decode(t2_decode,t3_decode,t4_decode,t5_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple5_decode",x)
            throw "tuple5_decode"
          }
          }
      }
  }
  
  export function concat6<T1,T2,T3,T4,T5,T6>(x : T1, l : [T2,T3,T4,T5,T6]) : [T1,T2,T3,T4,T5,T6] {
    return [x,l[0],l[1],l[2],l[3],l[4]]
    }
  export function tuple6_decode<T1,T2,T3,T4,T5,T6>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat6(t1_decode(x.args[0]),(tuple5_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple6_decode",x)
            throw "tuple6_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 6){
                return concat6(t1_decode(x[0]),(tuple5_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple6_decode",x)
            throw "tuple6_decode"
          }
          }
      }
  }
  
  export function concat7<T1,T2,T3,T4,T5,T6,T7>(x : T1, l : [T2,T3,T4,T5,T6,T7]) : [T1,T2,T3,T4,T5,T6,T7] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5]]
    }
  export function tuple7_decode<T1,T2,T3,T4,T5,T6,T7>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat7(t1_decode(x.args[0]),(tuple6_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple7_decode",x)
            throw "tuple7_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 7){
                return concat7(t1_decode(x[0]),(tuple6_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple7_decode",x)
            throw "tuple7_decode"
          }
          }
      }
  }
  
  export function concat8<T1,T2,T3,T4,T5,T6,T7,T8>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8]) : [T1,T2,T3,T4,T5,T6,T7,T8] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6]]
    }
  export function tuple8_decode<T1,T2,T3,T4,T5,T6,T7,T8>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat8(t1_decode(x.args[0]),(tuple7_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple8_decode",x)
            throw "tuple8_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 8){
                return concat8(t1_decode(x[0]),(tuple7_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple8_decode",x)
            throw "tuple8_decode"
          }
          }
      }
  }
  
  export function concat9<T1,T2,T3,T4,T5,T6,T7,T8,T9>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7]]
    }
  export function tuple9_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat9(t1_decode(x.args[0]),(tuple8_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple9_decode",x)
            throw "tuple9_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 9){
                return concat9(t1_decode(x[0]),(tuple8_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple9_decode",x)
            throw "tuple9_decode"
          }
          }
      }
  }
  
  export function concat10<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8]]
    }
  export function tuple10_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat10(t1_decode(x.args[0]),(tuple9_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple10_decode",x)
            throw "tuple10_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 10){
                return concat10(t1_decode(x[0]),(tuple9_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple10_decode",x)
            throw "tuple10_decode"
          }
          }
      }
  }
  
  export function concat11<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9]]
    }
  export function tuple11_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat11(t1_decode(x.args[0]),(tuple10_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple11_decode",x)
            throw "tuple11_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 11){
                return concat11(t1_decode(x[0]),(tuple10_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple11_decode",x)
            throw "tuple11_decode"
          }
          }
      }
  }
  
  export function concat12<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10]]
    }
  export function tuple12_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat12(t1_decode(x.args[0]),(tuple11_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple12_decode",x)
            throw "tuple12_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 12){
                return concat12(t1_decode(x[0]),(tuple11_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple12_decode",x)
            throw "tuple12_decode"
          }
          }
      }
  }
  
  export function concat13<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11]]
    }
  export function tuple13_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat13(t1_decode(x.args[0]),(tuple12_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple13_decode",x)
            throw "tuple13_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 13){
                return concat13(t1_decode(x[0]),(tuple12_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple13_decode",x)
            throw "tuple13_decode"
          }
          }
      }
  }
  
  export function concat14<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12]]
    }
  export function tuple14_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat14(t1_decode(x.args[0]),(tuple13_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple14_decode",x)
            throw "tuple14_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 14){
                return concat14(t1_decode(x[0]),(tuple13_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple14_decode",x)
            throw "tuple14_decode"
          }
          }
      }
  }
  
  export function concat15<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13]]
    }
  export function tuple15_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat15(t1_decode(x.args[0]),(tuple14_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple15_decode",x)
            throw "tuple15_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 15){
                return concat15(t1_decode(x[0]),(tuple14_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple15_decode",x)
            throw "tuple15_decode"
          }
          }
      }
  }
  
  export function concat16<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14]]
    }
  export function tuple16_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat16(t1_decode(x.args[0]),(tuple15_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple16_decode",x)
            throw "tuple16_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 16){
                return concat16(t1_decode(x[0]),(tuple15_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple16_decode",x)
            throw "tuple16_decode"
          }
          }
      }
  }
  
  export function concat17<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15]]
    }
  export function tuple17_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat17(t1_decode(x.args[0]),(tuple16_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple17_decode",x)
            throw "tuple17_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 17){
                return concat17(t1_decode(x[0]),(tuple16_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple17_decode",x)
            throw "tuple17_decode"
          }
          }
      }
  }
  
  export function concat18<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16]]
    }
  export function tuple18_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat18(t1_decode(x.args[0]),(tuple17_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple18_decode",x)
            throw "tuple18_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 18){
                return concat18(t1_decode(x[0]),(tuple17_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple18_decode",x)
            throw "tuple18_decode"
          }
          }
      }
  }
  
  export function concat19<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17]]
    }
  export function tuple19_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat19(t1_decode(x.args[0]),(tuple18_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple19_decode",x)
            throw "tuple19_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 19){
                return concat19(t1_decode(x[0]),(tuple18_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple19_decode",x)
            throw "tuple19_decode"
          }
          }
      }
  }
  
  export function concat20<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18]]
    }
  export function tuple20_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat20(t1_decode(x.args[0]),(tuple19_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple20_decode",x)
            throw "tuple20_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 20){
                return concat20(t1_decode(x[0]),(tuple19_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple20_decode",x)
            throw "tuple20_decode"
          }
          }
      }
  }
  
  export function concat21<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19]]
    }
  export function tuple21_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat21(t1_decode(x.args[0]),(tuple20_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple21_decode",x)
            throw "tuple21_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 21){
                return concat21(t1_decode(x[0]),(tuple20_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple21_decode",x)
            throw "tuple21_decode"
          }
          }
      }
  }
  
  export function concat22<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20]]
    }
  export function tuple22_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat22(t1_decode(x.args[0]),(tuple21_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple22_decode",x)
            throw "tuple22_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 22){
                return concat22(t1_decode(x[0]),(tuple21_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple22_decode",x)
            throw "tuple22_decode"
          }
          }
      }
  }
  
  export function concat23<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21]]
    }
  export function tuple23_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat23(t1_decode(x.args[0]),(tuple22_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple23_decode",x)
            throw "tuple23_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 23){
                return concat23(t1_decode(x[0]),(tuple22_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple23_decode",x)
            throw "tuple23_decode"
          }
          }
      }
  }
  
  export function concat24<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22]]
    }
  export function tuple24_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat24(t1_decode(x.args[0]),(tuple23_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple24_decode",x)
            throw "tuple24_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 24){
                return concat24(t1_decode(x[0]),(tuple23_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple24_decode",x)
            throw "tuple24_decode"
          }
          }
      }
  }
  
  export function concat25<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23]]
    }
  export function tuple25_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat25(t1_decode(x.args[0]),(tuple24_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple25_decode",x)
            throw "tuple25_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 25){
                return concat25(t1_decode(x[0]),(tuple24_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple25_decode",x)
            throw "tuple25_decode"
          }
          }
      }
  }
  
  export function concat26<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24]]
    }
  export function tuple26_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat26(t1_decode(x.args[0]),(tuple25_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple26_decode",x)
            throw "tuple26_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 26){
                return concat26(t1_decode(x[0]),(tuple25_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple26_decode",x)
            throw "tuple26_decode"
          }
          }
      }
  }
  
  export function concat27<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25]]
    }
  export function tuple27_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat27(t1_decode(x.args[0]),(tuple26_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple27_decode",x)
            throw "tuple27_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 27){
                return concat27(t1_decode(x[0]),(tuple26_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple27_decode",x)
            throw "tuple27_decode"
          }
          }
      }
  }
  
  export function concat28<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26]]
    }
  export function tuple28_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat28(t1_decode(x.args[0]),(tuple27_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple28_decode",x)
            throw "tuple28_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 28){
                return concat28(t1_decode(x[0]),(tuple27_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple28_decode",x)
            throw "tuple28_decode"
          }
          }
      }
  }
  
  export function concat29<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27]]
    }
  export function tuple29_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat29(t1_decode(x.args[0]),(tuple28_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple29_decode",x)
            throw "tuple29_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 29){
                return concat29(t1_decode(x[0]),(tuple28_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple29_decode",x)
            throw "tuple29_decode"
          }
          }
      }
  }
  
  export function concat30<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28]]
    }
  export function tuple30_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat30(t1_decode(x.args[0]),(tuple29_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple30_decode",x)
            throw "tuple30_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 30){
                return concat30(t1_decode(x[0]),(tuple29_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple30_decode",x)
            throw "tuple30_decode"
          }
          }
      }
  }
  
  export function concat31<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29]]
    }
  export function tuple31_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat31(t1_decode(x.args[0]),(tuple30_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple31_decode",x)
            throw "tuple31_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 31){
                return concat31(t1_decode(x[0]),(tuple30_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple31_decode",x)
            throw "tuple31_decode"
          }
          }
      }
  }
  
  export function concat32<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30]]
    }
  export function tuple32_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat32(t1_decode(x.args[0]),(tuple31_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple32_decode",x)
            throw "tuple32_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 32){
                return concat32(t1_decode(x[0]),(tuple31_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple32_decode",x)
            throw "tuple32_decode"
          }
          }
      }
  }
  
  export function concat33<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31]]
    }
  export function tuple33_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat33(t1_decode(x.args[0]),(tuple32_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple33_decode",x)
            throw "tuple33_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 33){
                return concat33(t1_decode(x[0]),(tuple32_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple33_decode",x)
            throw "tuple33_decode"
          }
          }
      }
  }
  
  export function concat34<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32]]
    }
  export function tuple34_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat34(t1_decode(x.args[0]),(tuple33_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple34_decode",x)
            throw "tuple34_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 34){
                return concat34(t1_decode(x[0]),(tuple33_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple34_decode",x)
            throw "tuple34_decode"
          }
          }
      }
  }
  
  export function concat35<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33]]
    }
  export function tuple35_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat35(t1_decode(x.args[0]),(tuple34_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple35_decode",x)
            throw "tuple35_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 35){
                return concat35(t1_decode(x[0]),(tuple34_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple35_decode",x)
            throw "tuple35_decode"
          }
          }
      }
  }
  
  export function concat36<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33],l[34]]
    }
  export function tuple36_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35,t36_decode : (x : MichelsonV1Expression) => T36): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat36(t1_decode(x.args[0]),(tuple35_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple36_decode",x)
            throw "tuple36_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 36){
                return concat36(t1_decode(x[0]),(tuple35_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple36_decode",x)
            throw "tuple36_decode"
          }
          }
      }
  }
  
  export function concat37<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33],l[34],l[35]]
    }
  export function tuple37_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35,t36_decode : (x : MichelsonV1Expression) => T36,t37_decode : (x : MichelsonV1Expression) => T37): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat37(t1_decode(x.args[0]),(tuple36_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple37_decode",x)
            throw "tuple37_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 37){
                return concat37(t1_decode(x[0]),(tuple36_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple37_decode",x)
            throw "tuple37_decode"
          }
          }
      }
  }
  
  export function concat38<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33],l[34],l[35],l[36]]
    }
  export function tuple38_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35,t36_decode : (x : MichelsonV1Expression) => T36,t37_decode : (x : MichelsonV1Expression) => T37,t38_decode : (x : MichelsonV1Expression) => T38): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat38(t1_decode(x.args[0]),(tuple37_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple38_decode",x)
            throw "tuple38_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 38){
                return concat38(t1_decode(x[0]),(tuple37_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple38_decode",x)
            throw "tuple38_decode"
          }
          }
      }
  }
  
  export function concat39<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33],l[34],l[35],l[36],l[37]]
    }
  export function tuple39_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35,t36_decode : (x : MichelsonV1Expression) => T36,t37_decode : (x : MichelsonV1Expression) => T37,t38_decode : (x : MichelsonV1Expression) => T38,t39_decode : (x : MichelsonV1Expression) => T39): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat39(t1_decode(x.args[0]),(tuple38_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple39_decode",x)
            throw "tuple39_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 39){
                return concat39(t1_decode(x[0]),(tuple38_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple39_decode",x)
            throw "tuple39_decode"
          }
          }
      }
  }
  
  export function concat40<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33],l[34],l[35],l[36],l[37],l[38]]
    }
  export function tuple40_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35,t36_decode : (x : MichelsonV1Expression) => T36,t37_decode : (x : MichelsonV1Expression) => T37,t38_decode : (x : MichelsonV1Expression) => T38,t39_decode : (x : MichelsonV1Expression) => T39,t40_decode : (x : MichelsonV1Expression) => T40): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat40(t1_decode(x.args[0]),(tuple39_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple40_decode",x)
            throw "tuple40_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 40){
                return concat40(t1_decode(x[0]),(tuple39_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple40_decode",x)
            throw "tuple40_decode"
          }
          }
      }
  }
  
  export function concat41<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33],l[34],l[35],l[36],l[37],l[38],l[39]]
    }
  export function tuple41_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35,t36_decode : (x : MichelsonV1Expression) => T36,t37_decode : (x : MichelsonV1Expression) => T37,t38_decode : (x : MichelsonV1Expression) => T38,t39_decode : (x : MichelsonV1Expression) => T39,t40_decode : (x : MichelsonV1Expression) => T40,t41_decode : (x : MichelsonV1Expression) => T41): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat41(t1_decode(x.args[0]),(tuple40_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple41_decode",x)
            throw "tuple41_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 41){
                return concat41(t1_decode(x[0]),(tuple40_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple41_decode",x)
            throw "tuple41_decode"
          }
          }
      }
  }
  
  export function concat42<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33],l[34],l[35],l[36],l[37],l[38],l[39],l[40]]
    }
  export function tuple42_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35,t36_decode : (x : MichelsonV1Expression) => T36,t37_decode : (x : MichelsonV1Expression) => T37,t38_decode : (x : MichelsonV1Expression) => T38,t39_decode : (x : MichelsonV1Expression) => T39,t40_decode : (x : MichelsonV1Expression) => T40,t41_decode : (x : MichelsonV1Expression) => T41,t42_decode : (x : MichelsonV1Expression) => T42): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat42(t1_decode(x.args[0]),(tuple41_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple42_decode",x)
            throw "tuple42_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 42){
                return concat42(t1_decode(x[0]),(tuple41_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple42_decode",x)
            throw "tuple42_decode"
          }
          }
      }
  }
  
  export function concat43<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33],l[34],l[35],l[36],l[37],l[38],l[39],l[40],l[41]]
    }
  export function tuple43_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35,t36_decode : (x : MichelsonV1Expression) => T36,t37_decode : (x : MichelsonV1Expression) => T37,t38_decode : (x : MichelsonV1Expression) => T38,t39_decode : (x : MichelsonV1Expression) => T39,t40_decode : (x : MichelsonV1Expression) => T40,t41_decode : (x : MichelsonV1Expression) => T41,t42_decode : (x : MichelsonV1Expression) => T42,t43_decode : (x : MichelsonV1Expression) => T43): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat43(t1_decode(x.args[0]),(tuple42_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple43_decode",x)
            throw "tuple43_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 43){
                return concat43(t1_decode(x[0]),(tuple42_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple43_decode",x)
            throw "tuple43_decode"
          }
          }
      }
  }
  
  export function concat44<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33],l[34],l[35],l[36],l[37],l[38],l[39],l[40],l[41],l[42]]
    }
  export function tuple44_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35,t36_decode : (x : MichelsonV1Expression) => T36,t37_decode : (x : MichelsonV1Expression) => T37,t38_decode : (x : MichelsonV1Expression) => T38,t39_decode : (x : MichelsonV1Expression) => T39,t40_decode : (x : MichelsonV1Expression) => T40,t41_decode : (x : MichelsonV1Expression) => T41,t42_decode : (x : MichelsonV1Expression) => T42,t43_decode : (x : MichelsonV1Expression) => T43,t44_decode : (x : MichelsonV1Expression) => T44): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat44(t1_decode(x.args[0]),(tuple43_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode,t44_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple44_decode",x)
            throw "tuple44_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 44){
                return concat44(t1_decode(x[0]),(tuple43_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode,t44_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple44_decode",x)
            throw "tuple44_decode"
          }
          }
      }
  }
  
  export function concat45<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33],l[34],l[35],l[36],l[37],l[38],l[39],l[40],l[41],l[42],l[43]]
    }
  export function tuple45_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35,t36_decode : (x : MichelsonV1Expression) => T36,t37_decode : (x : MichelsonV1Expression) => T37,t38_decode : (x : MichelsonV1Expression) => T38,t39_decode : (x : MichelsonV1Expression) => T39,t40_decode : (x : MichelsonV1Expression) => T40,t41_decode : (x : MichelsonV1Expression) => T41,t42_decode : (x : MichelsonV1Expression) => T42,t43_decode : (x : MichelsonV1Expression) => T43,t44_decode : (x : MichelsonV1Expression) => T44,t45_decode : (x : MichelsonV1Expression) => T45): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat45(t1_decode(x.args[0]),(tuple44_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode,t44_decode,t45_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple45_decode",x)
            throw "tuple45_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 45){
                return concat45(t1_decode(x[0]),(tuple44_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode,t44_decode,t45_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple45_decode",x)
            throw "tuple45_decode"
          }
          }
      }
  }
  
  export function concat46<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33],l[34],l[35],l[36],l[37],l[38],l[39],l[40],l[41],l[42],l[43],l[44]]
    }
  export function tuple46_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35,t36_decode : (x : MichelsonV1Expression) => T36,t37_decode : (x : MichelsonV1Expression) => T37,t38_decode : (x : MichelsonV1Expression) => T38,t39_decode : (x : MichelsonV1Expression) => T39,t40_decode : (x : MichelsonV1Expression) => T40,t41_decode : (x : MichelsonV1Expression) => T41,t42_decode : (x : MichelsonV1Expression) => T42,t43_decode : (x : MichelsonV1Expression) => T43,t44_decode : (x : MichelsonV1Expression) => T44,t45_decode : (x : MichelsonV1Expression) => T45,t46_decode : (x : MichelsonV1Expression) => T46): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat46(t1_decode(x.args[0]),(tuple45_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode,t44_decode,t45_decode,t46_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple46_decode",x)
            throw "tuple46_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 46){
                return concat46(t1_decode(x[0]),(tuple45_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode,t44_decode,t45_decode,t46_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple46_decode",x)
            throw "tuple46_decode"
          }
          }
      }
  }
  
  export function concat47<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33],l[34],l[35],l[36],l[37],l[38],l[39],l[40],l[41],l[42],l[43],l[44],l[45]]
    }
  export function tuple47_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35,t36_decode : (x : MichelsonV1Expression) => T36,t37_decode : (x : MichelsonV1Expression) => T37,t38_decode : (x : MichelsonV1Expression) => T38,t39_decode : (x : MichelsonV1Expression) => T39,t40_decode : (x : MichelsonV1Expression) => T40,t41_decode : (x : MichelsonV1Expression) => T41,t42_decode : (x : MichelsonV1Expression) => T42,t43_decode : (x : MichelsonV1Expression) => T43,t44_decode : (x : MichelsonV1Expression) => T44,t45_decode : (x : MichelsonV1Expression) => T45,t46_decode : (x : MichelsonV1Expression) => T46,t47_decode : (x : MichelsonV1Expression) => T47): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat47(t1_decode(x.args[0]),(tuple46_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode,t44_decode,t45_decode,t46_decode,t47_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple47_decode",x)
            throw "tuple47_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 47){
                return concat47(t1_decode(x[0]),(tuple46_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode,t44_decode,t45_decode,t46_decode,t47_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple47_decode",x)
            throw "tuple47_decode"
          }
          }
      }
  }
  
  export function concat48<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33],l[34],l[35],l[36],l[37],l[38],l[39],l[40],l[41],l[42],l[43],l[44],l[45],l[46]]
    }
  export function tuple48_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35,t36_decode : (x : MichelsonV1Expression) => T36,t37_decode : (x : MichelsonV1Expression) => T37,t38_decode : (x : MichelsonV1Expression) => T38,t39_decode : (x : MichelsonV1Expression) => T39,t40_decode : (x : MichelsonV1Expression) => T40,t41_decode : (x : MichelsonV1Expression) => T41,t42_decode : (x : MichelsonV1Expression) => T42,t43_decode : (x : MichelsonV1Expression) => T43,t44_decode : (x : MichelsonV1Expression) => T44,t45_decode : (x : MichelsonV1Expression) => T45,t46_decode : (x : MichelsonV1Expression) => T46,t47_decode : (x : MichelsonV1Expression) => T47,t48_decode : (x : MichelsonV1Expression) => T48): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat48(t1_decode(x.args[0]),(tuple47_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode,t44_decode,t45_decode,t46_decode,t47_decode,t48_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple48_decode",x)
            throw "tuple48_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 48){
                return concat48(t1_decode(x[0]),(tuple47_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode,t44_decode,t45_decode,t46_decode,t47_decode,t48_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple48_decode",x)
            throw "tuple48_decode"
          }
          }
      }
  }
  
  export function concat49<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33],l[34],l[35],l[36],l[37],l[38],l[39],l[40],l[41],l[42],l[43],l[44],l[45],l[46],l[47]]
    }
  export function tuple49_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35,t36_decode : (x : MichelsonV1Expression) => T36,t37_decode : (x : MichelsonV1Expression) => T37,t38_decode : (x : MichelsonV1Expression) => T38,t39_decode : (x : MichelsonV1Expression) => T39,t40_decode : (x : MichelsonV1Expression) => T40,t41_decode : (x : MichelsonV1Expression) => T41,t42_decode : (x : MichelsonV1Expression) => T42,t43_decode : (x : MichelsonV1Expression) => T43,t44_decode : (x : MichelsonV1Expression) => T44,t45_decode : (x : MichelsonV1Expression) => T45,t46_decode : (x : MichelsonV1Expression) => T46,t47_decode : (x : MichelsonV1Expression) => T47,t48_decode : (x : MichelsonV1Expression) => T48,t49_decode : (x : MichelsonV1Expression) => T49): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat49(t1_decode(x.args[0]),(tuple48_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode,t44_decode,t45_decode,t46_decode,t47_decode,t48_decode,t49_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple49_decode",x)
            throw "tuple49_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 49){
                return concat49(t1_decode(x[0]),(tuple48_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode,t44_decode,t45_decode,t46_decode,t47_decode,t48_decode,t49_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple49_decode",x)
            throw "tuple49_decode"
          }
          }
      }
  }
  
  export function concat50<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49,T50>(x : T1, l : [T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49,T50]) : [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49,T50] {
    return [x,l[0],l[1],l[2],l[3],l[4],l[5],l[6],l[7],l[8],l[9],l[10],l[11],l[12],l[13],l[14],l[15],l[16],l[17],l[18],l[19],l[20],l[21],l[22],l[23],l[24],l[25],l[26],l[27],l[28],l[29],l[30],l[31],l[32],l[33],l[34],l[35],l[36],l[37],l[38],l[39],l[40],l[41],l[42],l[43],l[44],l[45],l[46],l[47],l[48]]
    }
  export function tuple50_decode<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49,T50>(t1_decode : (x : MichelsonV1Expression) => T1,t2_decode : (x : MichelsonV1Expression) => T2,t3_decode : (x : MichelsonV1Expression) => T3,t4_decode : (x : MichelsonV1Expression) => T4,t5_decode : (x : MichelsonV1Expression) => T5,t6_decode : (x : MichelsonV1Expression) => T6,t7_decode : (x : MichelsonV1Expression) => T7,t8_decode : (x : MichelsonV1Expression) => T8,t9_decode : (x : MichelsonV1Expression) => T9,t10_decode : (x : MichelsonV1Expression) => T10,t11_decode : (x : MichelsonV1Expression) => T11,t12_decode : (x : MichelsonV1Expression) => T12,t13_decode : (x : MichelsonV1Expression) => T13,t14_decode : (x : MichelsonV1Expression) => T14,t15_decode : (x : MichelsonV1Expression) => T15,t16_decode : (x : MichelsonV1Expression) => T16,t17_decode : (x : MichelsonV1Expression) => T17,t18_decode : (x : MichelsonV1Expression) => T18,t19_decode : (x : MichelsonV1Expression) => T19,t20_decode : (x : MichelsonV1Expression) => T20,t21_decode : (x : MichelsonV1Expression) => T21,t22_decode : (x : MichelsonV1Expression) => T22,t23_decode : (x : MichelsonV1Expression) => T23,t24_decode : (x : MichelsonV1Expression) => T24,t25_decode : (x : MichelsonV1Expression) => T25,t26_decode : (x : MichelsonV1Expression) => T26,t27_decode : (x : MichelsonV1Expression) => T27,t28_decode : (x : MichelsonV1Expression) => T28,t29_decode : (x : MichelsonV1Expression) => T29,t30_decode : (x : MichelsonV1Expression) => T30,t31_decode : (x : MichelsonV1Expression) => T31,t32_decode : (x : MichelsonV1Expression) => T32,t33_decode : (x : MichelsonV1Expression) => T33,t34_decode : (x : MichelsonV1Expression) => T34,t35_decode : (x : MichelsonV1Expression) => T35,t36_decode : (x : MichelsonV1Expression) => T36,t37_decode : (x : MichelsonV1Expression) => T37,t38_decode : (x : MichelsonV1Expression) => T38,t39_decode : (x : MichelsonV1Expression) => T39,t40_decode : (x : MichelsonV1Expression) => T40,t41_decode : (x : MichelsonV1Expression) => T41,t42_decode : (x : MichelsonV1Expression) => T42,t43_decode : (x : MichelsonV1Expression) => T43,t44_decode : (x : MichelsonV1Expression) => T44,t45_decode : (x : MichelsonV1Expression) => T45,t46_decode : (x : MichelsonV1Expression) => T46,t47_decode : (x : MichelsonV1Expression) => T47,t48_decode : (x : MichelsonV1Expression) => T48,t49_decode : (x : MichelsonV1Expression) => T49,t50_decode : (x : MichelsonV1Expression) => T50): (x : MichelsonV1Expression) => [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,T19,T20,T21,T22,T23,T24,T25,T26,T27,T28,T29,T30,T31,T32,T33,T34,T35,T36,T37,T38,T39,T40,T41,T42,T43,T44,T45,T46,T47,T48,T49,T50]{
  return (x : MichelsonV1Expression) =>
          {
          if(isExtended(x)) {
            if(x.prim == 'Pair' && x.args !== undefined && x.args.length >=2) {
              return concat50(t1_decode(x.args[0]),(tuple49_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode,t44_decode,t45_decode,t46_decode,t47_decode,t48_decode,t49_decode,t50_decode)(x.args.slice(1))))
              }
          else{
            fail_on_micheline("tuple50_decode",x)
            throw "tuple50_decode"
          }
          }
          else{//x is not a 'Pair' hence it is a Seq
                if(isList(x) && x.length >= 50){
                return concat50(t1_decode(x[0]),(tuple49_decode(t2_decode,t3_decode,t4_decode,t5_decode,t6_decode,t7_decode,t8_decode,t9_decode,t10_decode,t11_decode,t12_decode,t13_decode,t14_decode,t15_decode,t16_decode,t17_decode,t18_decode,t19_decode,t20_decode,t21_decode,t22_decode,t23_decode,t24_decode,t25_decode,t26_decode,t27_decode,t28_decode,t29_decode,t30_decode,t31_decode,t32_decode,t33_decode,t34_decode,t35_decode,t36_decode,t37_decode,t38_decode,t39_decode,t40_decode,t41_decode,t42_decode,t43_decode,t44_decode,t45_decode,t46_decode,t47_decode,t48_decode,t49_decode,t50_decode)(x.slice(1))))}
          else{
            fail_on_micheline("tuple50_decode",x)
            throw "tuple50_decode"
          }
          }
      }
  }
  
  
  
  
  export function operation_decode(m : MichelsonV1Expression) : operation{
    return m
  }
  
  function toStrRec(input: any): any {
    Object.keys(input).forEach(k => {
      let elt = input[k]
      if (elt === undefined || elt === null) {
        input[k] = undefined
      } else if (typeof elt === 'object') {
        input[k] = toStrRec(elt);
      } else {
        input[k] = elt.toString();
      }
    });
    return input;
  }
  
  
  export interface operation_result {
    hash: string | null;
    level: number;
    error: any;
  } 
  /**
   * Generic auxiliary function for transfers and contracts calls
   * @param tk : Tezos toolkit
   * @param transferParams : the transfer's parameters
   * @returns injection result
   */
   async function make_transactions(tk: TezosToolkit, transfersParams: Array<TransferParams>): Promise<operation_result> {
    var opHash = null;
    var level = 0;
    try {
      let source = await tk.signer.publicKeyHash();
      let contract = await tk.rpc.getContract(source);
      let counter = parseInt(contract.counter || '0', 10)
      let contents: Array<RPCOperation> = []
      await Promise.all(
        transfersParams.map(async function (transferParams) {
          let estimate = await tk.estimate.transfer(transferParams);
          const rpcTransferOperation = await createTransferOperation({
            ...transferParams,
            fee: estimate.suggestedFeeMutez,
            gasLimit: estimate.gasLimit,
            storageLimit: estimate.storageLimit
          });
          counter++;
          let v = {
            ...rpcTransferOperation,
            source,
            counter: counter,
          };
          contents.push(v)
        }));
      let header = await tk.rpc.getBlockHeader();
      level = header.level;
      let op = toStrRec({
        branch: header.hash,
        contents: contents
      })
      let forgedOp = await tk.rpc.forgeOperations(op)
      let signOp = await tk.signer.sign(forgedOp, new Uint8Array([3]));
      opHash = encodeOpHash(signOp.sbytes);
      let injectedoOpHash = await tk.rpc.injectOperation(signOp.sbytes)
      console.assert(injectedoOpHash == opHash);
      return { hash: opHash, level: level, error: null }
    } catch (error) {
      return { hash: opHash, level: level, error: error }
    }
  }
  
  export async function send(
    tk: TezosToolkit,
    kt1: string,
    entrypoint: string,
    value: MichelsonV1Expression,
    amount: number = 0): Promise<operation_result> {
    try {
      return await make_transactions(tk, [{
        amount: amount,
        to: kt1,
        parameter: { entrypoint, value }
      }]);
    } catch (error) {
      console.log(`[send]]: ${JSON.stringify(error, null, 2)}`);
      console.log(`[send]]: ${error}`);
      return { hash: null, level: -1, error: error };
    }
  }
  
  
  export function usleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  
  export async function wait_inclusion(
    tx: operation_result,
    debug = false) {
    let start_lvl = tx.level;
    let opH = tx.hash;
    if (true) {
        console.log(`[wait_inclusion] Waiting inclusion of operation ${opH} at level ${start_lvl}`);
        //console.log("[wait_inclusion] " + stringify(tx, null, 2));
    }
    var end_lvl = start_lvl + config.wait_for_block_x_levels;
    var authorized_failures = 10;
    let getBlock = async function (hash : any): Promise<any> {
        var b = null;
        while (b === null) {
            try {
                if (hash == null) {
                    b = await client.getBlock();
                } else {
                    b = await client.getBlock(hash);
                }
            } catch (error) {
                authorized_failures--;
                if (debug) {
                    console.log("[wait_inclusion/getBlock] " + error);
                    //console.log("[wait_inclusion/getBlock]" + stringify(error));
                }
                if (authorized_failures <= 0) {
                    process.exit(0);
                }
            }
        }
        return b;
    };
    let retro_inspection: any = async function (b: any) {
        var b = await getBlock(b.header.predecessor);
        if (debug) {
            console.log(`[wait_inclusion/retro_inspection] Retro inspect level ${b.header.level} for operation ${opH}`)
        };
        let found_op = b.operations[3].find((op : any) => op.hash === opH);
        if (found_op !== undefined) {
            return { block: b, included: true, op: found_op }
        }
        if (b.header.level < start_lvl) {
            throw "Operation not found"
        }
        return await retro_inspection(b);
    };
    let aux: any = async function () {
        var b = await getBlock(null);
        var level = b.header.level;
        console.log(`Waiting inclusion ... block level is ${level}`);
        let found_op = b.operations[3].find((op : any) => op.hash === opH);
        if (found_op !== undefined) {
            return { block: b, included: true, op: found_op }
        }
        if (end_lvl < level) {
            try {
                await retro_inspection(b);
            } catch (error) {
                console.log(error);
                return { block: b, included: false, op: null }
            }
        }
        while (level == b.header.level) {
            usleep(config.usleep);
            try {
                let b2 = await client.getBlock();
                level = b2.header.level;
            } catch (error) {
                authorized_failures--;
                console.log(JSON.stringify(error));
                if (authorized_failures <= 0) {
                    process.exit(0);
                }
            }
        }
        var res = await aux();
        return res;
    }
    if (opH == null) {
        throw ('[wait_inclusion] Cannot monitor an operation whose hash is null');
    }
    return await aux()
  }