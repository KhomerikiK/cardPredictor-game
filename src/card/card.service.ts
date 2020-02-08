import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardTypeEntity } from 'src/entities/cardType.entity';
import { Repository } from 'typeorm';
import { CardEntity } from 'src/entities/card.entity';
import { GameEntity } from 'src/entities/game.entity';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(CardEntity)
        protected readonly cardRepository:Repository<CardEntity>,

        @InjectRepository(CardTypeEntity)
        protected readonly cardTypeRepository:Repository<CardTypeEntity>
    ){
    }
    async generate(cardType:string, game:GameEntity){
        console.log('generati');
        
        const randomNumber = Math.floor(Math.random() * 100);
        const type = await this.getCardType(cardType)
        const card =  await this.store(type, randomNumber, game)
        return card;
    }

    async getCardType(label:string){
        return await this.cardTypeRepository.findOne({where:{label:label}})
    }

    async store(type:CardTypeEntity, value: number, game:GameEntity){
        var card = new CardEntity();
        card.type = type;
        card.value = value;
        card.game = game;
        card.save()
        return card; 
    }
}
