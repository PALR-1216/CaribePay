import authService from "./AuthService";

class WalletService {

    async getUserWallet() {
        try {
            await authService.getUserWallet().then((response) => {
                if (response.success) {
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
            const response = await authService.getUserWallet();
            if (!response.success) {
                throw new Error(response.message);
            }

            const userWallet = response.wallet.userWallet;
            const balanceResponse = await fetch(`http://10.0.0.12:8000/get-wallet-balance/${userWallet}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });

            if (!balanceResponse.ok) {
                throw new Error(`HTTP error! status: ${balanceResponse.status}`);
            }

            const data = await balanceResponse.json();
            // return data.balance;
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(data.balance);

        } catch (error) {
            console.error('Error getting balance:', error);
            return '0.00';
        }
    }



}

const walletService = new WalletService();
export default walletService;