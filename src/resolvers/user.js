import { User } from '../models'
import Joi from "@hapi/joi"
import { signIn, signUp } from '../validations'
import { signInHandler } from '../controllers/auth'

export default {
  Query: {
    me: (root, args, {req}, info)=>{
      console.log(req.auth)
      return User.findById(req.auth.id)
    },
    users: (root, args, {req}, info)=>{
      return User.find()
    }
  },
  Mutation: {
    signIn: async (root, args, context, info)=> {
      await Joi.validate(args, signIn, { abortEarly: false })
      return signInHandler(args)
    },

    signUp: async (root, args, context, info)=>{
      console.log(args);
      await Joi.validate(args, signUp, { abortEarly: false })
      return User.create(args);
    }
  },
  User: {

  }

}
