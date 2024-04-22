

export type Transaction = {
    type: 'transaction',
    id: string,
    description: string
    amount: string
    account: string
    direction: 'debit'|'credit'
    institution: string
    connection: string
    reference: string
    postDate: string
    subClass: {
        title: string
    }
}