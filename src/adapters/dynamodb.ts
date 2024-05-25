import * as DynamoDB from 'aws-sdk/clients/dynamodb';

export class DynamoDbAdapter {
  private client: DynamoDB.DocumentClient;

  constructor(params?: DynamoDB.DocumentClient.DocumentClientOptions) {
    this.client = new DynamoDB.DocumentClient(params);
  }

  public async get(tableName: string, key: DynamoDB.Key):
    Promise<DynamoDB.DocumentClient.GetItemOutput> {
    return await this.client.get({ TableName: tableName, Key: key }).promise();
  }

  public async put(tableName: string, item: Object):
    Promise<DynamoDB.DocumentClient.PutItemOutput> {
    return await this.client.put({ TableName: tableName, Item: item }).promise();
  }

  public async delete(tableName: string, key: DynamoDB.Key):
    Promise<DynamoDB.DocumentClient.DeleteItemOutput> {
    return await this.client.delete({ TableName: tableName, Key: key }).promise();
  }
};

export default new DynamoDbAdapter();
