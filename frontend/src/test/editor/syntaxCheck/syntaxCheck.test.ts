import { ASTNodeType } from '../../../side_panel/models/AST/AST';
import checkSyntax from '../../../side_panel/task_workflows/syntax_checker/checkSyntax';
import { allCSTPrograms, mediumProgram } from '../../models/consts/CSTprograms';

describe('Syntax Check (In Order) for', () => {
  it.each(allCSTPrograms)(
    '$name should have success: $expectedSuccess',
    ({ program, expectedSuccess }) => {
      const syntaxCheckResult = checkSyntax(program);
      expect(syntaxCheckResult.success).toBe(expectedSuccess);
    },
  );

  it('Correctly orders inner steps', () => {
    const syntaxCheckResult = checkSyntax(mediumProgram);
    if (syntaxCheckResult.success) {
      const fisrtInnerStepType = syntaxCheckResult.program.start.start.type;
      expect(fisrtInnerStepType).toBe(ASTNodeType.ScrollTo);
    } else {
      expect(syntaxCheckResult.success).toBe(true);
    }
  });
});
