import {HttpMethod} from "../type/http-method.type.js";
import {ClassType} from '@vernal-projects/framework-core';
import {Handler} from "../type/handler.type.js";
import {RequestHandler} from "express";

export const MAPPING_REGISTRY: Map<ClassType, Array<Handler>> = new Map();

export function RequestMapping(mappingInfo: {
    path?: string,
    method?: HttpMethod,
    middlewares?: Array<RequestHandler>
} = {
    path: "/",
    middlewares: []
}) {
    return function (target: any, name?: string, descriptor?: PropertyDescriptor) {
        if (!(name && descriptor)) {
            if (mappingInfo.method) throw new Error("Method can't be specified in the class level");
            getHandlers(target as ClassType).push({
                path: mappingInfo.path ?? "/",
                middlewares: mappingInfo.middlewares ?? []
            });
        } else {
            getHandlers(target.constructor as ClassType).push({
                path: mappingInfo.path ?? "/",
                method: mappingInfo.method ?? HttpMethod.GET,
                handler: descriptor.value,
                middlewares: mappingInfo.middlewares ?? []
            });
        }
    }
}

function getHandlers(controller: ClassType) {
    return MAPPING_REGISTRY.get(controller) ?? MAPPING_REGISTRY.set(controller, []).get(controller)!;
}

export function PostMapping(mappingInfo: {
    path?: string,
    middlewares?: Array<RequestHandler>
} = {
    path: "/",
    middlewares: []
}){
    return RequestMapping({...mappingInfo, method: HttpMethod.POST});
}

export function GetMapping(mappingInfo: {
    path?: string,
    middlewares?: Array<RequestHandler>
} = {
    path: "/",
    middlewares: []
}){
    return RequestMapping({...mappingInfo, method: HttpMethod.GET});
}

export function PutMapping(mappingInfo: {
    path?: string,
    middlewares?: Array<RequestHandler>
} = {
    path: "/",
    middlewares: []
}){
    return RequestMapping({...mappingInfo, method: HttpMethod.PUT});
}

export function PatchMapping(mappingInfo: {
    path?: string,
    middlewares?: Array<RequestHandler>
} = {
    path: "/",
    middlewares: []
}){
    return RequestMapping({...mappingInfo, method: HttpMethod.PATCH});
}

export function DeleteMapping(mappingInfo: {
    path?: string,
    middlewares?: Array<RequestHandler>
} = {
    path: "/",
    middlewares: []
}){
    return RequestMapping({...mappingInfo, method: HttpMethod.DELETE});
}

export function HeadMapping(mappingInfo: {
    path?: string,
    middlewares?: Array<RequestHandler>
} = {
    path: "/",
    middlewares: []
}){
    return RequestMapping({...mappingInfo, method: HttpMethod.HEAD});
}

export function OptionsMapping(mappingInfo: {
    path?: string,
    middlewares?: Array<RequestHandler>
} = {
    path: "/",
    middlewares: []
}){
    return RequestMapping({...mappingInfo, method: HttpMethod.OPTIONS});
}