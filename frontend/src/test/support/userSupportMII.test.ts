import { UserStruggleData } from '../../common/message';
import {
  getNextSystemSupportAction,
  softmax,
} from '../../panel/support/script_support/userStruggleSupport/userSupportMII';

describe('softmax', () => {
  it('returns numbers', () => {
    const allResults = [
      21.65198695998898, 5.973904409203186, 7.906842672458263,
    ];
    console.log(
      allResults.map((item) => Math.exp(item)).reduce((a, b) => a + b, 0),
    );
    const prob = softmax(allResults[0], allResults);
    expect(prob).not.toBeNaN();
  });
});

describe('getNextSystemSupportAction', () => {
  it('succeeds', () => {
    const userStruggleData: UserStruggleData = {
      totalDistance: Math.log(1173.732143181506),
      totalScrollDistance: Math.log(280.7),
      numMouseClicks: 1.4,
    };
    const action = getNextSystemSupportAction(
      userStruggleData,
      0,
      () => 'click',
    );

    expect(action).not.toBeUndefined();
  });
});
