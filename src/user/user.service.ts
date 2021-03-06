import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getConnection, Repository } from "typeorm";
import { UpdateNameDto } from "./user.dto";
import { User } from "./user.entity";
import { Profile } from "./profile.entity";
import { Company } from "./company.entity";
import DatabaseFilesService from "./databaseFilesService";
import DatabaseVideoFilesService from "./databaseVideoFilesService";



@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  @InjectRepository(Profile)
  private readonly profileRep: Repository<Profile>;

  @InjectRepository(Company)
  private readonly companyRep: Repository<Company>;

  constructor(private readonly databaseFilesService: DatabaseFilesService,
              private readonly databaseVideoFilesService: DatabaseVideoFilesService) {
  }
  public async updateName(body: UpdateNameDto, req: any): Promise<User> {
    const user: User = <User>req.user;
    // user.name = body.name;

    return this.repository.save(user);
  }

  async addVideo(userId: number, imageBuffer: Buffer, filename: string) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOne(User, { where: {id: userId} });
      const currentAvatarId = user.videoId;
      const video = await this.databaseVideoFilesService.uploadDatabaseFileWithQueryRunner(imageBuffer, filename, queryRunner);

      await queryRunner.manager.update(User, userId, {
        videoId: video.id
      });

      if (currentAvatarId) {
        await this.databaseVideoFilesService.deleteFileWithQueryRunner(currentAvatarId, queryRunner);
      }

      await queryRunner.commitTransaction();

      return video;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOne(User, { where: {id: userId} });
      const currentAvatarId = user.avatarId;
      const avatar = await this.databaseFilesService.uploadDatabaseFileWithQueryRunner(imageBuffer, filename, queryRunner);

      await queryRunner.manager.update(User, userId, {
        avatarId: avatar.id
      });

      if (currentAvatarId) {
        await this.databaseFilesService.deleteFileWithQueryRunner(currentAvatarId, queryRunner);
      }

      await queryRunner.commitTransaction();

      return avatar;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  public async getUserByIds(userId: any) {
    return await this.repository.findOneBy({id: userId});
  }

  public async storeProfile(body: any, req: any) {
    const user: User = await this.repository.findOneBy({id: body.id});
    const profile = await this.profileRep.createQueryBuilder("profile")
      .innerJoinAndSelect("profile.user", "user")
      .where("user.id = :id", { id: body.id })
      .getOne();
    if (!profile) {
      const profile: Profile = new Profile();
    }

    profile.linkedin_link = body.linkedin_link;
    profile.description = body.description;
    profile.start_date = body.start_date;
    profile.employment_type = body.employment_type;
    profile.education_level = body.education_level;
    profile.work_location = body.work_location;
    profile.specializations = body.specializations;
    profile.expected_salary = body.expected_salary;
    profile.user = user;
    return this.profileRep.save(profile);
  }

  public async storeCompany(body: any, req: any) {
    const user: User = await this.repository.findOneBy({id: body.id});
    const company = await this.companyRep.createQueryBuilder("company")
      .innerJoinAndSelect("company.user", "user")
      .where("user.id = :id", { id: body.id })
      .getOne();
    console.log('comp', company);
    if (!company) {
      const company: Company = new Company();
    }
    company.description = body.description;
    company.education_level = body.education_level;
    company.work_location = body.work_location;
    company.specializations = body.specializations;
    company.expected_salary = body.expected_salary;
    company.user = user;
    return this.companyRep.save(company);
  }

  public async getProfiles(): Promise<Profile[]> {
    return await this.profileRep.find({ relations: ['user'] });
  }

  public async getProfile(args): Promise<Profile[]> {
    const { employment_type, specializations, expected_salary, work_location } = args;
    return await this.profileRep.createQueryBuilder().select()
      .where('employment_type ILIKE :searchQuery', {searchQuery: `%${employment_type}%`})
      .orWhere('specializations ILIKE :searchQuery', {searchQuery: `%${specializations}%`})
      .orWhere('expected_salary ILIKE :searchQuery', {searchQuery: `%${expected_salary}%`})
      .orWhere('work_location ILIKE :searchQuery', {searchQuery: `%${work_location}%`})
      .getMany();
  }

  public async getCompanies() {
    console.log('123123');
    return await this.companyRep.find({ relations: ['user'] });
  }

  public async getCompany(args): Promise<Company[]> {
    const { employment_type, specializations, expected_salary, work_location } = args;
    return await this.companyRep.createQueryBuilder().select()
      .where('employment_type ILIKE :searchQuery', {searchQuery: `%${employment_type}%`})
      .orWhere('specializations ILIKE :searchQuery', {searchQuery: `%${specializations}%`})
      .orWhere('expected_salary ILIKE :searchQuery', {searchQuery: `%${expected_salary}%`})
      .orWhere('work_location ILIKE :searchQuery', {searchQuery: `%${work_location}%`})
      .getMany();
  }

  public async getProfileById(id) {
    console.log('id', id);
    return await this.profileRep.createQueryBuilder("profile")
      .innerJoinAndSelect("profile.user", "user")
      .where("user.id = :id", { id })
      .getOne()
    // return await this.profileRep.findOneBy({loadRelationIds: true, where: {user: {id} }, relations: ['user']});
  }

  public async getCompanyById(id) {
    return await this.companyRep.findOneBy({user: {id}});
  }

  public async getUserById(id) {
    return await this.profileRep.findOneBy({id});
  }
}
