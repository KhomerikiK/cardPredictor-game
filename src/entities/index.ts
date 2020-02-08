import { GameEntity } from './game.entity';
import { BetCondition } from './betCondition.entity';
import { StatusEntity } from './status.entity';
import { AccessTokenEntity } from './accessToken.entity';

export * from './accessToken.entity';
export * from './game.entity';
export * from './betCondition.entity';
export * from './status.entity';

export default [
    GameEntity,
    BetCondition,
    StatusEntity,
    AccessTokenEntity
];
  