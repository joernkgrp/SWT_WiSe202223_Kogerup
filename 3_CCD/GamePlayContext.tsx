/**
 * Import framework and components
 */
import React from 'react';
import { Observer } from 'mobx-react';
import { GameplaySession } from "../../gameplay/GameplaySession";
/**
 * Global gameplay session to manage the game
 */
export const GameplaySession = new GameplaySession()
/**
 * Global gameplay context
 */
export const GameplayContext = React.createContext({ session: GameplaySession })
/**
 * Gameplay context provider
 * @param children List of child components which will be provided with the gameplay context
 * @constructor
 */
export const GameplayContextProvider = ({ children }: any) => {
    return (
        <GameplayContext.Provider value={{ session: GameplaySession }}>
            {children}
        </GameplayContext.Provider>
    )
}
/**
 * Gameplay context consumer
 * @param children List of child components which will consume the gameplay context
 * @constructor
 */
export const GameplayContextConsumer = ({ children }: any) => {
    return (
        <GameplayContext.Consumer>
            {(value) => (<Observer>{() => children(value)}</Observer>)}
        </GameplayContext.Consumer>
    )
}