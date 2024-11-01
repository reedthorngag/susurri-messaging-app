import { Request, Response } from 'express';
import Route from '../types/route';
import logger from '../util/logger.js';


const exampleRoute:Route = ['/get/messages', 'POST', async (req:Request,res:Response) => {

    const messages = await prismaClient.message.findMany({
        take: req.body.Count,
        skip: req.body.Offset,
        where: {
            UserID: req.body.ChatID,
        }
    });

    res.status(200).contentType('json').send(messages);
}];

//put all the routes in an array, and export that array.
const exampleRoutes:Array<Route> = [
    exampleRoute
]

export default exampleRoutes;
