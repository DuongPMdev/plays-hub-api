import { Controller, Post, Get, Body, Request, UseGuards, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDTO } from './dto/login.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { classToPlain } from 'class-transformer';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';


@Injectable()
@ApiTags('account')
@Controller('account')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
  ) { }

   // Get User Profile Info (assumes referral list of user IDs)
  async getUserProfile(userId: number): Promise<any> {
    const url = "https://api.telegram.org/bot6410342407:AAEgV9Bz57DbEBTXkCLDw635ZNXfwy37QMI/getChat?chat_id=" + userId;
    const response: AxiosResponse<any> = await this.httpService.get(url).toPromise();
    return response.data;
  }

  // Check if user has a premium account based on the profile badge (infer Premium by badge)
  async checkPremiumStatus(userId: number): Promise<boolean> {
    const profile = await this.getUserProfile(userId);
    if (profile.ok && profile.result) {
      // Check if premium badge exists
      return profile.result.photo && profile.result.photo.has_premium_badge;
    }
    return false;
  }


  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Successful login', schema: { example: { access_token: 'your-jwt-token-here' }}})
  async login(@Body() loginDTO: LoginDTO) {
    
    const isPremium = await this.checkPremiumStatus(1894903459);
    console.log("isPremium : " + isPremium);
    const isPremium2 = await this.checkPremiumStatus(1894903459);
    console.log("isPremium2 : " + isPremium2);
    
    const account = await this.authService.validateAccount(loginDTO);
    if (loginDTO.telegram_id == "") {
      throw new BadRequestException('Invalid credentials');
    }
    if (account) {
      return this.authService.login(account);
    }
    return { message: 'Invalid credentials' };
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Profile' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of account profile'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async profile(@Request() req) {
    const telegram_id = req.user.telegram_id;
    const account = await this.authService.getAccountByTelegramID(telegram_id);
    if (account) {
      const currency = await this.authService.getCurrencyByAccountID(account.account_id);
      const gameCatLuckyStatistic = await this.authService.getGameCatLuckyStatisticByAccountID(account.account_id);
      const gameCatBattleStatistic = await this.authService.getGameCatBattleStatisticByAccountID(account.account_id);
      return {
        "account": classToPlain(account),
        "currency": classToPlain(currency),
        "game_cat_lucky_statistic": classToPlain(gameCatLuckyStatistic),
        "game_cat_battle_statistic": classToPlain(gameCatBattleStatistic)
      };
    }
    else {
      throw new NotFoundException('Profile not found');
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('account')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Profile' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of account profile'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async account(@Request() req) {
    const telegram_id = req.user.telegram_id;
    const account = await this.authService.getAccountByTelegramID(telegram_id);
    if (account) {
      return {
        "account": classToPlain(account)
      };
    }
    else {
      throw new NotFoundException('Profile not found');
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('currency')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Profile' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of account profile'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async currency(@Request() req) {
    const telegram_id = req.user.telegram_id;
    const account = await this.authService.getAccountByTelegramID(telegram_id);
    if (account) {
      const currency = await this.authService.getCurrencyByAccountID(account.account_id);
      return {
        "currency": classToPlain(currency)
      };
    }
    else {
      throw new NotFoundException('Profile not found');
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('game_cat_lucky_statistic')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Profile' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of account profile'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async game_cat_lucky_statistic(@Request() req) {
    const telegram_id = req.user.telegram_id;
    const account = await this.authService.getAccountByTelegramID(telegram_id);
    if (account) {
      const gameCatLuckyStatistic = await this.authService.getGameCatLuckyStatisticByAccountID(account.account_id);
      return {
        "game_cat_lucky_statistic": classToPlain(gameCatLuckyStatistic)
      };
    }
    else {
      throw new NotFoundException('Profile not found');
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('game_cat_battle_statistic')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Profile' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of account profile'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async game_cat_battle_statistic(@Request() req) {
    const telegram_id = req.user.telegram_id;
    const account = await this.authService.getAccountByTelegramID(telegram_id);
    if (account) {
      const gameCatBattleStatistic = await this.authService.getGameCatBattleStatisticByAccountID(account.account_id);
      return {
        "game_cat_battle_statistic": classToPlain(gameCatBattleStatistic)
      };
    }
    else {
      throw new NotFoundException('Profile not found');
    }
  }

}