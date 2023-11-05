import * as amqp from 'amqplib'
import "dotenv/config"
import { AppDataSource } from '../data-source'
import cloudinary from '../libs/cloudinary'
import ThreadWorker from './ThreadWorker'
import { redisConnect } from '../cache/redis'

export default new class WorkerHub{
  constructor(){
    AppDataSource.initialize()
    .then(async()=> {
      cloudinary.upload()
      redisConnect()
      const connection = await amqp.connect("amqps://rsvliwsi:HMu8AWB3r97ziFK5-JVXKhbnJ7Fcp6oK@octopus.rmq3.cloudamqp.com/rsvliwsi")

      // create worker anymore
      const resp = await ThreadWorker.create("threads-queue", connection)
      console.log(resp);
    })
    .catch((err)=>  console.log(err)
    )
  }
}