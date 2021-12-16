import { WalletsByClientsTypes } from "../../walletsByClients.types";
import { WalletsByClientsRepository } from "./walletsByClients-repository";

export const WalletsByClientsRepositoryProvider = {
    provide: WalletsByClientsTypes.INFRASTRUCTURE.REPOSITORY,
    useClass: WalletsByClientsRepository,
  };
  