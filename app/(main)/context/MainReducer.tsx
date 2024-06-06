import type { MainState } from "./MainContext";

export type Action = {
    type: 'SET_DATA',
    payload: MainState['userData']
} | {
    type: 'INSERT_REDEEMED',
    payload: MainState['userData']['redeemed'][number]
} | {
    type: 'SET_STORE_POINTS',
    payload: {
        store_id: string
        value: number
    }
} | {
    type: 'SET_EXCHANGE_POINTS',
    payload: {
        value: number
    }
}

export function MainReducer(state: MainState['userData'], action: Action) {
    switch (action.type) {
        case 'SET_DATA': {
            return action.payload;
        }

        case 'INSERT_REDEEMED': {
            return {
                ...state,
                redeemed: [
                    action.payload,
                    ...state.redeemed,
                ]
            }
        }

        case 'SET_STORE_POINTS': {
            return {
                ...state,
                points: state.points.map((obj) => {
                    if (obj.store_id===action.payload.store_id) {
                        return {
                            ...obj,
                            balance: action.payload.value,
                        }
                    }

                    return obj;
                })
            }
        }

        case 'SET_EXCHANGE_POINTS': {
            return {
                ...state,
                points_balance: action.payload.value,
            }
        }

        default: 
            return state;
    }
}