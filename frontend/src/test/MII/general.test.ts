import { getNextStruggleSupportAction } from '../../side_panel/mixed_initiative_interaction/metacognitive_support/metacognitiveSupportMII';
import { softmax } from '../../side_panel/mixed_initiative_interaction/modelUtils';
import { InteractionData } from '../../side_panel/models/support_and_MII/UserSupport';

describe('softmax', () => {
  it('returns numbers', () => {
    const allResults = [
      21.65198695998898, 5.973904409203186, 7.906842672458263,
    ];
    const [prob] = softmax(allResults);
    expect(prob).not.toBeNaN();
  });

  it('sums to 1', () => {
    const values = [21, 5, 7];
    const softValues = softmax(values);
    const sum = softValues.reduce((prev, curr) => prev + curr);
    expect(sum).toBeCloseTo(1, 2);
  });
});

describe('getNextSystemSupportAction', () => {
  it('succeeds', () => {
    const interactionData: InteractionData = {
      totalDistance: Math.log(1173.732143181506),
      totalScrollDistance: Math.log(280.7),
      numMouseClicks: 1.4,
    };
    const action = getNextStruggleSupportAction(interactionData, 1, 'auto', 10);
    expect(action).not.toBeUndefined();
  });
});
