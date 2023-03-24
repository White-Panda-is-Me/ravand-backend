import { Controller, Get } from "@nestjs/common";

@Controller('')
export class AppController{
    @Get('')
    print() {
        return '<div>Hola Man</div>';
    }
}