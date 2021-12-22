import { IsInt, IsNotEmpty, IsString } from "class-validator"

export class EmitTokenDTO {

    @IsNotEmpty()
    @IsInt()
    amount: number

    @IsNotEmpty()
    @IsString()
    idAdmin: string
}
