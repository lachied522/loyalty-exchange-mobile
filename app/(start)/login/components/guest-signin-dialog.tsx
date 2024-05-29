import { useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { supabase } from '@/lib/supabase';

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

interface GuestSigninButtonProps {
    children: React.ReactNode
    handleError: (error: Error) => void
}

export default function GuestSigninDialog({ children, handleError }: GuestSigninButtonProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const closeRef = useRef<View>(null);

    const signInAnonymously = async () => {
        setIsLoading(true);
  
        // check if an existing guest account is available
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // create new anonymous user
          const { error } = await supabase.auth.signInAnonymously();
  
          if (error) {
            console.log({ error });
            handleError(error);
            setIsLoading(false);
            return;
          };
        }
  
        // navigate to main page
        router.replace('/');
    }

    const onCancel = () => {
        // TO DO: cancel signin
        setIsLoading(false);
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Do you want to continue as a guest?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        You will not be able to earn points while you are logged in as a guest.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='flex flex-row justify-between'>
                    <AlertDialogCancel
                        ref={closeRef}
                        onPress={onCancel}
                    >
                        <Text>Cancel</Text>
                    </AlertDialogCancel>

                    <Button onPress={signInAnonymously} className='bg-yellow-400'>
                        {isLoading? (
                        <Text className='font-display-medium text-lg'>Please wait...</Text>
                        ) : (
                        <Text className='font-display-medium text-lg'>Continue</Text>
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}