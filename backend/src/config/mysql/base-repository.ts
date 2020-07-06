import { getEntityManagerOrTransactionManager } from 'typeorm-transactional-cls-hooked';
import { EntityManager, ObjectLiteral, Repository } from 'typeorm';

export class BaseRepository<Entity extends ObjectLiteral> extends Repository<
  Entity
> {
  protected connectionName: string = 'default';
  protected _manager: EntityManager | undefined;

  set manager(manager: EntityManager) {
    this._manager = manager;
    this.connectionName = manager.connection.name;
  }

  // Always get the entityManager from the cls namespace if active, otherwise, use the original or getManager(connectionName)
  get manager(): EntityManager {
    return getEntityManagerOrTransactionManager(
      this.connectionName,
      this._manager
    );
  }
}
