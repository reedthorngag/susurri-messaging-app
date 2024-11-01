import { Request, Response } from "express";

export type Method = 'ALL' | 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' ;

export type Handler = (req:Request, res:Response) => (void | Promise<void>);

export type Auth = 'none' | 'optional' | 'required' | 'admin';

type Route = [string, Method, Handler];

export default Route;