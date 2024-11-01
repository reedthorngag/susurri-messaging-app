import express, { Router } from 'express';
import {glob} from 'glob';
import path from 'path';
import Logger from './util/logger.js';
import Route from './types/route.js';
import fs from 'fs'

//key index issue with types:so any
const router:Router = express.Router(); 
const routesList: Route[] = [];

Logger.info('Importing routes...');

for (const file of (await glob.glob( './**/*.js',{cwd:"./build/routes"})))
    routesList.push(...(await import('./routes/'+file)).default);

routesList.sort((a:Route,b:Route) => a[0].localeCompare(b[0]));

for (const [path,method,handler] of routesList) {
    Logger.info(`Adding route: ${method.toUpperCase().padEnd(4)} /api${path}`);
    try{
        //@ts-ignore
        router[(method).toLowerCase()](path, async (req:any,res:any) => {
            try {
                res.setHeader('Cache-Control','no-store, no-cache');
                res.setHeader('Pragma','no-cache');
                await handler(req,res);
            } catch (e) {
                try {
                    res.status(500).send('Internal server error.');
                } catch (err) {}
                Logger.error(`Route: ${method.toUpperCase().padEnd(4)} ${path}  Error:`);
                Logger.error(e);
            }
        });
    }catch(e){
        Logger.error(`Error adding route ${path}, error:\n${e}`);
    }
}

Logger.info("exporting router");

export default router
