import React = require('react');
import ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { HashRouter, Route } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { commonService, Touch } from '@common/service';
import routeConfig from '@route';

const asyncLoader = loadComponent => (
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

            return LazyComponent ? <LazyComponent /> : null;
        }
    }
);

@connect(
    state => ({
        routecss: state.routecss
    })
)
class Main extends React.Component<IReactReadProps> {
    render() {
        const { store } = this.props;

        return (
            <HashRouter hashType="noslash">
                <Provider store={store}>
                    <Route render={router => {
                        commonService.router = router;
                        const { location } = router;

                        return (
                            <Touch onSwipe={e => commonService.swipePage(e)}>
                                <ReactCSSTransitionGroup
                                    transitionName={this.props.routecss}
                                    transitionEnterTimeout={0}
                                    transitionLeaveTimeout={0} >
                                    <div className="route-translate-box" key={location.pathname}>
                                        {routeConfig.map(({ path, modules }) => <Route location={location} exact path={path} component={asyncLoader(modules)} key={path}/>)}
                                    </div>
                                </ReactCSSTransitionGroup>
                            </Touch>
                        );
                    }}/>
                </Provider>
            </HashRouter>
        );
    }
}

export default Main;