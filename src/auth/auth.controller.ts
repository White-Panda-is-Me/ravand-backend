import { Body, Controller, Header, HttpCode, Post } from "@nestjs/common";
import { Authdto , Authindto, FSDto} from "./dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post ('signup')
    @HttpCode(200)
    signup (@Body() dto: Authdto) {
        return this.authService.signup(dto);
    }
    
    @HttpCode(200)
    @Post ('signup/f')
    Fsignup (@Body() dto: FSDto) {
        return this.authService.FinishSignup(dto);
    }
    
    @HttpCode(200)
    @Post ('signin')
    signin (@Body() dto: Authindto) {
        return this.authService.signin(dto);
    }
}