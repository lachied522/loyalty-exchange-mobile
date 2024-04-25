import type { GlobalState } from "./GlobalContext";

import type { Reward } from "@/types/helpers";

export type Action = {
    type: 'SET_DATA',
    payload: GlobalState['userData']
} | {
    type: 'REDEEM_REWARD',
    payload: Reward
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

        default: 
            return state;
    }
}