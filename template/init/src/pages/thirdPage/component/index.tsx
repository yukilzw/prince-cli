import * as React from 'react';
import { commonService } from '@common/service';
import { Page } from '@common/component/page';
import './thirdPage.less';

const ThirdPage: React.FC<IReactReadProps> = () => {
    const goBeforePage = () => {
        commonService.pageBack('go', -1);
    };

    return <Page name="thirdPage">
        <header onClick={goBeforePage}>thirdPage</header>
        <p>3</p>
    </Page>;
};

export default ThirdPage;