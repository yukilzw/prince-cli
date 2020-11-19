import * as React from 'react';
import { connect } from 'react-redux';
import { secondPageService } from '../service/secondPageService';
import { Page } from '@common/component/page';
import './secondPage.less';

const SecondPage: React.FC<IReactReadProps> = ({ count, history }) => {
    const goNextPage = () => {
        history.push({
            pathname: '/thirdPage'
        });
    };
    const goBeforePage = () => {
        history.go(-1);
    };
    const minus = () => {
        secondPageService.minus();
    };
    const add = () => {
        secondPageService.add();
    };

    return (
        <Page name="secondPage">
            <header onClick={goBeforePage}>secondPage</header>
            <p>{count}</p>
            <ul>
                <li onClick={minus}>-</li>
                <li onClick={add}>+</li>
            </ul>
            <a onClick={goNextPage}>NEXT</a>
        </Page>
    );
};

const getFromState = state => ({
    count: state.count
});

export default connect(getFromState)(SecondPage);