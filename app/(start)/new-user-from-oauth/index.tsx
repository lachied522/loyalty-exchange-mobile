// when a user signs up with OAuth we must get their contact details before they can link their cards
import { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, router } from 'expo-router';

import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';
import { cn } from '~/components/utils';

import { shadowStyles } from '~/constants/styling';

import { useCustomToast } from '~/app/hooks/useCustomToast';
import { updateUserMetaData } from '~/app/utils/user';
import { type GlobalState, useGlobalContext } from '~/app/context/GlobalContext';
import { processOAuthUserMetadata } from '../functions/oauth-helpers';

type NewUserData = {
  email: string
  first_name: string
  last_name: string
  mobile: string
}

function getFormErrors(data: NewUserData) {
  const errors: { [field: string]: string } = {};

  // if (data.first_name.length === 0) {
  //   errors.first_name = 'Please provide your first name.';
  // }

  // if (data.last_name.length === 0) {
  //   errors.last_name = 'Please provide your last name.';
  // }

  if (data.mobile.length > 0 && data.mobile.length < 10) {
    errors.mobile = 'Please provide a valid mobile.';
  }

  return errors;
}

export default function NewUserFromOAuth() {
    const { session, userMetadata, setUserMetadata } = useGlobalContext() as GlobalState;
    const [isSkipButtonVisible, setIsSkipButtonVisible] = useState<boolean>(true);
    const [formState, setFormState] = useState<NewUserData>({
        email: userMetadata?.email || '',
        first_name: userMetadata?.first_name || '',
        last_name: userMetadata?.last_name || '',
        mobile: userMetadata?.mobile || '',
    });
    const [formErrors, setFormErrors] = useState<{ [field: string]: string | null }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useCustomToast();

    useEffect(() => {
      if (session) {
          const _metadata = processOAuthUserMetadata(session);
          setFormState({
            email: _metadata.email || '',
            first_name: _metadata.first_name || '',
            last_name: _metadata.last_name || '',
            mobile: _metadata.mobile || '',
        });
      }
    }, []);

    const handleSubmit = async () => {
      const errors = getFormErrors(formState);
      if (Object.keys(errors).length === 0) {
          // no errors
          setIsLoading(true);
          try {
              // update user metadata and then update state
              await updateUserMetaData({
                  ...formState,
                  role: 'user'
              });
              setUserMetadata((curr) => ({ ...curr, ...formState }));
              router.replace('/(start)/onboarding');
          } catch (e) {
              toast.show('Something went wrong and we could not update your details. Please try again later.');
              setIsLoading(false);
          }
      } else {
          setFormErrors(errors);
      };
    }

    const onSkip = async () => {
      // add 'role' key to user metadata to indicate that user has completed onboarding
      await updateUserMetaData({
        role: 'user'
      });
      router.replace('(start)/onboarding/');
    }

    const onFieldChange = (field: string, value: string) => {
        setIsSkipButtonVisible(false);
        // update field and reset errors
        setFormState((curr) => ({ ...curr, [field]: value }));
        setFormErrors((curr) => ({ ...curr, [field]: null }));
    }
  
    return (
      <>
        <Stack.Screen
            options={{
                headerShown: false,
                gestureEnabled: false
            }}
        />
        <View className='h-[50vh] w-full bg-yellow-300 bottom-0 absolute'/>
        <ScrollView
          contentContainerStyle={{ height: '100%', marginBottom: 24 }}
          keyboardShouldPersistTaps='handled'
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className='h-full flex flex-col items-center justify-center gap-12'
          >
            <View className='w-full max-w-[360px] bg-white flex flex-col p-6 gap-6 rounded-xl' style={shadowStyles.edge}>
              <H1>Welcome!</H1>
              <Text>Confirm your details below so you can start earning rewards!</Text>
              <View>
                <Text>Email</Text>
                <Input
                    editable={!userMetadata?.email}
                    value={userMetadata?.email}
                    className={cn('min-h-[48px] border-black', formErrors.email && 'border-red-400')}
                />
              </View>

              <View>
                <Text>First Name</Text>
                <Input
                    onChangeText={(text) => onFieldChange('first_name', text)}
                    value={formState.first_name}
                    autoCapitalize='none'
                    className={cn('min-h-[48px] border-black', formErrors.first_name && 'border-red-400')}
                />
                {formErrors.first_name && <Text className='text-red-400'>{formErrors.first_name}</Text>}
              </View>

              <View>
                <Text>Last Name</Text>
                <Input
                    onChangeText={(text) => onFieldChange('last_name', text)}
                    value={formState.last_name}
                    autoCapitalize='none'
                    className={cn('min-h-[48px] border-black', formErrors.last_name && 'border-red-400')}
                />
                {formErrors.last_name && <Text className='text-red-400'>{formErrors.last_name}</Text>}
              </View>
              
              <View className='mb-6'>
                <Text>Mobile</Text>
                <Input
                    onChangeText={(text) => onFieldChange('mobile', text)}
                    value={formState.mobile}
                    autoCapitalize='none'
                    keyboardType='phone-pad'
                    className={cn('min-h-[48px] border-black', formErrors.mobile && 'border-red-400')}
                />
                {formErrors.mobile && <Text className='text-red-400'>{formErrors.mobile}</Text>}
              </View>

              {isSkipButtonVisible? (
              <TouchableOpacity onPress={onSkip}>
                <View className='w-full items-center bg-yellow-400 p-3 rounded-xl'>
                  <Text className='font-display-medium text-lg'>Skip</Text>
                </View>
              </TouchableOpacity>
              ) : (
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleSubmit}
              >
                <View className='w-full items-center bg-yellow-400 p-3 rounded-xl'>
                  <Text className='font-display-medium text-lg'>{isLoading? 'Please wait...': 'Continue'}</Text>
                </View>
              </TouchableOpacity>
              )}
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </>
    )
}