import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param() params) {
    const idCourse = params?.id || 0;
    return this.coursesService.findOne(idCourse);
  }

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Patch(':id')
  update(
    @Param('id') idCourse: string,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    return this.coursesService.update(idCourse, createCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') idCourse: string) {
    return this.coursesService.remove(idCourse);
  }
}
