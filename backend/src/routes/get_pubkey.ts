import { Request, Response } from 'express';
import Route from '../types/route';
import logger from '../util/logger.js';


const exampleRoute:Route = ['/get/new_pubkey', 'GET', async (req:Request,res:Response) => {

    const pubKey = await prismaClient.pubKey.findUnique({
        where: {
            UserID: req.body.UserID,
        }
    });

    res.status(200).contentType('json').send(pubKey);
}];

//put all the routes in an array, and export that array.
const exampleRoutes:Array<Route> = [
    exampleRoute
]

export default exampleRoutes;
