export interface ConfigDynamoDb {
  tables: ConfigDynamoDbTables;
}

export interface ConfigDynamoDbTables {
  installs: string;
}

export interface ConfigImages {
  success: string[];
  fail: string[];
}

export interface ConfigRedis {
  main: ConfigRedisDetails;
}

export interface ConfigRedisDetails {
  port: number;
  host: string;
}

export interface ConfigServer {
  port: number;
}

export interface ConfigSlackInstall {
  scopes: string[];
}
