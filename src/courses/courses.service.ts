import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { TagEntity } from './entities/tag.entity';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course) 
        private readonly courseRepository: Repository<Course>,

        @InjectRepository(TagEntity)
        private readonly tagRepository : Repository<TagEntity>,
    ){}

    findAll(){
        return this.courseRepository.find({
            relations: ['tags']
        });
    }

    findOne(idCourse:string){
        const courseFinded = this.courseRepository.findOne(idCourse, {
            relations: ['tags']
        });
        if(!courseFinded)
            throw new NotFoundException
            (
            `Course ID ${idCourse} not found.`
            );

        return courseFinded;
    }
    async create(dataCourse:CreateCourseDto){
        const tags = await Promise.all(
            dataCourse.tags.map((name)=> this.preloadTagByName( name )),
        );
        const createdCourse = this.courseRepository.create({
            ... dataCourse,
            tags
        });
        return this.courseRepository.save(createdCourse);
    }

    async update(idCourse: string, dataCourse: UpdateCourseDto){
        const tags = dataCourse.tags && 
        (
            await Promise.all(
                dataCourse.tags.map(name =>this.preloadTagByName( name )),
            )
        );
        
        const courseUpdated = await this.courseRepository.preload({ 
            id: Number(idCourse),
            ...dataCourse,
            tags
         });

        if (!courseUpdated)
            throw new NotFoundException(`Course ID ${idCourse} not found.`);
        
        return this.courseRepository.save(courseUpdated);
    }

    async remove(idCourse: string){
          const courseToDelete = await this.courseRepository.findOne(idCourse);
          
          if (!courseToDelete)
            throw new NotFoundException(`Course ID ${idCourse} not found.`);
          
         return this.courseRepository.remove(courseToDelete);
    }

    private async preloadTagByName(name : string): Promise<TagEntity>{
        const searchedTag = await this.tagRepository.findOne({ name: name });

        if(searchedTag){
            return searchedTag;
        }else{
            return this.tagRepository.create({ name });
        }
    }
}
