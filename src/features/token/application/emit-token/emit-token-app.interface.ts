import { EmitTokenDTO } from "../../infrastructure/dtos/emit-token.dto";

export interface IEmitTokenApplication {
  execute(id:string, emitToken:EmitTokenDTO): Promise<void>;
}