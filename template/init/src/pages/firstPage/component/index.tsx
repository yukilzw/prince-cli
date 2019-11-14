import React = require('react');
import { connect } from 'react-redux';
import { firstPageService } from '../service/firstPageService';
import { commonService } from '@common/service';
import { Page } from '@common/component/page';
import './firstPage.less';

@connect(
    state => state
)
class FirstPage extends React.Component {
    componentWillMount() {
        firstPageService.request();
    }
    goNextPage = () => {
        commonService.pageJump('push', {
            pathname: '/secondPage'
        });

        commonService.ws.send({ a: 3 });
    }
    render() {
        return (
            <Page name="firstPage">
                <header>firstPage</header>
                <p>1</p>
                <a onClick={this.goNextPage}>NEXT</a>
            </Page>
        );
    }
}

export default FirstPage;