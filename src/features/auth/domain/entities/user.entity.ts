export class User {
    id: string;
    customId: string;
    username: string;
    status: string;
    clientId: string;
    walletId: string;
    isWalletManager: boolean;
    //TODO: terminar de definir esta clase


    constructor(
        id: string = null,
        customId: string,
        username: string,
        status: string,
        clientId: string,
        walletId: string,
        isWalletManager: boolean
    ) {
        this.id = id;
        this.customId = customId;
        this.username = username;
        this.status = status;
        this.clientId = clientId;
        this.walletId = walletId;
        this.isWalletManager = isWalletManager;
    }

    //TODO: quitar any y mejorar junto con la clase
    public static toEntity(model: any) {
        const { _id, customId, username, status, clientId, walletId, isWalletManager} = model;
        const user = new User(_id.toString(), customId, username, status, clientId, walletId, isWalletManager);
        return user;
    }
}
