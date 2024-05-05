import { Module } from "@nestjs/common";
import { CatalogController } from "./catalog.controller";
import { ComputerController } from "./computer.controller";
import { LaptopController } from "./laptop.controller";
import { GPUController } from "./gpu.controller";
import { CPUController } from "./cpu.controller";
import { RAMController } from "./ram.controller";
import { StorageDeviceController } from "./storageDevice.controller";
import { TokenModule } from "src/authorization/token/token.module";

@Module({
    imports: [TokenModule],
    controllers: [CatalogController, ComputerController, LaptopController, GPUController, CPUController, RAMController, StorageDeviceController],
    providers: []
})

export class CatalogModule{}