import { Injectable } from '@nestjs/common';
import { Response } from 'express';

export interface HealthCheck {
    data: {
        uptime: number;
        message: string;
        date: Date;
        status:number
    }
}

function format(seconds: number): string {
    function pad(s) {
       return (s < 10 ? '0' : '') + s;
    }
    let hours:number = Math.floor(seconds / (60 * 60));
    let minutes:number = Math.floor(seconds % (60 * 60) / 60);
    let second = Math.floor(seconds % 60);
    
    return pad(hours) + ':' + pad(minutes) + ':' + pad(second);
 }

@Injectable()
export class HealthService {

    async isHealthy(res: Response): Promise<Response<HealthCheck>> {

        const data = {
            uptime: format(process.uptime()),
            message: 'wallet-ms is running',
            date: new Date().toISOString().slice(0, 10),
            status: res.statusCode
        }
        return res.status(200).send(data);

    }
}