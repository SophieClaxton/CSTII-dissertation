import { getMissingProperties } from '../../panel/models/Schema';
import { objectsAndSchemas } from './consts/objectsAndSchemas';

describe('getMissingProperties for', () => {
  it.each(objectsAndSchemas)(
    '$name has correct outcome',
    ({ object, schema, expectedOutcome }) => {
      const missingProperties = getMissingProperties(object, schema);
      expect(missingProperties).toStrictEqual(expectedOutcome);
    },
  );
});
