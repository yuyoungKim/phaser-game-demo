import { Route, useRouter } from 'wouter';
import Home from './Home';
import Game from './PhaserGame/Game';
import RouterContext from './RouterContext';

const Routes = () => {
    const { push } = useRouter();

    return (
        <RouterContext.Provider value={push}>
        <>
            <Route exact path="/">
                <Home></Home>
            </Route>

            <Route path="/Game">
                <Game></Game>
            </Route>
        </>
        </RouterContext.Provider>
    )
}

export default Routes;