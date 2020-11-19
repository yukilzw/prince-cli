import * as React from 'react';
import { Page } from '@common/component/page';
import './thirdPage.less';

const ThirdPage: React.FC<IReactReadProps> = ({ history }) => {
    const goBeforePage = () => {
        history.go(-1);
    };

    return <Page name="thirdPage">
        <header onClick={goBeforePage}>thirdPage</header>
        <p>3</p>
    </Page>;
};

export default ThirdPage;