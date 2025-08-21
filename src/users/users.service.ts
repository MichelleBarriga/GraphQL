import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Poll } from 'src/polls/entities/poll.entity';
import { Vote } from 'src/votes/entities/vote.entity';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(createUserInput: CreateUserInput) {
    const user = this.usersRepository.create(createUserInput);
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  // This method retrives user info by id with the polls that he created and votes he made.
  async findOne(userId: number): Promise<User> {
  const user = await this.usersRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.polls', 'createdPolls')
    .leftJoinAndSelect('user.votes', 'vote')
    .leftJoinAndSelect('vote.option', 'option')
    .leftJoinAndSelect('option.poll', 'votedPoll')
    .where('user.userId = :userId', { userId })
    .getOne();

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  return user;
}


  async update(userId: number, updateUserInput: UpdateUserInput) {
    await this.usersRepository.update({userId}, updateUserInput);

    const updatedUser = await this.usersRepository.findOne({ where: { userId } });

    if (!updatedUser) {
      throw new Error(`User with id ${userId} not found`);
    }

    return updatedUser;
  }

  remove(userId: number) {
    return this.usersRepository.delete(userId);
  }
}
