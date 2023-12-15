export class Plate {
  constructor(
    public id: number,
    public winner: WinnerEnum | null
  ) {}
}

export enum WinnerEnum {
  USER = 'USER',
  COMPUTER = 'COMPUTER',
  PENDING = 'PENDING'
}
