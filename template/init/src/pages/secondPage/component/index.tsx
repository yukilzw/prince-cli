import React = require('react');
import { connect } from 'react-redux';
import { commonService } from '@common/service';
import { secondPageService } from '../service/secondPageService';
import { Page } from '@common/component/page';
import './secondPage.less';

@connect(
    state => ({
        count: state.count
    })
)
class SecondPage extends React.Component<IReactReadProps> {
    goNextPage = () => {
        commonService.pageJump('push', {
            pathname: '/thirdPage'
        });
    }
    goBeforePage = () => {
        commonService.pageBack('go', -1);
    }
    minus = () => {
        secondPageService.minus();
    }
    add = () => {
        secondPageService.add();
    }
    render() {
        const { count } = this.props;

        return (
            <Page name="secondPage">
                <header onClick={this.goBeforePage}>secondPage</header>
                <p>{count}</p>
                <ul>
                    <li onClick={this.minus}>-</li>
                    <li onClick={this.add}>+</li>
                </ul>
                <a onClick={this.goNextPage}>NEXT</a>
            </Page>
        );
    }
}

export default SecondPage;