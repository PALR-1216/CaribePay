/**
 * Service class handling authentication operations using Supabase.
 * @class
 */

/**
 * Interface representing user data structure in the database
 * @interface UserData
 * @property {string} email - User's email address
 * @property {string} name - User's full name
 * @property {string} customer_id - Unique customer identifier
 * @property {string} created_at - Timestamp of user creation
 */

/**
 * Handles error logging and throwing
 * @private
 * @param {any} error - The error object to handle
 * @param {string} context - Context description where the error occurred
 * @throws {Error} Throws an error with context and message
 */

/**
 * Registers a new user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<{user: any} | undefined>} User data if successful, undefined if failed
 */

/**
 * Signs in a user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<any>} Session data if successful, null if failed
 */

/**
 * Adds a new user to the database
 * @param {string} email - User's email address
 * @param {string} name - User's full name
 * @param {string} customerID - User's customer ID
 * @returns {Promise<UserData | undefined>} User data if successful, undefined if failed
 */

/**
 * Retrieves current user's data from database
 * @returns {Promise<any | null>} User data if found, null if not found or error
 */

/**
 * Gets current authenticated user
 * @returns {Promise<any | null>} User object if authenticated, null if not
 */

/**
 * Stores authentication session in AsyncStorage
 * @param {any} session - Session object to store
 * @returns {Promise<void>}
 */

/**
 * Checks if user is currently authenticated
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */

/**
 * Signs out current user and clears session
 * @returns {Promise<void>}
 */

/**
 * Stores data in AsyncStorage with given key
 * @param {string} key - Key to store data under
 * @param {any} value - Value to store
 * @returns {Promise<void>}
 * @throws {Error} If storage operation fails
 */
import { supabase } from "../utils/supabase";
import { AuthResponse } from '@supabase/supabase-js';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserData {
    email: string;
    name: string;
    customer_id: string;
    created_at: string;
}

class AuthService {
    private async handleError(error: any, context: string): Promise<never> {
        console.error(`${context}:`, error);
        throw new Error(`${context}: ${error.message}`);
    }

    async signUpNewUser(email: string, password: string): Promise<{ user: any } | undefined> {
        try {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            if (!data?.user?.id) throw new Error('Failed to create user account');
            return data;
        } catch (error) {
            this.handleError(error, 'Authentication error');
            return undefined;
        }
    }

    async signInUser(email: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Store session after successful login
            if (data.session) {
                await AsyncStorage.setItem('auth_session', JSON.stringify(data.session));
                console.log('Session stored after login');
            }

            return data;
        } catch (error) {
            this.handleError(error, 'Login error');
            return null;
        }
    }

    async addUserToDatabase(email: string, name: string, customerID: string): Promise<UserData | undefined> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No authenticated user found');

            const userData: Partial<UserData> = {
                email,
                name,
                customer_id: customerID,
                created_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('Users')
                .insert([userData])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            this.handleError(error, 'Database error');
            return undefined;
        }
    }

    async getCurrentUserData(): Promise<any | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No authenticated user found');

            console.log('Attempting to fetch data for email:', user.email);

            const { data, error } = await supabase
                .from('Users')
                .select('*')
                .eq('email', user.email);

            if (error) throw error;

            if (!data || data.length === 0) {
                console.log('No user data found in database');
                return null;
            }

            // console.log('User Database Info:', JSON.stringify(data[0], null, 2));
            return data[0];
        } catch (error: any) {
            if (error.code === 'PGRST116') {
                console.log('User not found in database');
                return null;
            }
            this.handleError(error, 'Get current user data error');
            return null;
        }
    }



    async getCurrentUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            console.log('Current Auth User:', JSON.stringify(user, null, 2));
            return user;
        } catch (error) {
            this.handleError(error, 'Get current user error');
            return null;
        }
    }

    async storeAuthSession(session: any) {
        try {
            await AsyncStorage.setItem('auth_session', JSON.stringify(session));
            console.log('Auth session stored successfully');
        } catch (error) {
            this.handleError(error, 'Store auth session error');
        }
    }

    async isAuthenticated(): Promise<boolean> {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            return !!session;
        } catch (error) {
            console.log('Auth check error:', error);
            return false;
        }
    }

    async signOut() {
        try {
            await AsyncStorage.removeItem('auth_session');
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            this.handleError(error, 'Sign out error');
        }
    }

    //store the token of the user store the id
    async storeData(key: string, value: any) {
        try {
            await AsyncStorage.setItem(`${key}`, value);
            console.log('Data successfully saved');
        } catch (e: any) {
            // saving error
            console.log(e.message);
            throw e;
        }
    };
}

export default new AuthService();