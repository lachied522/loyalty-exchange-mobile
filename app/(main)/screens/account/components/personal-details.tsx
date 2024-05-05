import { useState } from "react";
import { View } from "react-native";

import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { H2, H3, Large } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";
import { Pencil } from "~/components/Icons";
import { cn } from "~/components/utils";

import { useGlobalContext, type GlobalState } from "@/context/GlobalContext";

import { supabase } from "@/lib/supabase";

export default function PersonalDetails() {
    const { session } = useGlobalContext() as GlobalState;
    const [firstName, setFirstName] = useState<string>(session?.user.user_metadata['first_name']);
    const [lastName, setLastName] = useState<string>(session?.user.user_metadata['last_name']);
    const [mobile, setMobile] = useState<string>(session?.user.user_metadata['mobile']);
    const [email, setEmail] = useState<string>(session?.user.email || '');
    const [isEditting, setIsEditting] = useState<'firstName'|'lastName'|'mobile'|'email'|null>(null);
    const [formErrors, setFormErrors] = useState<{ [field: string]: string }>({});
    const [formIsValid, setFormIsValid] = useState<boolean>(true);

    const validateForm = () => {
        const errors: { [field: string]: string } = {};
  
        if (email.length === 0) {
          errors['email'] = 'Enter a valid email';
        }
  
        if (mobile.length === 0) {
          errors['mobile'] = 'Enter a valid mobile';
        }
  
        if (firstName.length === 0) {
          errors['firstName'] = 'Please provide your first name';
        }
  
        if (lastName.length === 0) {
          errors['lastName'] = 'Please provide your last name';
        }
  
        setFormErrors(errors);
        
        const isValid = Object.keys(errors).length === 0;
        setFormIsValid(isValid);
        
        return isValid;
      }

    const onSave = async () => {
        // check if data is valid
        // const isValid = validateForm();
        // if (!isValid) return;

        setIsEditting(null);

        const { error } = await supabase.auth.updateUser({
            email: email,
            phone: mobile,
            data: {
                first_name: firstName,
                last_name: lastName,
                mobile,
            }
        })

        if (error) {
            console.log(error); // TO DO
        }
    }

    return (
        <View className='w-full flex flex-col bg-white gap-4 p-3 pt-6'>
            <H3>My Details</H3>
            <View className='flex flex-col gap-4 px-3'>
                <Card>
                    <CardContent className='w-full flex flex-row items-center justify-between p-2'>
                        <View>
                            <Text className='ml-2'>First Name</Text>
                            <Input
                                onChangeText={(text) => setFirstName(text)}
                                value={firstName}
                                editable={isEditting==='firstName'}
                                autoCapitalize='none'
                                className={cn(
                                    'w-[240px] border-white',
                                    isEditting==='firstName' && 'border-slate-400',
                                    firstName.length === 0 && !formIsValid && 'border-red-400'
                                )}
                            />
                        </View>

                        {isEditting==='firstName' ? (
                        <Button onPress={onSave}>
                            <Text>Save</Text>
                        </Button>
                        ) : (
                        <Button onPress={() => setIsEditting('firstName')} className='flex flex-row items-center justify-center gap-2'>
                            <Pencil size={18} color='black' />
                            <Text>Edit</Text>
                        </Button>
                        )}
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className='w-full flex flex-row items-center justify-between p-2'>
                        <View>
                            <Text className='ml-2'>Last Name</Text>
                            <Input
                                onChangeText={(text) => setLastName(text)}
                                value={lastName}
                                editable={isEditting==='lastName'}
                                autoCapitalize='none'
                                className={cn(
                                    'w-[240px] border-white',
                                    isEditting==='lastName' && 'border-slate-400',
                                    lastName.length === 0 && !formIsValid && 'border-red-400'
                                )}
                            />
                        </View>

                        {isEditting==='lastName' ? (
                        <Button onPress={onSave}>
                            <Text>Save</Text>
                        </Button>
                        ) : (
                        <Button onPress={() => setIsEditting('lastName')} className='flex flex-row items-center justify-center gap-2'>
                            <Pencil size={18} color='black' />
                            <Text>Edit</Text>
                        </Button>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className='w-full flex flex-row items-center justify-between p-2'>
                        <View>
                            <Text className='ml-2'>Email</Text>
                            <Input
                                onChangeText={(text) => setEmail(text)}
                                value={email}
                                editable={isEditting==='email'}
                                autoCapitalize='none'
                                keyboardType='email-address'
                                className={cn(
                                    'w-[240px] border-white',
                                    isEditting==='email' && 'border-slate-400',
                                    lastName.length === 0 && !formIsValid && 'border-red-400'
                                )}
                            />
                        </View>

                        {isEditting==='email' ? (
                        <Button onPress={onSave}>
                            <Text>Save</Text>
                        </Button>
                        ) : (
                        <Button onPress={() => setIsEditting('email')} className='flex flex-row items-center justify-center gap-2'>
                            <Pencil size={18} color='black' />
                            <Text>Edit</Text>
                        </Button>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className='w-full flex flex-row items-center justify-between p-2'>
                        <View>
                            <Text className='ml-2'>Mobile</Text>
                            <Input
                                onChangeText={(text) => setMobile(text)}
                                value={mobile}
                                editable={isEditting==='mobile'}
                                autoCapitalize='none'
                                keyboardType='phone-pad'
                                className={cn(
                                    'w-[240px] border-white',
                                    isEditting==='mobile' && 'border-slate-400',
                                    lastName.length === 0 && !formIsValid && 'border-red-400'
                                )}
                            />
                        </View>

                        {isEditting==='mobile' ? (
                        <Button onPress={onSave}>
                            <Text>Save</Text>
                        </Button>
                        ) : (
                        <Button onPress={() => setIsEditting('mobile')} className='flex flex-row items-center justify-center gap-2'>
                            <Pencil size={18} color='black' />
                            <Text>Edit</Text>
                        </Button>
                        )}
                    </CardContent>
                </Card>
            </View>
        </View>
    )
}