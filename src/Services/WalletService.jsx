import { supabase } from "../config/supabaseConfig";
import authService from "./AuthService";

class WalletService {
    DEV_ENCRYPTION_PASSWORD='Z9g!N3t^bQ%XrFs2';

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
            let { data, error } = await supabase.from('Wallets').select('*').eq('user_id', userID);
            if (error) {
                console.error('Error getting wallet:', error);
                return '0.00';
            }
        
            const userWallet = data[0].userWallet;
            const balanceResponse = await fetch(`http://localhost:8000/get-wallet-balance/${userWallet}`, {
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

    async createWallet(userID) {
        try {
            const walletResponse = await fetch('http://localhost:8000/create-costumer-wallet', {
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


            //save wallet to database
            const { data, error } = await supabase.from('Wallets').insert([
                {
                    user_id: userID,
                    publicKey: walletData.publicKey,
                    privateKey: walletData.privateKey,
                }
            ]);

            
        } catch (error) {
            console.error('Error creating wallet:', error);
            
        }
    }

    async transferFunds(senderWallet, receiverWallet, amount) {
        try {
            const response = await fetch('http://localhost:8000/transfer-funds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    userID: (await supabase.auth.getUser()).data.user.id,
                    fromPublicKey: senderWallet,
                    toPublicKey: receiverWallet,
                    amount: amount,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;

        } catch (error) {
            console.error('Error transferring funds:', error);
            
        }
    }

    async encryptPrivateKey(privateKey) {
        //encrypt private key
        const password = DEV_ENCRYPTION_PASSWORD;
        
    }



    async decryptPrivateKey(encryptedPrivateKey) {

    }

}

const walletService = new WalletService();
export default walletService;