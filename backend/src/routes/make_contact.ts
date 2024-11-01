import { Request, Response } from 'express';
import Route from '../types/route';
import logger from '../util/logger.js';


const exampleRoute:Route = ['/create/contact', 'POST', async (req:Request,res:Response) => {

    await prismaClient.contactRequest.create({
        data: {
            UserID: req.body.UserID,
            ChatID: req.body.ChatID
        }
    });

    res.status(201).send();
}];

//put all the routes in an array, and export that array.
const exampleRoutes:Array<Route> = [
    exampleRoute
]

export default exampleRoutes;
