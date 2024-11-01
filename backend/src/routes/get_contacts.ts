import { Request, Response } from 'express';
import Route from '../types/route';
import logger from '../util/logger.js';


const exampleRoute:Route = ['/get/contacts', 'GET', async (req:Request,res:Response) => {

    const contacts = await prismaClient.contactRequest.findMany({
        where: {
            UserID: req.body.UserID,
        }
    });

    for (const c of contacts) {
        await prismaClient.contactRequest.delete({where: {ChatID: c.ChatID}});
    }

    res.status(200).contentType('json').send(contacts);
}];

//put all the routes in an array, and export that array.
const exampleRoutes:Array<Route> = [
    exampleRoute
]

export default exampleRoutes;
