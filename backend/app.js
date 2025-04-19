import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/userRoute.js"
import statRoute from "./routes/statRoute.js"
import path from "path"

const app = express()


app.use(cors({ origin: ["http://localhost:5173","https://lms-main-delta.vercel.app"],credentials: true }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.use("/api/v1/stats", statRoute)
app.use("/api/v1/users", userRouter)

export default app
