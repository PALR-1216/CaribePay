import { supabase } from "../config/supabaseConfig";
import authService from "./AuthService";
import Swal from 'sweetalert2';
import emailService from "./EmailService";

class WalletService {
    DEV_ENCRYPTION_PASSWORD='Z9g!N3t^bQ%XrFs2';
    SERVER_URL = 'https://caribepayserver.onrender.com';

    async getUserWallet(userID) {
        try {
            const { data, error } = await supabase
                .from('Wallets')
                .select('userWallet')
                .eq('user_id', userID)
                .single();

            if (error) {
                console.error('Error fetching wallet:', error.message);
                return {
                    success: false,
                    error: error.message
                };
            }

            if (!data) {
                console.log('No wallet found for user:', userID);
                return {
                    success: false,
                    error: 'Wallet not found'
                };
            }

            return {
                success: true,
                wallet: data.userWallet
            };
            
        } catch (error) {
            console.error('Unexpected error fetching wallet:', error);
            return {
                success: false,
                error: 'Unexpected error occurred'
            };
        }
    }

    async getTransactions() {}

    async getBalance() {
        try {
            //get user id from supabase
            let userID = (await supabase.auth.getUser()).data.user.id;
            if (!userID) {
                console.log('User not logged in');
                return '0.00';
            }

            //get user wallet from database
            let { data, error } = await supabase.from('Public_keys').select('*').eq('user_id', userID);
            if (error) {
                console.error('Error getting wallet:', error);
                return '0.00';
            }
        
            const userWallet = data[0].public_key
            const balanceResponse = await fetch(`${this.SERVER_URL}/api/balance/${userWallet}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });

            if (!balanceResponse.ok) {
                throw new Error(`HTTP error! status: ${balanceResponse.status}`);
            }

            const walltBalance = await balanceResponse.json();
            // return data.balance;
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(walltBalance.balance);

        } catch (error) {
            console.error('Error getting balance:', error);
            return '0.00';
        }
    }

    async createWallet() {
        try {
            const walletResponse = await fetch(`${this.SERVER_URL}/api/createWallet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });

            if (!walletResponse.ok) {
                throw new Error(`HTTP error! status: ${walletResponse.status}`);
            }

            const walletData = await walletResponse.json();
            //i need to encry and decepry the private key 
            return walletData;


            
        } catch (error) {
            console.error('Error creating wallet:', error);
            
        }
    }

    async transferFunds(senderID, receiverID, receiverWallet, amount) {
        try {
            console.log("senderID", senderID, "receiverWallet", receiverWallet, "amount", amount);
            const transferResponse = await fetch(`${this.SERVER_URL}/api/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    senderID,
                    receiverWallet,
                    amount
                }),
            }).catch((error) => {
                console.error('Error transferring funds:', error);
                throw new Error('Failed to process the transaction');
            });
            const transferData = await transferResponse.json();
            if(transferData.success){
                console.log(transferData);
                const { signature, confirmation } = transferData;
                const senderData = await authService.getSelectedUser(senderID);
                const receiverData = await authService.getSelectedUser(receiverID);
                await emailService.receiverTransactionReceipt(receiverData.user.email, senderData.user.name, receiverData.user.name, amount)
                await emailService.senderTransactionReceipt(senderData.user.email, senderData.user.name, receiverData.user.name, amount)
                await Swal.fire({
                    title: 'Transaction Successful!',
                    html: `
                        <div class="transaction-receipt">
                            <p><strong>Amount:</strong> ${amount} USDC</p>
                            <p><strong>Transaction Signature:</strong> ${transferData.result.signature.slice(-6)}</p>
                            <p><strong>Status:</strong> Confirmed</p>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                
                return { signature, confirmation };
            } else {
                console.log(transferData);
                await Swal.fire({
                    title: 'Transaction Failed',
                    text: transferData.error || 'An error occurred during the transaction',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error transferring funds:', error);
            await Swal.fire({
                title: 'Error',
                text: 'Failed to process the transaction',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }
}


const walletService = new WalletService();
export default walletService;