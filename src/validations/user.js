import Joi from '@hapi/joi'

const email = Joi.string().email().required().label("Email")
const name = Joi.string().label("Name")
const username = Joi.string().required().token().label("Username")
const password = Joi.string().min(6).max(30).regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d).*$/).required().label('Password').options({
	language: {
		string: {
			regex: {
				base: 'must have at least one lowercase letter, one uppercase letter, and one digit.'
			}
		}
	}
})

export const signUp = Joi.object().keys({
	email, password, name, username
})

export const signIn = Joi.object().keys({
	email, password
})
