import typeCheck from '../../panel/models/CST/typeCheck';
import { allCSTPrograms } from './consts/CSTprograms';

describe('Type Check should pass for', () => {
  it.each(allCSTPrograms)('test $name', ({ program, expectedSuccess }) => {
    const typeCheckResult = typeCheck(program);
    expect(typeCheckResult.success).toBe(expectedSuccess);
  });
});
