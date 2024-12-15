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
        }).then(() => {
            console.log('User created');
        })
        this.createProfile(data.user.id, email).then(() => {
            console.log('Profile created');
        })




        if (error) {
            return { success: false, message: error.message };
        }
        return { success: true, user: data.user };
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

    async getUserWallet() {
        try {
            const userID = (await supabase.auth.getUser()).data.user.id
            if (!userID) {
                return { success: false, message: 'User not logged in' };
            } else {
                // await supabase.database.from('Users').select('*').eq('user_id', user.id);
                let { data, error } = await supabase.from('Wallets').select('*').eq('user_id', userID);
                if (error) {
                    return { success: false, message: error.message };
                }
                return { success: true, wallet: data[0] };
            }
            
        } catch (error) {
            return { success: false, message: error.message };
            
        }
    }

    async findUserByUserName(userName) {
        try {
            let {data,error} = await supabase.from('Users').select('*').eq('userName', userName);
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
        let {data, error} = await supabase.from('Users').select('*').eq('email', email.trim());
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

    async validateUsername(username){
        try{

        }catch(error){
            return { success: false, message: error.message };
        }
    }

}

const authService = new AuthService();
export default authService;