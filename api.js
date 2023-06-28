const { JwtService } = require("@nestjs/jwt");

const jwt = new JwtService();
jwt.signAsync();