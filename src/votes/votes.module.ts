import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesResolver } from './votes.resolver';
import { Vote } from './entities/vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pubSub } from '../pubSub.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Vote])],
  providers: [
    VotesResolver, 
    VotesService,
    {
      provide: 'PUB_SUB',
      useValue: pubSub,
    },
  ],
})
export class VotesModule {}
