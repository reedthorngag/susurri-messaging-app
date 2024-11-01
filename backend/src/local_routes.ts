import express, { Request, Response, Router } from 'express';
import fs from 'fs';

const router:Router = express.Router(); 

router.get('/ping',(req:Request,res:Response) => res.contentType('text').send('Pong!'));


export default router;
