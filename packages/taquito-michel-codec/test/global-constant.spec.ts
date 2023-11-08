import { Parser, ParserOptions } from '../src/micheline-parser';
import {
  globalConstant,
  globalConstantJSON,
  script,
  scriptJSON,
} from './helpers/global-constants-helper';

describe('Expand global constants', () => {
  const registeredIntExprJSON = { prim: 'int' };
  const registeredDropExprJSON = { prim: 'DROP', args: [{ int: '2' }] };

  const parserOptions: ParserOptions = {
    expandGlobalConstant: {
      constantHashInt: registeredIntExprJSON,
      constantHashDrop: registeredDropExprJSON,
    },
  };

  const p = new Parser(parserOptions);

  it('Should expand global constants in script using parseJSON', () => {
    expect(
      p.parseJSON(
        scriptJSON(globalConstantJSON('constantHashInt'), globalConstantJSON('constantHashDrop'))
      )
    ).toEqual(scriptJSON(registeredIntExprJSON, registeredDropExprJSON));
  });

  it('Should expand global constants in script using parseSequence', () => {
    expect(
      stringify(
        p.parseSequence(
          script(globalConstant('constantHashInt'), globalConstant('constantHashDrop'))
        )
      )
    ).toEqual(stringify(scriptJSON(registeredIntExprJSON, registeredDropExprJSON)));
  });

  it('Should expand global constants in script using parseList', () => {
    expect(
      stringify(
        p.parseList(
          `IF_LEFT { IF_LEFT { SWAP ; SUB } { ADD } } { ${globalConstant(
            'constantHashDrop'
          )} ; PUSH int 0 }`
        )
      )
    ).toEqual(
      stringify({
        prim: 'IF_LEFT',
        args: [
          [
            {
              prim: 'IF_LEFT',
              args: [[{ prim: 'SWAP' }, { prim: 'SUB' }], [{ prim: 'ADD' }]],
            },
          ],
          [
            registeredDropExprJSON,
            {
              prim: 'PUSH',
              args: [{ prim: 'int' }, { int: '0' }],
            },
          ],
        ],
      })
    );
  });

  it('Should expand global constants in script using parseMichelineExpression', () => {
    expect(
      stringify(
        p.parseMichelineExpression(
          `(or (${globalConstant('constantHashInt')}) (${globalConstant('constantHashInt')}))`
        )
      )
    ).toEqual(
      stringify({
        prim: 'or',
        args: [registeredIntExprJSON, registeredIntExprJSON],
      })
    );
  });

  it('Should expand global constants in script using parseScript', () => {
    expect(
      stringify(
        p.parseScript(script(globalConstant('constantHashInt'), globalConstant('constantHashDrop')))
      )
    ).toEqual(stringify(scriptJSON(registeredIntExprJSON, registeredDropExprJSON)));
  });
});
