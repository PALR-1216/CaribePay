import { supabase } from "../config/supabaseConfig";

class AuthService {

    async verfiyAuth() {
        const user = supabase.auth.getUser();
        if (!user) {
            return { success: false, message: 'User not logged in' };
        }
        return { success: true, user: user };
    }

    async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return { success: false, message: error.message };
        }
        return { success: true, user: data.user };
    }

    async createProfile(user) {
        try {
            const { data, error } = await supabase.from('Users').insert([
                {
                    user_id: user.id,
                    email: user.email,
                    first_name: '',
                    last_name: '',
                    userName: '',
                    phone_number: '',
                    date_of_birth: '',
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


}

const authService = new AuthService();
export default authService;