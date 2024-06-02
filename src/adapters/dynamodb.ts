import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
} from '@aws-sdk/lib-dynamodb';

export class DynamoDbAdapter {
  private client: DynamoDBDocumentClient;

  constructor(params: DynamoDBClientConfig = {}) {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient(params), {
      marshallOptions: { removeUndefinedValues: true },
    });
  }

  public async get(params: GetCommandInput): Promise<GetCommandOutput> {
    return await this.client.send(new GetCommand(params));
  }

  public async put(params: PutCommandInput): Promise<PutCommandOutput> {
    return await this.client.send(new PutCommand(params));
  }
}

export default new DynamoDbAdapter();
