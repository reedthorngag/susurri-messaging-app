import { Request, Response } from 'express';
import Route from '../types/route';
import logger from '../util/logger.js';


const exampleRoute:Route = ['/create/message', 'POST', async (req:Request,res:Response) => {

    await prismaClient.newMessage.create({
        data: {
            ChatID: req.body.ChatID,
            UserID: req.body.UserID,
            Message: req.body.message,
            MessageID: req.body.messageID
        }
    });

    res.status(201).send();
}];

//put all the routes in an array, and export that array.
const exampleRoutes:Array<Route> = [
    exampleRoute
]

export default exampleRoutes;
