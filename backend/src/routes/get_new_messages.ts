import { Request, Response } from 'express';
import Route from '../types/route';
import logger from '../util/logger.js';


const exampleRoute:Route = ['/get/new_messages', 'GET', async (req:Request,res:Response) => {

    const messages = await prismaClient.newMessage.findMany({
        where: {
            ChatID: req.body.ChatID,
            UserID: req.body.UserID
        },
        orderBy: {
            MessageID: 'asc'
        }
    });

    for (const m of messages) {
        await prismaClient.message.create({data: m});
        await prismaClient.newMessage.delete({where: {ChatID_MessageID: {ChatID: m.ChatID, MessageID: m.MessageID}}});
    }

    res.status(200).contentType('json').send(messages);
}];

//put all the routes in an array, and export that array.
const exampleRoutes:Array<Route> = [
    exampleRoute
]

export default exampleRoutes;
