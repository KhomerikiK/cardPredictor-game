import { GameEntity } from './game.entity';
import { BetTypeEntity } from './betType.entity';
import { StatusEntity } from './status.entity';
import { AccessTokenEntity } from './accessToken.entity';
import { CardEntity } from './card.entity';
import { CardTypeEntity } from './cardType.entity';

export * from './cardType.entity';
export * from './accessToken.entity';
export * from './game.entity';
export * from './cardType.entity';
export * from './status.entity';

export default [
    CardTypeEntity,
    CardEntity,
    GameEntity,
    BetTypeEntity,
    StatusEntity,
    AccessTokenEntity
];
  