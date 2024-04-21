import { BASIQ_API_KEY } from '@env';

export async function getBasiqServerAccessToken(): Promise<string> {
    return fetch('https://au-api.basiq.io/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${BASIQ_API_KEY}`, 
            'Content-Type': 'application/x-www-form-urlencoded', 
            'basiq-version': '3.0'
        },
        body: JSON.stringify({ scope: 'SERVER_ACCESS' }),
    })
    .then((res) => res.json())
    .then((res) => res['access_token']);
}