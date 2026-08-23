import express from "express"
import cors from "cors"
import postRouter from "./routers/router.js"

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.static("frontend-northern-war"))


app.use(postRouter)

app.use((err, req, res, next) => {
    const statusCod = err.status || 500
    const message = err.message || "intrneral server error"
    res.status(statusCod).json({success: false, message: message})
})

app.listen(3001, () => console.log("run"))