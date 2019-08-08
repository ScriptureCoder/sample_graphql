import { User } from '../models'
import { jwtEncode } from '../helpers'
import { AuthenticationError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import { JWT_KEY } from '../config'

export const signInHandler = async (args)=> {
    const user = await User.findOne({email:args.email})
    if (!user || !await user.matchesPassword(args.password)) {
        throw new Error("Email or password Incorrect")
    }else {
        return jwtEncode(user)
    }

}


const signedIn = req => {
    try {
        if (req.headers.authorization){
            const token = req.headers.authorization.split(" ")[1]||"";
            const decoded = jwt.verify(token, JWT_KEY);
            if (decoded){
                return req.auth = decoded;
            }
        }
        req.next();
    } catch (error) {
        console.error(error)
    }
}

export const ensureSignedIn = req => {
    console.log(req.headers.authorization)
    if (!signedIn(req)) {
        throw new AuthenticationError('You must be signed in.')
    }
}

export const ensureSignedOut = req => {
    console.log(req.headers.authorization)
    if (signedIn(req)) {
        throw new AuthenticationError('You are already signed in.')
    }
}

export const signOut = (req, res) => new Promise(
  (resolve, reject) => {
      req.session.destroy(err => {
          if (err) reject(err)

          res.clearCookie(SESS_NAME)

          resolve(true)
      })
  }
)
