import { useState, useCallback } from "react";
import { useToast } from "react-native-toast-notifications";

export function useCustomToast() {
    const [isToastVisible, setIsToastVisible] = useState<boolean>(false); // true if a toast is currently visible on screen
    const toast = useToast();

    const show = useCallback(
        (message: string, type: 'normal'|'success'|'warning'|'danger' = 'normal', duration: number = 5000) => {
            if (isToastVisible) return; // prevent multiple toasts from being visible
            setIsToastVisible(true);

            toast.show(
                message,
                {
                    placement: 'top',
                    type,
                    duration,
                }
            );

            setTimeout(() => {
                setIsToastVisible(false);
            }, duration)
        },
        [toast, isToastVisible, setIsToastVisible]
    );

    const showUnknownError = useCallback(
        () => {
            toast.show(
                'Something went wrong. Please try again later.',
                {
                    placement: 'top',
                    type: 'normal',
                    duration: 5000
                }
            )
        },
        [toast, isToastVisible, setIsToastVisible]
    )

    return {
        show,
        showUnknownError
    }
}