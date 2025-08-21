import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsResolver } from './polls.resolver';
import { Poll } from './entities/poll.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from '../options/entities/option.entity';
import { pubSub } from '../pubSub.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, Option])],
  providers: [
    PollsResolver, 
    PollsService,
    {
      provide: 'PUB_SUB',
      useValue: pubSub,
    },
  ],
})
export class PollsModule {}
