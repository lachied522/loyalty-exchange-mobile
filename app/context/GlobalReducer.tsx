import type { GlobalState } from "./GlobalContext";

import type { Reward } from "@/types/helpers";

export type Action = {
    type: 'SET_DATA',
    payload: GlobalState['userData']
} | {
    type: 'REDEEM_REWARD',
    payload: Reward
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

export function GlobalReducer(state: GlobalState['userData'], action: Action) {
    switch (action.type) {
        case 'SET_DATA': {
            return action.payload;
        }

        case 'REDEEM_REWARD': {
            return {
                ...state,
                rewards: state.rewards.map((reward) => {
                    if (reward.id===action.payload.id) {
                        return {
                            ...reward,
                            redeemed: true,
                            redeemed_at: new Date().toISOString()
                        }
                    }

                    return reward;
                })
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