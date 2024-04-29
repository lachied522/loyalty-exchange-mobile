
// see https://api.basiq.io/reference/gettransactions
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

// see https://api.basiq.io/reference/getaccounts
export type Account = {
    type: 'account'
    id: string
    bsb: string
    unmaskedAccNum: string // unmasked a/c number
    maskedNumber: string // masked version of a/c number
    accountNo: string // BSB + a/c number
    name: string // account name
    accountHolder: string // name of accountholder
    connection: string // id of the 'connection' resource
    class: 'transaction'|'savings'|'credit-card'|'mortgage'|'loan'|'investment'
}