const nodemailer = require('nodemailer')

const host = process.env.PORT
const user = process.env.EMAIL
const password = process.env.PASSWORD

const transport = nodemailer.createTransport(
	{
		service: 'Gmail',
		auth: {
			user: user,
			pass: password
		}
	}
)

module.exports.sendValidationEmail = (email, activationToken, name) => {
	transport.sendMail({
		to: email,
		from: 'Project Management Tool team',
		subject: 'Please activate ypur account',
        html: `
        <div style='text-align:center; background-color:rgb(232,232,232)'>
            <h1>Project Management Tool Confirmation Email!</h1>
            <h2>Hello ${name}</h2>
            <p> Thanks to join our community! Please confirm your account clicking on the following link:</p>
            <a href=http://localhost:3000/confirm/${token}> Please click the link to confirm your account </a>
            <h3>Enjoy 😎</h3>
		</div>
		`
	})
}
