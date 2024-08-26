import {RequestHandler} from "express";
import {HttpMethod} from "./http-method.type.js";

export interface Handler {
    handler?: RequestHandler,
    path: string,
    method?: HttpMethod,
    middlewares?: Array<RequestHandler>
}