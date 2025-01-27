import { ASTNodeType } from '../../../panel/models/AST/AST';
import typeCheck from '../../../panel/models/CST/typeCheck';
import { allCSTPrograms, mediumProgram } from '../consts/CSTprograms';

describe('Type Check for', () => {
  it.each(allCSTPrograms)(
    '$name should have success: $expectedSuccess',
    ({ program, expectedSuccess }) => {
      const typeCheckResult = typeCheck(program);
      expect(typeCheckResult.success).toBe(expectedSuccess);
    },
  );

  it('Correctly orders inner steps', () => {
    const typeCheckResult = typeCheck(mediumProgram);
    if (typeCheckResult.success) {
      const fisrtInnerStepType = typeCheckResult.program.start.start.type;
      expect(fisrtInnerStepType).toBe(ASTNodeType.ScrollTo);
    } else {
      expect(typeCheckResult.success).toBe(true);
    }
  });
});
