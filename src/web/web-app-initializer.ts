import {ClassType} from "@vernal-projects/framework-core";
import {WebAppContext} from "./web-app-context.js";
import express, {Express} from "express";

export class WebAppInitializer {

    private readonly webApp: Express;
    private readonly webAppContext: WebAppContext;

    constructor(configClass: ClassType, port: number = 5050, listeningFn?: () => void) {
        this.webApp = express();
        this.webAppContext = new WebAppContext(this.webApp, configClass);
        this.webApp.listen(port, listeningFn);
    }

    public getWebApp(): Express {
        return this.webApp;
    }

    public getWebAppContext(): WebAppContext {
        return this.webAppContext;
    }
}