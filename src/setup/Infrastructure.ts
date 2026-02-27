import { IDatabaseConnection } from '@albertoficial/backend-shared';
import { PostgresConnection } from '@infrastructure';

export class Infrastructure {
  private readonly database: IDatabaseConnection;

  constructor() {
    this.database = new PostgresConnection();
  }

  async initialize(): Promise<void> {
    await this.database.initialize();
    console.log('Infrastructure initialized!');
  }

  async shutdown(): Promise<void> {
    await this.database.shutdown();
  }

  getRepositories(): ReturnType<PostgresConnection['getRepositories']> {
    return (this.database as PostgresConnection).getRepositories();
  }
}
