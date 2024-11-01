import { Request, Response } from 'express';
import Route from '../types/route';
import logger from '../util/logger.js';


const exampleRoute:Route = ['/get/all_new_messages', 'GET', async (req:Request,res:Response) => {

    const messages = await prismaClient.newMessage.findMany({
        where: {
            UserID: req.body.UserID,
        }
    });

    for (const m of messages) {
        await prismaClient.message.create({data: m});
        await prismaClient.newMessage.delete({where: {ChatID: m.ChatID, MessageID: m.messageID}});
    }

    res.status(200).contentType('json').send(messages);
}];

//put all the routes in an array, and export that array.
const exampleRoutes:Array<Route> = [
    exampleRoute
]

export default exampleRoutes;
