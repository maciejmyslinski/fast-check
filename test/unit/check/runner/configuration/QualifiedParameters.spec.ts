import * as assert from 'assert';
import * as fc from '../../../../../lib/fast-check';

import { QualifiedParameters } from '../../../../../src/check/runner/configuration/QualifiedParameters';

const extract = <T>(conf: QualifiedParameters<T>) => {
  const { logger, ...others } = conf;
  return others;
};
const extractExceptSeed = <T>(conf: QualifiedParameters<T>) => {
  const { seed, ...others } = extract(conf);
  return others;
};

const parametersArbitrary = fc.record(
  {
    seed: fc.integer(),
    numRuns: fc.nat(),
    timeout: fc.nat(),
    path: fc.array(fc.nat()).map(arr => arr.join(':')),
    unbiased: fc.boolean(),
    verbose: fc.boolean(),
    examples: fc.array(fc.nat())
  },
  { withDeletedKeys: true }
);

describe('QualifiedParameters', () => {
  describe('read', () => {
    it('Should forward as-is values already set in Parameters', () =>
      fc.assert(
        fc.property(parametersArbitrary, params => {
          const qualifiedParams = QualifiedParameters.read(params);
          for (const key of Object.keys(params)) {
            assert.strictEqual(
              (qualifiedParams as any)[key],
              (params as any)[key],
              `Unexpected value encountered in qualified - ${
                (qualifiedParams as any)[key]
              } - for key ${key}, expected: ${(params as any)[key]}`
            );
          }
        })
      ));
  });
  describe('readOrNumRuns', () => {
    it('Should be equivalent to read with only numRuns when specifying a number', () =>
      fc.assert(
        fc.property(fc.nat(), numRuns =>
          assert.deepStrictEqual(
            extractExceptSeed(QualifiedParameters.readOrNumRuns(numRuns)),
            extractExceptSeed(QualifiedParameters.read({ numRuns }))
          )
        )
      ));
    it('Should be equivalent to read for Parameters', () =>
      fc.assert(
        fc.property(parametersArbitrary, params => {
          const extractor = params.seed != null ? extract : extractExceptSeed;
          assert.deepStrictEqual(
            extractor(QualifiedParameters.readOrNumRuns(params)),
            extractor(QualifiedParameters.read(params))
          );
        })
      ));
  });
});
