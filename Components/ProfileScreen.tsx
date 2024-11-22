import { useStripe } from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import AuthService from "../Services/AuthService";

export default function ProfileScreen() {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [setupIntentId, setSetupIntentId] = useState('');
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        AuthService.getCurrentUserData().then((data) => {
            console.log(data)
            setUserData(data);
        });
    },[]);


    const getUserData = async() => {
        AuthService.getCurrentUserData();
    }

    const initializePaymentSheet = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/create-setup-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const { clientSecret, setupIntent } = await response.json();
            setSetupIntentId(setupIntent);

            const { error } = await initPaymentSheet({
                setupIntentClientSecret: clientSecret,
                merchantDisplayName: 'ReleifCoin',
                style: 'alwaysDark', // Can be 'automatic', 'alwaysLight', or 'alwaysDark'
            });

            if (error) {
                console.error('Payment sheet init error:', error);
                Alert.alert('Error', error.message);
            }
        } catch (error: any) {
            console.error('Setup error:', error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };



    const openPaymentSheet = async () => {
        try {
            setLoading(true);
            await initializePaymentSheet();

            const { error } = await presentPaymentSheet();

            if (error) {
                Alert.alert('Error', error.message);
            } else {
                // Retrieve the payment method ID and attach it
                const setupIntentResponse = await fetch(`http://localhost:3000/retrieve-setup-intent/${setupIntentId}`);
                const { paymentMethodId } = await setupIntentResponse.json();

                Alert.alert('Success', 'Card was successfully saved and attached to customer');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Welcome to your profile</Text>
            <Text style={styles.subtitle}>Here you can view and edit your profile information</Text>
            <Text style={styles.subtitle}>You can also view your payment history</Text>
            <Button
                title={loading ? "Loading..." : "Add Payment Method"}
                onPress={openPaymentSheet}
                disabled={loading}
            />
        </View>
    );



    
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 8,
    },
});