import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { Pencil } from "~/components/Icons";
import { cn } from "~/components/utils";

import { useCustomToast } from "~/app/hooks/useCustomToast";

import { updateUserMetaData } from "~/app/utils/user";

import { useGlobalContext, type GlobalState } from "~/app/context/GlobalContext";

import ConvertAccountButton from "./convert-account-button";

import type { UserMetadata } from "@/types/helpers";

function handleSubmitError(error: Error, toast: ReturnType<typeof useCustomToast>) {
    toast.show('Something went wrong. Please try again later.');
}

export default function PersonalDetails() {
    const { isAnonymous, userMetadata, setUserMetadata } = useGlobalContext() as GlobalState;
    // bug with Button component - functions passed as 'onPress' are not updated with state
    // issue is avoided by using react ref
    const [formState, setFormState] = useState<UserMetadata>({
        ...(
            userMetadata ? userMetadata: {
                first_name: '',
                last_name: '',
                email: '',
                mobile: ''
            }
        )
    });
    const formRef = useRef<typeof formState>(formState);
    const [isEditting, setIsEditting] = useState<'first_name'|'last_name'|'mobile'|'email'|null>(null);
    const [formIsValid, setFormIsValid] = useState<boolean>(true);
    const toast = useCustomToast();

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
        try {
            await updateUserMetaData({ ...formRef.current });
            setUserMetadata(formState);
        } catch (error: any) {
            handleSubmitError(error, toast);
        }
    }

    return (
        <View className='w-full flex flex-col bg-white gap-4 p-3 pt-6'>
            <Large>My Details</Large>

            {isAnonymous? (
            <View className='flex flex-col items-center justify-center p-6 gap-6'>
                <Text>You are logged in as a guest.</Text>

                <ConvertAccountButton />
            </View>
            ) : (
            <View className='flex flex-col gap-4 px-3'>
                <Card>
                    <CardContent className='w-full flex flex-row items-center justify-between p-2'>
                        <View className='flex flex-col items-stretch'>
                            <Text className='ml-2'>First Name</Text>
                            <Input
                                value={formState.first_name}
                                onChangeText={(text) => onFieldChange('first_name', text)}
                                onSubmitEditing={onSave}
                                editable={isEditting==='first_name'}
                                autoCapitalize='none'
                                className={cn(
                                    'w-[240px] border-white',
                                    isEditting==='first_name' && 'border-neutral-200',
                                    formState.first_name?.length === 0 && !formIsValid && 'border-red-400'
                                )}
                                style={{ width: 240 }} // width property above doesn't seem to work on ios, set explicitly here
                            />
                        </View>

                        {isEditting==='first_name' ? (
                        <Button onPress={onSave}>
                            <Text className='text-black'>Save</Text>
                        </Button>
                        ) : (
                        <Button onPress={() => setIsEditting('first_name')} className='flex flex-row items-center justify-center gap-2'>
                            <Pencil size={16} color='black' />
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
                                value={formState.last_name}
                                onChangeText={(text) => onFieldChange('last_name', text)}
                                onSubmitEditing={onSave}
                                editable={isEditting==='last_name'}
                                autoCapitalize='none'
                                className={cn(
                                    'w-[240px] border-white',
                                    isEditting==='last_name' && 'border-neutral-200',
                                    formState.last_name?.length === 0 && !formIsValid && 'border-red-400'
                                )}
                                style={{ width: 240 }}
                            />
                        </View>

                        {isEditting==='last_name' ? (
                        <Button onPress={onSave}>
                            <Text className='text-black'>Save</Text>
                        </Button>
                        ) : (
                        <Button onPress={() => setIsEditting('last_name')} className='flex flex-row items-center justify-center gap-2'>
                            <Pencil size={16} color='black' />
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
                                value={formState.email}
                                onChangeText={(text) => onFieldChange('email', text)}
                                onSubmitEditing={onSave}
                                editable={isEditting==='email'}
                                autoCapitalize='none'
                                keyboardType='email-address'
                                className={cn(
                                    'w-[240px] border-white',
                                    isEditting==='email' && 'border-neutral-200',
                                    formState.email?.length === 0 && !formIsValid && 'border-red-400'
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
                            <Pencil size={16} color='black' />
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
                                value={formState.mobile}
                                onChangeText={(text) => onFieldChange('mobile', text)}
                                onSubmitEditing={onSave}
                                editable={isEditting==='mobile'}
                                autoCapitalize='none'
                                keyboardType='phone-pad'
                                className={cn(
                                    'w-[240px] border-b border-white',
                                    isEditting==='mobile' && 'border-neutral-200',
                                    formState.mobile?.length === 0 && !formIsValid && 'border-red-400'
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
                            <Pencil size={16} color='black' />
                            <Text className='text-black'>Edit</Text>
                        </Button>
                        )}
                    </CardContent>
                </Card>
            </View>
            )}
        </View>
    )
}