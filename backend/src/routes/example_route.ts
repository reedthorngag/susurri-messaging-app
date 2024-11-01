import Route from '../types/route';
import logger from '../util/logger.js';


const exampleRoute:Route = ['/admin', 'GET', async (req:any,res:any)=>{
    res.status(200).send('Hello admin user!');
}];

//put all the routes in an array, and export that array.
const exampleRoutes:Array<Route> = [
    exampleRoute
]

export default exampleRoutes;
