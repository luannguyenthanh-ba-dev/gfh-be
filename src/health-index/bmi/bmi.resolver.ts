import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BmiService } from './bmi.service';
import { Bmi } from './models/bmi.model';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { USER_ROLES, UserProfile } from 'src/common/utils/constants.util';
import { Users } from 'src/auth/users/models/users.model';
import { CreateBmiArgs } from './dtos';

@Resolver(() => Bmi)
export class BmiResolver {
  constructor(private readonly bmiService: BmiService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Bmi)
  async createBmiRecord(
    @Args() createBmiArgs: CreateBmiArgs,
    @UserProfile() actionUser: Partial<Users>
  ) {
    return this.bmiService.create({
      ...createBmiArgs,
      owner_id: actionUser.id
    });
  }

  @UseGuards(AuthGuard)
  @Query(() => Bmi, { name: 'getBmiById' })
  async getBmiById(
    @Args('id', { type: () => ID }) id: string,
    @UserProfile() actionUser: Partial<Users>
  ) {
    const bmiRecord = await this.bmiService.findOne({ id });
    
    if (!bmiRecord) {
      throw new NotFoundException('BMI record not found');
    }

    // Check if user has permission to view this record
    if (
      bmiRecord.owner_id !== actionUser.id &&
      actionUser.role !== USER_ROLES.ADMIN &&
      actionUser.role !== USER_ROLES.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        "You do not have permission to view this BMI record"
      );
    }

    return bmiRecord;
  }
} 