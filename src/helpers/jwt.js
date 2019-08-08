import { JWT_KEY } from '../config';
import jwt from "jsonwebtoken";

export default (user,time)=>{
    return(
      jwt.sign(
        { id: user._id },
        JWT_KEY,
        { expiresIn: time?`${time} days`:"365 days" }
      )
    )
};
