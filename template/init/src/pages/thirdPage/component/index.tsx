import React = require('react');
import { connect } from 'react-redux';
import { commonService } from '@common/service';
import { Page } from '@common/component/page';
import './thirdPage.less';

@connect(
    state => state
)
class ThirdPage extends React.Component {
    goBeforePage = () => {
        commonService.pageBack('go', -1);
    }
    render() {
        return (
            <Page name="thirdPage">
                <header onClick={this.goBeforePage}>thirdPage</header>
                <p>3</p>
            </Page>
        );
    }
}

export default ThirdPage;