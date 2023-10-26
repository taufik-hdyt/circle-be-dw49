import { AppDataSource } from "./data-source"
import *  as express from  'express'
import ThreadRoutes from "./route/ThreadRoutes"
import UserRoutes from "./route/UserRoutes"
import * as  cors from 'cors'
import FollowRoutes from "./route/FollowRoutes"

AppDataSource.initialize()
.then(async () => {
    const app = express()
    const port  = 5000
    app.use(cors())
    // kominukasi type data json
    app.use(express.json())
    //router
    app.use('/api/v1', ThreadRoutes)
    app.use('/api/v1', UserRoutes)
    app.use('/api/v1', FollowRoutes)


    // menjalankan di port 5000
    app.listen(port, ()=> {
        console.log(`Server running on Port ${port}`);
    })

})
.catch(error => console.log(error))
