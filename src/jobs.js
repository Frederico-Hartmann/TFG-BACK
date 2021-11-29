const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = {
    async enviarMsg() {
        twilio.messages.create({
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+555599553539',
            body: 'teste'
        }).then(message => console.log(message));
    }
}

