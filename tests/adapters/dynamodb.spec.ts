import { DynamoDbAdapter } from '../../src/adapters/dynamodb';

describe('DynamoDbAdapter tests', () => {
  it('Can create', () => {
    const dynamo = new DynamoDbAdapter();
    expect(dynamo).toBeInstanceOf(DynamoDbAdapter);
  });
});
