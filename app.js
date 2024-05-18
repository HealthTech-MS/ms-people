import morgan from "morgan"
import dontenv from 'dotenv'
import express from "express"
import createError from "http-errors"
import db from "./src/lib/sequelize.js";
import UserRoute from "./src/routes/users.route.js"
import MealsRoute from "./src/routes/meals.rotue.js"
import UIRoute from "./src/routes/ui.route.js"
import cors from "cors"

dontenv.config()

const app = express();

app.use(cors({
  origin: "http://localhost:3000"
}))

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ;(async()=>{
//   await db.sync({force: true, logging: console.log});
// })();

app.use('/api/v1/people/', UserRoute)
app.use('/api/v1/people/', MealsRoute)
app.use('/api/v1/people/ui/', UIRoute)

app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port: ${process.env.PORT || 3000}`)
})
