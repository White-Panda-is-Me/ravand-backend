import { Controller, Get, Post } from "@nestjs/common";
import { log } from "console";

@Controller('')
export class AppController{
    @Post('eg')
    print() {
        log("yes: here");
    }
}