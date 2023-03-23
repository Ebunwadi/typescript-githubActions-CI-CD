import 'express-async-errors';
import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from 'cors'
import { errorHandler, notFound } from './middleware/errorHandler';
import env from "./util/validateEnv";
import connectDB from "./config/dbConn";
import userRoutes from "./routes/userRoutes";
import swaggerDocs from './util/swagger';
const port = env.PORT

const app = express()

connectDB()

app.disable('x-powered-by')

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req: Request, res: Response) => {
  res.send('hello world')
})
app.use("/api/users", userRoutes)
swaggerDocs(app, port)

app.use(notFound)
app.use(errorHandler)

export default app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});
