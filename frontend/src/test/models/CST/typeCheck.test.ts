import typeCheck from '../../../panel/models/CST/typeCheck';
import { allCSTPrograms } from '../consts/CSTprograms';

describe('Type Check for', () => {
  it.each(allCSTPrograms)(
    '$name should have success: $expectedSuccess',
    ({ program, expectedSuccess }) => {
      const typeCheckResult = typeCheck(program);
      expect(typeCheckResult.success).toBe(expectedSuccess);
    },
  );
});
