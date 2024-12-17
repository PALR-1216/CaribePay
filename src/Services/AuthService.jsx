import { supabase } from "../config/supabaseConfig";

class AuthService {

    async verfiyAuth() {
        const user = supabase.auth.getUser();
        if (!user) {
            return { success: false, message: 'User not logged in' };
        }
        return { success: true, user: user };
    }

    async signUp({ email, password, firstName, lastName, username }) {
        try {
            console.log('Starting signup process...', { email, username });

            // 1. Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: `${firstName} ${lastName}`.trim(),
                    },
                }
            });

            console.log('Auth signup response:', { authData, authError });

            if (authError) throw new Error(authError.message);
            if (!authData?.user) throw new Error('User creation failed');

            // 2. Create user profile
            const { data: profileData, error: profileError } = await supabase
                .from('Users')
                .insert([{
                    user_id: authData.user.id,
                    email: email.toLowerCase(),
                    name: `${firstName} ${lastName}`.trim(),
                    userName: username,
                    created_at: new Date().toISOString(),
                }])
                .select()
                .single();

            console.log('Profile creation response:', { profileData, profileError });

            if (profileError) throw new Error(profileError.message);

            // 3. Create default wallet - Commented out for now
            /*
            const { error: walletError } = await supabase
                .from('Wallets')
                .insert([{
                    user_id: authData.user.id,
                    balance: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }]);

            console.log('Wallet creation response:', { walletError });

            if (walletError) throw new Error(walletError.message);
            */

            return {
                success: true,
                user: {
                    ...authData.user,
                    profile: profileData
                }
            };

        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    async createProfile(userID, email) {
        try {
            const { data, error } = await supabase.from('Users').insert([
                {
                    user_id: user.id,
                    email: user.email,
                    first_name: '',
                    last_name: '',
                    userName: '',
                    phone_number: '',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ]);
        } catch (error) {
            return { success: false, message: error.message };
        }

        if (error) {
            return { success: false, message: error.message };
        }
        return { success: true, user: data[0] };
    }

    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { success: false, message: error.message };
        }
        return { success: true, user: data.user };
    };

    async getUser() {
        try {
            const userID = (await supabase.auth.getUser()).data.user.id
            if (!userID) {
                return { success: false, message: 'User not logged in' };
            } else {
                // await supabase.database.from('Users').select('*').eq('user_id', user.id);
                let { data, error } = await supabase.from('Users').select('*').eq('user_id', userID);
                if (error) {
                    return { success: false, message: error.message };
                }
                return { success: true, user: data[0] };
            }

        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Removed getUserWallet method

    async findUserByUserName(userName) {
        try {
            let { data, error } = await supabase.from('Users').select('*').eq('userName', userName);
            if (error) {
                return { success: false, message: error.message };
            }
            const userID = (await supabase.auth.getUser()).data.user.id;
            const filteredData = data.filter(user => user.user_id !== userID);
            return { success: true, users: filteredData };

        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async validateEmail(email) {
        try {
            let { data, error } = await supabase.from('Users').select('*').eq('email', email.trim());
            if (error) {
                return { success: false, message: error.message };
            }
            if (data.length > 0) {  // Changed from >= 0 to > 0
                return { success: false, message: 'Email already exists' };
            }
            return { success: true, message: 'Email is valid' };

        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async validateUsername(username) {
        try {
            let { data, error } = await supabase.from('Users').select('userName').ilike('userName', username.trim().toLowerCase());

            if (error) {
                return { success: false, message: error.message };
            }
            if (data.length > 0) {
                return { success: false, message: 'Username already exists' };
            }
            return { success: true, message: 'Username is valid' };

        } catch (error) {
            return { success: false, message: error.message };
        }
    }

}

const authService = new AuthService();
export default authService;