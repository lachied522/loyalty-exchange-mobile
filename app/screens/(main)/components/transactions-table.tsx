// https://rnr-docs.vercel.app/components/table/
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table';

import type { UserData } from '~/app/utils/data-fetching';

interface TransactionsTableProps {
    data: UserData
}

export default function TransactionsTable({ data }: TransactionsTableProps) {

    return (
        <Table></Table>
    )
}