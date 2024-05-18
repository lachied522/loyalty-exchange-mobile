import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { useToast } from "react-native-toast-notifications";

import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { H3 } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { Pencil } from "~/components/Icons";
import { cn } from "~/components/utils";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

import { supabase } from "@/lib/supabase";


function handleSubmitError(error: Error, toast: ReturnType<typeof useToast>) {
    toast.show(
        'Something went wrong. Please try again later.',
        {
            placement: 'top',
            duration: 5000
        }
    )
}

export default function PersonalDetails() {
    const { session } = useGlobalContext() as GlobalState;
    // bug with Button component - functions passed as 'onPress' are not updated with state
    // issue is avoided by using react ref
    const [formState, setFormState] = useState({
        firstName: session?.user.user_metadata['first_name'] ?? '',
        lastName: session?.user.user_metadata['last_name'] ?? '',
        mobile: session?.user.phone ?? '',
        email: session?.user.email ?? '',
    });
    const formRef = useRef<typeof formState>(formState);
    const [isEditting, setIsEditting] = useState<'firstName'|'lastName'|'mobile'|'email'|null>(null);
    const [formIsValid, setFormIsValid] = useState<boolean>(true);

    const toast = useToast();

    useEffect(() => {
        formRef.current = formState;
    }, [formState]);

    const onFieldChange = (field: string, value: string) => {
        setFormState((curr) => ({ ...curr, [field]: value }));
    }

    const validateForm = () => {
        let isValid = true;

        for (const [key, value] of Object.entries(formRef.current)) {
            if (value.length === 0) isValid = false;
        }

        setFormIsValid(isValid);
        return isValid;
    }

    const onSave = async () => {
        // check if data is valid
        const isValid = validateForm();
        if (!isValid) return;

        setIsEditting(null);

        const { error } = await supabase.auth.updateUser({
            email: formRef.current.email,
            data: {
                first_name: formRef.current.firstName,
                last_name: formRef.current.lastName,
                mobile: formRef.current.mobile,
            }
        });

        if (error) {
            handleSubmitError(error, toast);
        }
    }

    return (
        <View className='w-full flex flex-col bg-white gap-4 p-3 pt-6'>
            <H3>My Details</H3>
            <View className='flex flex-col gap-4 px-3'>
                <Card>
                    <CardContent className='w-full flex flex-row items-center justify-between p-2'>
                        <View className='flex flex-col items-stretch'>
                            <Text className='ml-2'>First Name</Text>
                            <Input
                                onChangeText={(text) => onFieldChange('firstName', text)}
                                value={formState.firstName}
                                editable={isEditting==='firstName'}
                                autoCapitalize='none'
                                className={cn(
                                    'w-[240px] border-white',
                                    isEditting==='firstName' && 'border-neutral-200',
                                    formState.firstName.length === 0 && !formIsValid && 'border-red-400'
                                )}
                                style={{ width: 240 }} // width property above doesn't seem to work on ios, set explicitly here
                            />
                        </View>

                        {isEditting==='firstName' ? (
                        <Button onPress={onSave}>
                            <Text className='text-black'>Save</Text>
                        </Button>
                        ) : (
                        <Button onPress={() => setIsEditting('firstName')} className='flex flex-row items-center justify-center gap-2'>
                            <Pencil size={18} color='black' />
                            <Text className='text-black'>Edit</Text>
                        </Button>
                        )}
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className='w-full flex flex-row items-center justify-between p-2'>
                        <View className='flex flex-col items-stretch'>
                            <Text className='ml-2'>Last Name</Text>
                            <Input
                                onChangeText={(text) => onFieldChange('lastName', text)}
                                value={formState.lastName}
                                editable={isEditting==='lastName'}
                                autoCapitalize='none'
                                className={cn(
                                    'w-[240px] border-white',
                                    isEditting==='lastName' && 'border-neutral-200',
                                    formState.lastName.length === 0 && !formIsValid && 'border-red-400'
                                )}
                                style={{ width: 240 }}
                            />
                        </View>

                        {isEditting==='lastName' ? (
                        <Button onPress={onSave}>
                            <Text className='text-black'>Save</Text>
                        </Button>
                        ) : (
                        <Button onPress={() => setIsEditting('lastName')} className='flex flex-row items-center justify-center gap-2'>
                            <Pencil size={18} color='black' />
                            <Text className='text-black'>Edit</Text>
                        </Button>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className='w-full flex flex-row items-center justify-between p-2'>
                        <View className='flex flex-col items-stretch'>
                            <Text className='ml-2'>Email</Text>
                            <Input
                                onChangeText={(text) => onFieldChange('email', text)}
                                value={formState.email}
                                editable={isEditting==='email'}
                                autoCapitalize='none'
                                keyboardType='email-address'
                                className={cn(
                                    'w-[240px] border-white',
                                    isEditting==='email' && 'border-neutral-200',
                                    formState.lastName.length === 0 && !formIsValid && 'border-red-400'
                                )}
                                style={{ width: 240 }}
                            />
                        </View>

                        {isEditting==='email' ? (
                        <Button onPress={onSave}>
                            <Text className='text-black'>Save</Text>
                        </Button>
                        ) : (
                        <Button onPress={() => setIsEditting('email')} className='flex flex-row items-center justify-center gap-2'>
                            <Pencil size={18} color='black' />
                            <Text className='text-black'>Edit</Text>
                        </Button>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className='w-full flex flex-row items-center justify-between p-2'>
                        <View className='flex flex-col items-stretch'>
                            <Text className='ml-2'>Mobile</Text>
                            <Input
                                onChangeText={(text) => onFieldChange('mobile', text)}
                                value={formState.mobile}
                                editable={isEditting==='mobile'}
                                autoCapitalize='none'
                                keyboardType='phone-pad'
                                className={cn(
                                    'w-[240px] border-b border-white',
                                    isEditting==='mobile' && 'border-neutral-200',
                                    formState.lastName.length === 0 && !formIsValid && 'border-red-400'
                                )}
                                style={{ width: 240 }}
                            />
                        </View>

                        {isEditting==='mobile' ? (
                        <Button onPress={onSave}>
                            <Text className='text-black'>Save</Text>
                        </Button>
                        ) : (
                        <Button onPress={() => setIsEditting('mobile')} className='flex flex-row items-center justify-center gap-2'>
                            <Pencil size={18} color='black' />
                            <Text className='text-black'>Edit</Text>
                        </Button>
                        )}
                    </CardContent>
                </Card>
            </View>
        </View>
    )
}