import React = require('react');
import { connect } from 'react-redux';
import { firstPageService } from '../service/firstPageService';
import { commonService } from '@common/service';
import { Page } from '@common/component/page';
import { FistPageState } from '../interface';
import './firstPage.less';

@connect(
    state => state
)
class FirstPage extends React.Component<IReactReadProps, FistPageState> {
    state = {
        num: 10
    };
    componentWillMount() {
        firstPageService.request();
    }
    componentDidMount() {
        commonService.ws.subscribe('lzw', this.subscribeData, this);
    }
    componentWillUnmount() {
        commonService.ws.unSubscribe('lzw', this.subscribeData, this);
    }
    private subscribeData(data) {
        this.setState((preState) => ({ num: preState.num + 1 }));
    }
    private goNextPage = () => {
        commonService.pageJump('push', {
            pathname: '/secondPage'
        });

        commonService.ws.send({ data: 0 });
    }
    public render() {
        return (
            <Page name="firstPage">
                <header>firstPage</header>
                <p>{this.state.num}</p>
                <a onClick={this.goNextPage}>NEXT</a>
            </Page>
        );
    }
}

export default FirstPage;