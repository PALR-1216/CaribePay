import { supabase } from "../config/supabaseConfig";
import authService from "./AuthService";

class WalletService {

    async getUserWallet() {
        try {
            await authService.getUserWallet().then((response) => {
                if (response.success) {
                    console.log(response)
                    return response.wallet;
                } else {
                    console.error(response.message);
                }
            });
            
        } catch (e) {
            console.error(e);
            
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
            
        } catch (error) {
            console.error('Error creating wallet:', error);
            
        }
    }



}

const walletService = new WalletService();
export default walletService;