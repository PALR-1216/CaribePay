import { SafeAreaView, Text, Button, Alert } from "react-native"
import { useStripe } from "@stripe/stripe-react-native"
import { useEffect, useState } from 'react'
import AuthService from "../Services/AuthService";
import { useNavigation } from '@react-navigation/native';

function HomeScreen() {
    const navigation = useNavigation();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [setupIntentId, setSetupIntentId] = useState('');

    useEffect(() => {
        //add the user to use state 
        const fetchUser = async () => {
            await AuthService.getCurrentUserData();
        };
        fetchUser();

    }
        , []);


    const logOut = async () => {
        console.log("logging out")
        await AuthService.signOut();
        navigation.navigate('Login' as never);
    }

   

    return (
        <SafeAreaView>
            <Text>Home Screen</Text>
            

            <Button title="logout" onPress={logOut}/>
        </SafeAreaView>
    )
}

export default HomeScreen;