import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/entities/game.entity';
import { Repository } from 'typeorm';
import { StatusEntity } from 'src/entities/status.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    protected readonly gameRepository: Repository<GameEntity>,

    @InjectRepository(StatusEntity)
    protected readonly statusRepository: Repository<StatusEntity>,
  ) {}

  /*  */
  async getActiveSession(){
    const inprogressType = this.getInprogressType();
    console.log(inprogressType);
    
  }

  /*  */
  async startGame(){

  }
  
  async getInprogressType(){
    return this.statusRepository.findOne({where:{lable:'IN_PROGRESS'}})
  }
}