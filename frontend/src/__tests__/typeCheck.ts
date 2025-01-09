import testUnpublishedScript from '../panel/editor/consts/testUnpublishedScript';
import typeCheck from '../panel/models/CST/typeCheck';

describe('Type Check should pass for', () => {
  it('testUnpublishedScript', () => {
    const typeCheckResult = typeCheck(testUnpublishedScript.program);

    expect(typeCheckResult).not.toBe(undefined);
  });
});
