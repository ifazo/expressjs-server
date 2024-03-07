import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
    port: process.env.PORT,
    mongodb_uri: process.env.MONGODB_URI,
    salt_rounds: process.env.SALT_ROUNDS,
    jwt_secret_key: process.env.JWT_SECRET_KEY
}
