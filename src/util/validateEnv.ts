import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
    DATABASE_URI: str(),
    PORT: port(),
    ACCESS_TOKEN_SECRET: str(),
    REFRESH_TOKEN_SECRET: str()
});