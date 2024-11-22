import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView, TextInput, Text, Button, StyleSheet, Alert, TouchableOpacity, View, Dimensions, Animated } from "react-native";
import addCostumerToStripe from "../Services/AddCostumerToStripe";
import * as Haptics from 'expo-haptics';
import authService from "../Services/AuthService";

const width = Dimensions.get('window').width;

interface UserFormData {
    personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
        dateOfBirth: {
            month: string;
            day: string;
            year: string;
            fullDate: string;
        };
    };
}

const CREATE_USER_STEPS = {
    PERSONAL_INFO: 1,
    SECURITY: 2,
    COMPLETE: 3,
} as const;

function CreateUserScreen() {
    const [firstName, setFirstName] = useState('Pedro');
    const [lastName, setLastName] = useState('Lorenzo');
    const [email, setEmail] = useState('parl12202000@gmail.com');
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('9394141159');
    const [password, setPassword] = useState('Alejandro16!');
    const [confirmPassword, setConfirmPassword] = useState('Alejandro16!');
    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: true,
        hasUpperCase: true,
        hasLowerCase: true,
        hasNumber: true,
        hasSpecial: true,
    });
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    // Update the date state variables
    const [month, setMonth] = useState('12');
    const [day, setDay] = useState('16');
    const [year, setYear] = useState('2000');

    const slideAnim = useRef(new Animated.Value(0)).current;

    const createUserData = (): UserFormData => ({
        personalInfo: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password: password.trim(),
            dateOfBirth: {
                month,
                day,
                year,
                fullDate: `${month}/${day}/${year}`
            }
        }
    });

    const handleUserCreation = async () => {
        try {
            const userData = createUserData();
            await addCostumerToStripe.createCostumer(
                `${userData.personalInfo.firstName} ${userData.personalInfo.lastName}`,
                userData.personalInfo.email,
                userData.personalInfo.password
            );

            Alert.alert('Success', 'Account created successfully!');
        } catch (error) {
            console.error('Error creating user:', error);
            Alert.alert('Error', 'Failed to create account. Please try again.');
        }
    };

    const validateStep1 = () => {
        if (!firstName.trim()) {
            Alert.alert('Error', 'Please enter your first name');
            return false;
        }
        if (!lastName.trim()) {
            Alert.alert('Error', 'Please enter your last name');
            return false;
        }
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return false;
        }
        if (!email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email');
            return false;
        }
        if (!phone.trim()) {
            Alert.alert('Error', 'Please enter your phone number');
            return false;
        }
        if (!month || !day || !year) {
            Alert.alert('Error', 'Please enter your complete date of birth');
            return false;
        }
        if (parseInt(year) > new Date().getFullYear() || parseInt(year) < 1900) {
            Alert.alert('Error', 'Please enter a valid year');
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        if (!password.trim()) {
            Alert.alert('Error', 'Please create a password');
            return false;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }
        if (!Object.values(passwordRequirements).every(Boolean)) {
            Alert.alert('Error', 'Please meet all password requirements');
            return false;
        }
        return true;
    };

    const handleMonthInput = (value: string) => {
        if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= 12)) {
            setMonth(value.length === 2 && value.startsWith('0') ? value[1] : value);
            if (value.length === 2 && dayInput) dayInput.focus();
        }
    };

    const handleDayInput = (value: string) => {
        if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= 31)) {
            setDay(value.length === 2 && value.startsWith('0') ? value[1] : value);
            if (value.length === 2 && yearInput) yearInput.focus();
        }
    };

    const handleYearInput = (value: string) => {
        if (value === '' || (/^\d+$/.test(value) && value.length <= 4)) {
            setYear(value);
        }
    };

    const checkPasswordRequirements = (pass: string) => {
        setPasswordRequirements({
            minLength: pass.length >= 8,
            hasUpperCase: /[A-Z]/.test(pass),
            hasLowerCase: /[a-z]/.test(pass),
            hasNumber: /[0-9]/.test(pass),
            hasSpecial: /[@$!%*?&]/.test(pass),
        });
    };

    const checkPasswordMatch = (confirmPass: string) => {
        setConfirmPassword(confirmPass);
        setPasswordsMatch(password === confirmPass);
    };

    let dayInput: TextInput | null;
    let yearInput: TextInput | null;

    const nextStep = () => {
        const isValid = step === CREATE_USER_STEPS.PERSONAL_INFO 
            ? validateStep1() 
            : validateStep3();

        if (!isValid) return;

        if (step === CREATE_USER_STEPS.SECURITY) {
            handleUserCreation();
            return;
        }

        animateToNextStep();
    };

    const prevStep = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Animated.timing(slideAnim, {
            toValue: -width * (step - 2),
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setStep(prev => prev - 1);
        });
    };

    const animateToNextStep = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Animated.timing(slideAnim, {
            toValue: -width * step,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setStep(prev => prev + 1));
    };

    const renderSteps = () => {
        return (
            <Animated.View
                style={[
                    styles.stepsContainer,
                    { transform: [{ translateX: slideAnim }] },
                ]}
            >
                <View style={styles.stepWrapper}>
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Personal Information</Text>
                        <View style={styles.rowContainer}>
                            <View style={styles.halfInput}>
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="First Name" 
                                    value={firstName} 
                                    onChangeText={setFirstName}
                                />
                            </View>
                            <View style={styles.halfInput}>
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="Last Name" 
                                    value={lastName} 
                                    onChangeText={setLastName}
                                />
                            </View>
                        </View>
                        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
                        <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} />
                        <View style={styles.dobSection}>
                            <Text style={styles.dobLabel}>Date of Birth</Text>
                            <View style={styles.dobContainer}>
                                <View style={styles.dateGroup}>
                                    <TextInput
                                        style={styles.dateInput}
                                        placeholder="MM"
                                        value={month}
                                        onChangeText={handleMonthInput}
                                        keyboardType="numeric"
                                        maxLength={2}
                                        placeholderTextColor="#A0A0A0"
                                    />
                                    <View style={styles.dateUnderline} />
                                    <Text style={styles.dateHint}>Month</Text>
                                </View>
                                <View style={styles.dateDivider} />
                                <View style={styles.dateGroup}>
                                    <TextInput
                                        ref={ref => dayInput = ref}
                                        style={styles.dateInput}
                                        placeholder="DD"
                                        value={day}
                                        onChangeText={handleDayInput}
                                        keyboardType="numeric"
                                        maxLength={2}
                                        placeholderTextColor="#A0A0A0"
                                    />
                                    <View style={styles.dateUnderline} />
                                    <Text style={styles.dateHint}>Day</Text>
                                </View>
                                <View style={styles.dateDivider} />
                                <View style={styles.dateGroup}>
                                    <TextInput
                                        ref={ref => yearInput = ref}
                                        style={[styles.dateInput, styles.yearInput]}
                                        placeholder="YYYY"
                                        value={year}
                                        onChangeText={handleYearInput}
                                        keyboardType="numeric"
                                        maxLength={4}
                                        placeholderTextColor="#A0A0A0"
                                    />
                                    <View style={styles.dateUnderline} />
                                    <Text style={styles.dateHint}>Year</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.stepWrapper}>
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Security</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Create Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                checkPasswordRequirements(text);
                                setPasswordsMatch(text === confirmPassword);
                            }}
                            secureTextEntry
                        />
                        <TextInput 
                            style={[
                                styles.input, 
                                !passwordsMatch && styles.inputError
                            ]} 
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={checkPasswordMatch}
                            secureTextEntry
                        />
                        {!passwordsMatch && confirmPassword.length > 0 && (
                            <Text style={styles.errorText}>Passwords do not match</Text>
                        )}
                        <View style={styles.passwordRequirements}>
                            <Text style={styles.requirementTitle}>Password must have:</Text>
                            <View style={styles.requirementItem}>
                                <View style={[styles.checkDot, passwordRequirements.minLength && styles.validRequirement]} />
                                <Text style={styles.requirementText}>At least 8 characters</Text>
                            </View>
                            <View style={styles.requirementItem}>
                                <View style={[styles.checkDot, passwordRequirements.hasUpperCase && styles.validRequirement]} />
                                <Text style={styles.requirementText}>One uppercase letter</Text>
                            </View>
                            <View style={styles.requirementItem}>
                                <View style={[styles.checkDot, passwordRequirements.hasLowerCase && styles.validRequirement]} />
                                <Text style={styles.requirementText}>One lowercase letter</Text>
                            </View>
                            <View style={styles.requirementItem}>
                                <View style={[styles.checkDot, passwordRequirements.hasNumber && styles.validRequirement]} />
                                <Text style={styles.requirementText}>One number</Text>
                            </View>
                            <View style={styles.requirementItem}>
                                <View style={[styles.checkDot, passwordRequirements.hasSpecial && styles.validRequirement]} />
                                <Text style={styles.requirementText}>One special character (@$!%*?&)</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressContainer}>
                {[1, 2, 3].map((item) => (
                    <View
                        key={item}
                        style={[
                            styles.progressDot,
                            step === item && styles.activeDot,
                        ]}
                    />
                ))}
            </View>
            
            {renderSteps()}

            <View style={styles.buttonContainer}>
                {step > 1 && (
                    <TouchableOpacity 
                        style={[styles.button]} 
                        onPress={prevStep}
                    >
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity 
                    style={[styles.button]} 
                    onPress={step < 2 ? nextStep : handleUserCreation}
                >
                    <Text style={styles.buttonText}>{step === 2 ? 'Create Account' : 'Next'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#C0C0C0',
        marginHorizontal: 6,
    },
    activeDot: {
        backgroundColor: '#000000',
        width: 12,
        height: 12,
    },
    stepContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 20,
    },
    stepTitle: {
        fontSize: 22,
        fontWeight: '500',
        marginBottom: 15,
        color: '#000000',
    },
    input: {
        backgroundColor: '#F0F0F0',
        borderRadius: 5,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 14,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: '#000000',
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
    },
    passwordHint: {
        fontSize: 12,
        color: '#808080',
        marginTop: 5,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    halfInput: {
        flex: 0.48,
    },
    dobSection: {
        marginBottom: 20,
        backgroundColor: '#F8F8F8',
        borderRadius: 10,
        padding: 15,
    },
    dobLabel: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 12,
        fontWeight: '500',
    },
    dobContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    dateGroup: {
        alignItems: 'center',
        flex: 1,
    },
    dateInput: {
        fontSize: 18,
        textAlign: 'center',
        color: '#000000',
        backgroundColor: 'transparent',
        width: '100%',
        height: 40,
        padding: 0,
    },
    yearInput: {
        width: '100%',
    },
    dateUnderline: {
        height: 2,
        backgroundColor: '#E0E0E0',
        width: '80%',
        marginTop: 4,
    },
    dateHint: {
        fontSize: 12,
        color: '#909090',
        marginTop: 6,
    },
    dateDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 10,
        alignSelf: 'center',
    },
    stepsContainer: {
        flexDirection: 'row',
        width: width * 3,
    },
    stepWrapper: {
        width: width,
    },
    passwordRequirements: {
        marginTop: 15,
        backgroundColor: '#F8F8F8',
        padding: 15,
        borderRadius: 8,
    },
    requirementTitle: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 10,
        color: '#000000',
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    requirementText: {
        fontSize: 13,
        color: '#666666',
        marginLeft: 8,
    },
    checkDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#C0C0C0',
    },
    validRequirement: {
        backgroundColor: '#00C853',
    },
    inputError: {
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: -8,
        marginBottom: 8,
        marginLeft: 4,
    },
});

export default CreateUserScreen;