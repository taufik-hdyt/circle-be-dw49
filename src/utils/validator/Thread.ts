import * as Joi from 'joi'

export const createThreadSchema = Joi.object({
  content: Joi.string().required(),
  image: Joi.string()
})

export const updatehreadSchema = Joi.object({
  content: Joi.string(),
  image: Joi.string()
})