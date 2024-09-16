import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Account } from './entity/account.entity';
import { Currency } from './entity/currency.entity';
import { GameCatLuckyStatistic } from './entity/game-cat-lucky-statistic.entity';
import { GameCatBattleStatistic } from './entity/game-cat-battle-statistic.entity';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    @InjectRepository(GameCatLuckyStatistic)
    private gameCatLuckyStatisticRepository: Repository<GameCatLuckyStatistic>,
    @InjectRepository(GameCatBattleStatistic)
    private gameCatBattleStatisticRepository: Repository<GameCatBattleStatistic>,
    private jwtService: JwtService,
  ) {}
  
  private readonly characters = 'abcdefghijklmnopqrstuvwxyz0123456789a';

  async validateAccount(loginDTO: LoginDTO): Promise<any> {
    const account = await this.accountRepository.findOne({ where: { telegram_id: loginDTO.telegram_id } });
    if (account) {
      await this.accountRepository.update({ telegram_id: loginDTO.telegram_id }, { display_name: loginDTO.display_name, last_login: new Date() });
    }
    else {
      let account_id = this.generateAccountID(8);
      const newAccount = this.accountRepository.create({
        telegram_id: loginDTO.telegram_id,
        account_id: account_id,
        referral_id: loginDTO.referral_id,
        display_name: loginDTO.display_name,
        language_code: loginDTO.language_code,
        avatar: 0,
        platform: loginDTO.platform
      });
      await this.accountRepository.save(newAccount);
    }
    const finalAccount = await this.accountRepository.findOne({ where: { telegram_id: loginDTO.telegram_id } });
    return finalAccount;
  }

  generateAccountID(length: number): string {
    let result = '';
    const charactersLength = this.characters.length;
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += this.characters.charAt(randomIndex);
    }
    
    return result;
  }

  async login(account: any) {
    const payload = { account_id: account.account_id, telegram_id: account.telegram_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getAccountByTelegramID(telegram_id: string) {
    return await this.accountRepository.findOne({ where: { telegram_id: telegram_id } });
  }

  async getCurrencyByAccountID(account_id: string) {
    let currency = await this.currencyRepository.findOne({ where: { account_id: account_id } });
    if (currency == null) {
      currency = new Currency(account_id);
    }
    return currency;
  }

  async getGameCatLuckyStatisticByAccountID(account_id: string) {
    let gameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    if (gameCatLuckyStatistic == null) {
      gameCatLuckyStatistic = new GameCatLuckyStatistic(account_id);
    }
    return gameCatLuckyStatistic;
  }

  async getGameCatBattleStatisticByAccountID(account_id: string) {
    let gameCatBattleStatistic = await this.gameCatBattleStatisticRepository.findOne({ where: { account_id: account_id } });
    if (gameCatBattleStatistic == null) {
      gameCatBattleStatistic = new GameCatBattleStatistic(account_id);
    }
    return gameCatBattleStatistic;
  }

}