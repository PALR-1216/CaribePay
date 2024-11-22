//supa base password: Alejandro1216!2000!

import AuthService from "./AuthService";

interface StripeCustomer {
    id: string;
    email: string;
    name: string;
}

class AddCostumerToStripe {
    private readonly API_URL = 'http://localhost:3000';

    private async createStripeCustomer(email: string, name: string): Promise<StripeCustomer> {
        const response = await fetch(`${this.API_URL}/create-customer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name }),
        });

        if (!response.ok) throw new Error('Failed to create Stripe customer');
        return response.json();
    }

    async createCostumer(name: string, email: string, password: string) {
        try {
            // Create auth user
            const authData = await AuthService.signUpNewUser(email, password);
            if (!authData || !authData.user) {
                throw new Error('Failed to create auth user');
            }

            // Create Stripe customer
            const customer = await this.createStripeCustomer(email, name);
            if (!customer.id) throw new Error('Invalid Stripe customer ID');

            // Add user to database
            await AuthService.addUserToDatabase(email, name, customer.id);
            return customer;
        } catch (e) {
            console.error('Error in createCustomer:', e);
            throw e;
        }
    }

    async getCostumer() {
        // get costumer from stripe
        try {
            await fetch('http://localhost:3000/get-customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        } catch (e) {
            console.log(e);
        }
    }
}

export default new AddCostumerToStripe();






