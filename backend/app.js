import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/userRoute.js"
import statRoute from "./routes/statRoute.js"
import path from "path"

const app = express()

// ✅ CORS must be applied before all routes
app.use(cors({ origin: "http://localhost:5173", credentials: true }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ✅ Now routes will have CORS headers
app.use("/api/v1/stats", statRoute)
app.use("/api/v1/users", userRouter)

export default app
