export interface IEmitTokenApplication {
  execute(id: string, amount: number): Promise<void>;
}