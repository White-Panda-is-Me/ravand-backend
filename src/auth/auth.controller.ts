import { Body, Controller, Header, Post } from "@nestjs/common";
import { Authdto , Authindto, FSDto} from "./dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post ('signup')
    signup (@Body() dto: Authdto) {
        return this.authService.signup(dto);
    }

    @Post ('signup/f')
    Fsignup (@Body() dto: FSDto) {
        return this.authService.FinishSignup(dto);
    }

    @Post ('signin')
    signin (@Body() dto: Authindto) {
        return this.authService.signin(dto);
    }
}