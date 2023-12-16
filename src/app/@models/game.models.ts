export class Plate {
  constructor(
    public id: number,
    public winner: WinnerEnum | null
  ) {}
}

export class Score {
  constructor(
    public user: number,
    public computer: number
  ) {}
}

export enum WinnerEnum {
  USER = 'USER',
  COMPUTER = 'COMPUTER',
  PENDING = 'PENDING'
}
