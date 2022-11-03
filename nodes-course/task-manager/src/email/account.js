const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gianluca.marini95@gmail.com',
        subject: 'Benvenuto!',
        text: `Benvenut ${name}! Altro testo...`
    })
}


const sendGoodByEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gianluca.marini95@gmail.com',
        subject: 'Goodbye!',
        text: `Arrivederci ${name}! è stato bello vederti!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodByEmail
}