import { Route } from 'wouter';
import Home from './Home';
import Game from './Game';

const Routes = () => {
    return (
        <>
            <Route exact path="/">
                <Home></Home>
            </Route>

            <Route path="/Game">
                <Game></Game>
            </Route>
        </>
    )
}

export default Routes;