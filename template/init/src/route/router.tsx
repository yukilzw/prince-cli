import * as React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { commonService, Touch } from '@common/service';
import routeConfig from '@route';

const asyncLoader = (history, loadComponent) => (
    class AsyncLoader extends React.Component {
        state = {
            LazyComponent: null
        }
        componentDidMount() {
            loadComponent().then(({ default: LazyComponent }) => {
                this.setState({ LazyComponent });
            });
        }
        render() {
            const { LazyComponent } = this.state;

            return LazyComponent ? <LazyComponent history={history} /> : null;
        }
    }
);

const ANIMATION = {
    PUSH: 'go',
    POP: 'back'
};

@connect(
    state => ({
        routecss: state.routecss
    })
)
class Main extends React.Component<IReactReadProps> {
    render() {
        const { store } = this.props;

        return (
            <BrowserRouter>
                <Provider store={store}>
                    <Route render={router => {
                        commonService.router = router;
                        const { location, history } = router;

                        return (
                            <Touch onSwipe={e => commonService.swipePage(e)}>
                                <TransitionGroup
                                    className={'router-wrapper'}
                                    childFactory={child => React.cloneElement(
                                      child,
                                      {classNames: ANIMATION[history.action]}
                                    )}
                                >
                                    <CSSTransition
                                        key={location.key}
                                        timeout={300}
                                    >
                                        <div className="route-translate-box" key={location.pathname}>
                                            <Switch location={location}>
                                                {routeConfig.map(({ path, modules }) => <Route
                                                    location={location}
                                                    exact path={path}
                                                    component={asyncLoader(history, modules)}
                                                    key={path}
                                                />)}
                                            </Switch>
                                        </div>
                                    </CSSTransition>
                                </TransitionGroup>
                            </Touch>
                        );
                    }}/>
                </Provider>
            </BrowserRouter>
        );
    }
}

export default Main;