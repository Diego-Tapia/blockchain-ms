import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ApplicabilityModel, ApplicabilitySchema } from "src/shared/infrastructure/models/applicability.model";


@Module({
    imports: [
      MongooseModule.forFeature([{ name: ApplicabilityModel.name, schema: ApplicabilitySchema }]),
    ],
  })
export class ApplicabilityModule {}
