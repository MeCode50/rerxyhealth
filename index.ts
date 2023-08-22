import express, { Application, Response, Request, NextFunction } from "express";
import { StatusCode } from "./enums/status";
import { PORT } from "./constant";

const app: Application = express();

app.use(express.json())

app.use((req:Request, res:Response, next:NextFunction)=>{
    console.log(req.path, req.method)
    next()
})

app.get('/', (req: Request, res: Response) => {
    res.status(StatusCode.OK).send(`Welcome to RexHealth. Server is running on port ${PORT}`);
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
