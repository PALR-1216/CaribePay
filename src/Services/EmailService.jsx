class EmailService {

    async senderTransactionReceipt(to, senderName, recieverName, amount){
        try {
            await fetch('http://localhost:8000/api/sendConfirmationEmailtoSender', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    to,
                    senderName,
                    recieverName,
                    amount
                }),
            });
            
        } catch (error) {
            console.error('Error sending email:', error);
            
        }
    }

    async receiverTransactionReceipt(to, senderName, recieverName, amount){
        try {
            await fetch('http://localhost:8000/api/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    to,
                    senderName,
                    recieverName,
                    amount
                }),
            });
            
        } catch (error) {
            console.error('Error sending email:', error);
            
        }
    }
}

const emailService = new EmailService();
export default emailService;