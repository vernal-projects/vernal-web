import {AppContext, ClassType, COMPONENT_REGISTRY, StereotypeComponent} from "@vernal-projects/framework-core";
import express, {Application, Express, NextFunction, Request, Response} from 'express';
import {MAPPING_REGISTRY} from "./decorator/request-mapping.decorator.js";
import {HttpMethod} from "./type/http-method.type.js";

export class WebAppContext extends AppContext {

    constructor(private webApp: Express, configClass: ClassType) {
        super(configClass);
        Array.from(MAPPING_REGISTRY.keys()).forEach(controller => {
            if (COMPONENT_REGISTRY.get(controller)!.type !== StereotypeComponent.CONTROLLER)
                throw new Error(`@RequestMapping decorator is not allowed with ${controller.name} class`);
            if (!MAPPING_REGISTRY.get(controller)!.filter(h => h.handler).length) {
                throw new Error(`No handler methods are found in ${controller.name}`);
            }
        });
        this.configRoutes();
    }

    public getWebApp(): Application {
        return this.webApp;
    }

    private configRoutes() {
        MAPPING_REGISTRY.forEach((handlers, controller) => {
            /* Check whether controller is associated with this context */
            if (!this.containsComponentDefinition(controller)) return;
            const controllerInstance = this.getComponent<any>(controller);

            /* Check whether routes needs a separate router */
            const rootHandler = handlers.find(h => !h.handler && !h.method);
            const app = !rootHandler || rootHandler.path == "/" ? this.webApp : express.Router();

            if (rootHandler) {
                if (rootHandler.middlewares?.length) app.use([...rootHandler.middlewares]);
                if (app !== this.webApp) this.webApp.use(rootHandler.path, app);
            }

            for (const handler of handlers) {
                if (handler === rootHandler) continue;
                const proxyHandler = async function (this: any, req: Request, res: Response, next: NextFunction) {
                    try {
                        await (handler.handler as Function)!.call(this, ...arguments);
                    } catch (e) {
                        next(e);
                    }
                }.bind(controllerInstance);
                switch (handler.method) {
                    case HttpMethod.GET:
                        app.get(handler.path, [...handler.middlewares!, proxyHandler]);
                        break;
                    case HttpMethod.POST:
                        app.post(handler.path, [...handler.middlewares!, proxyHandler]);
                        break;
                    case HttpMethod.DELETE:
                        app.delete(handler.path, [...handler.middlewares!, proxyHandler]);
                        break;
                    case HttpMethod.PUT:
                        app.put(handler.path, [...handler.middlewares!, proxyHandler]);
                        break;
                    case HttpMethod.PATCH:
                        app.patch(handler.path, [...handler.middlewares!, proxyHandler]);
                        break;
                    case HttpMethod.HEAD:
                        app.head(handler.path, [...handler.middlewares!, proxyHandler]);
                        break;
                    case HttpMethod.OPTIONS:
                        app.options(handler.path, [...handler.middlewares!, proxyHandler]);
                        break;
                }
            }
        });
    }

}