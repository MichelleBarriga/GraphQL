import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { PollsService } from './polls.service';
import { Poll } from './entities/poll.entity';
import { CreatePollInput } from './dto/create-poll.input';
import { UpdatePollInput } from './dto/update-poll.input';
import { Option } from 'src/options/entities/option.entity';
import { PubSub } from 'graphql-subscriptions';
import { PollUpdate } from './dto/poll-update.susbcription';
import { Inject } from '@nestjs/common';

@Resolver(() => Poll)
export class PollsResolver {

  constructor(
    private readonly pollsService: PollsService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Mutation(() => Poll)
  createPoll(@Args('createPollInput') createPollInput: CreatePollInput) {
    const poll = this.pollsService.create(createPollInput);
    return poll;
  }

  @Query(() => [Poll], { name: 'polls' })
  async findAll() {
    return await this.pollsService.findAll();
  }

  @Query(() => Poll, { name: 'poll' })
  async findOne(@Args('pollId', { type: () => Int }) pollId: number) {
    return await this.pollsService.findOne(pollId);
  }

  @Mutation(() => Poll)
  updatePoll(@Args('updatePollInput') updatePollInput: UpdatePollInput) {
    return this.pollsService.update(updatePollInput.pollId, updatePollInput);
  }

  @Mutation(() => Poll)
  removePoll(@Args('id', { type: () => Int }) id: number) {
    return this.pollsService.remove(id);
  }

  @Subscription(() => PollUpdate, {
    filter: (payload, variables) => payload.onVote.pollId === variables.pollId,
  })
  onVote(@Args('pollId', { type: () => Int }) pollId: number) {
    return this.pubSub.asyncIterableIterator('voteAdded');
  }
}
