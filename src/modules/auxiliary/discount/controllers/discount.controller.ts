import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  CreateDiscountDto,
  DiscountFilterDto,
  ResponseDiscountDto,
  UpdateDiscountDto,
} from '@qaseh/dtos';
import { DiscountService } from '../providers/services/discount.service';
import { JoiValidatorPipe } from '@qaseh/pipes';
import {
  discountCreateValidation,
  discountFilterValidation,
  discountUpdateValidation,
} from '@qaseh/validations';
import { AdminJwtAccessGuard } from '../../admin/providers/guards/admin-jwt-access-guard.service';
import { DiscountFormatter } from '../providers/formatters/discount.formatter';
import { SuccessResponseFormatter } from '@qaseh/modules/formatter';

@ApiTags('Discount Management')
@Controller('discounts')
export class DiscountController {
  constructor(
    private readonly discountService: DiscountService,
    private readonly discountFormatter: DiscountFormatter,
    private readonly responseFormatter: SuccessResponseFormatter,
  ) {}

  @Get()
  @UseGuards(AdminJwtAccessGuard)
  @ApiBearerAuth('Access')
  @UsePipes(new JoiValidatorPipe(discountFilterValidation))
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseDiscountDto,
    isArray: true,
  })
  async getAll(@Req() req: any, @Query() filterDto: DiscountFilterDto) {
    const { discounts, count } = await this.discountService.getAll(filterDto);

    if (!discounts) {
      throw new BadRequestException('Failed to get all discounts');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.discountFormatter.formatAll(discounts),
      count: count,
      status: HttpStatus.OK,
    });
  }

  @Get(':id')
  @UseGuards(AdminJwtAccessGuard)
  @ApiBearerAuth('Access')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseDiscountDto,
  })
  async get(@Req() req: any, @Param('id') id: number) {
    const discount = await this.discountService.get(id);

    if (!discount) {
      throw new BadRequestException('Failed to get the discount');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.discountFormatter.formatOne(discount),
      status: HttpStatus.OK,
    });
  }

  @Post()
  @UseGuards(AdminJwtAccessGuard)
  @ApiBearerAuth('Access')
  @UsePipes(new JoiValidatorPipe(discountCreateValidation))
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResponseDiscountDto,
  })
  async create(@Req() req: any, @Body() discountDto: CreateDiscountDto) {
    const discount = await this.discountService.create(discountDto);

    if (!discount) {
      throw new BadRequestException('Discount creation failed');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.discountFormatter.formatOne(discount),
      status: HttpStatus.CREATED,
    });
  }

  @Patch(':id')
  @UseGuards(AdminJwtAccessGuard)
  @ApiBearerAuth('Access')
  @UsePipes(new JoiValidatorPipe(discountUpdateValidation))
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseDiscountDto,
  })
  async update(
    @Req() req: any,
    @Param('id') id: number,
    @Body() discountDto: UpdateDiscountDto,
  ) {
    const discount = await this.discountService.update(id, discountDto);

    if (!discount) {
      throw new BadRequestException('Discount Update failed');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.discountFormatter.formatOne(discount),
      status: HttpStatus.OK,
    });
  }

  @Delete(':id')
  @UseGuards(AdminJwtAccessGuard)
  @ApiBearerAuth('Access')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async delete(@Req() req: any, @Param('id') id: number) {
    const result = this.discountService.delete(id);

    if (!result) {
      throw new NotFoundException('Discount not found');
    }

    return this.responseFormatter.format({
      req: req,
      status: HttpStatus.NO_CONTENT,
    });
  }
}
