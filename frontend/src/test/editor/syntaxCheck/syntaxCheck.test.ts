import { ASTNodeType } from '../../../side_panel/models/AST/AST';
import checkSyntaxInOrder from '../../../side_panel/scripting_interface/syntax_checker/checkSyntax';
import { allCSTPrograms, mediumProgram } from '../../models/consts/CSTprograms';

describe('Syntax Check (In Order) for', () => {
  it.each(allCSTPrograms)(
    '$name should have success: $expectedSuccess',
    ({ program, expectedSuccess }) => {
      const syntaxCheckResult = checkSyntaxInOrder(program);
      expect(syntaxCheckResult.success).toBe(expectedSuccess);
    },
  );

  it('Correctly orders inner steps', () => {
    const syntaxCheckResult = checkSyntaxInOrder(mediumProgram);
    if (syntaxCheckResult.success) {
      const fisrtInnerStepType = syntaxCheckResult.program.start.start.type;
      expect(fisrtInnerStepType).toBe(ASTNodeType.ScrollTo);
    } else {
      expect(syntaxCheckResult.success).toBe(true);
    }
  });
});
