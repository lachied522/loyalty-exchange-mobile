import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Info } from '~/components/Icons';

export default function LoyaltyInfoDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Info size={24} color='black' />
            </DialogTrigger>
            <DialogContent className='round-full m-2'>
                <DialogHeader>
                    <DialogTitle>
                        LoyaltyExchange Points
                    </DialogTitle>
                    <DialogDescription>
                        LoyaltyExchange Points are earned when you spend at any store on our network. These points can be converted into points at any store.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='flex items-end'>
                    <DialogClose asChild>
                        <Button className='w-[80px] border border-slate-200'>
                            <Text>OK</Text>
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}