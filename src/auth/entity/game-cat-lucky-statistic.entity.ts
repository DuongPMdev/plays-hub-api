import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('game_cat_lucky_statistic')
export class GameCatLuckyStatistic {

  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ unique: true })
  account_id: string;

  @Column()
  played_point: number;

  @Column()
  max_ticket: number;

  @Column()
  ticket: number;

  @Column()
  game_over: number;

  @Column()
  play_on_ticket: number;

  @Column()
  playing_on: number;

  @Column()
  stage: number;

  @Column()
  current_stage_result: string;

  @Column()
  collected_gem: number;

  @Column()
  collected_shard: number;

  @Column('float')
  collected_ton: number;

  @Column('float')
  collected_bnb: number;

  @Column('float')
  collected_plays: number;

  @Column()
  collected_ticket: number;

  @Column()
  last_play_datetime: Date;
  
  constructor(account_id: string) {
    this.id = 0;
    this.account_id = account_id;
    this.played_point = 0;
    this.max_ticket = 30;
    this.ticket = 30;
    this.game_over = 0;
    this.play_on_ticket = 10;
    this.playing_on = 0;
    this.stage = 0;
    this.current_stage_result = "";
    this.collected_gem = 0;
    this.collected_shard = 0;
    this.collected_ton = 0;
    this.collected_bnb = 0;
    this.collected_plays = 0;
    this.collected_ticket = 0;
    this.last_play_datetime = null;
  }

}
