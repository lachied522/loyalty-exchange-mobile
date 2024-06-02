import * as React from 'react';
import { TextInput } from 'react-native';

import { cn } from '~/components/utils';

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, placeholderClassName, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(
        'web:flex h-10 native:h-12 web:w-full rounded-md border px-3 web:py-2 text-base lg:text-sm native:text-lg font-display-medium native:leading-[1.25] web:ring-offset-background file:border-0 file:bg-transparent web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
        props.editable === false && 'opacity-50 web:cursor-not-allowed',
        className
      )}
      placeholderClassName={placeholderClassName}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
