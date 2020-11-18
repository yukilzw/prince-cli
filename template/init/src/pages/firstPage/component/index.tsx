import * as React from 'react';
import { useState, useEffect } from 'react';
import { firstPageService } from '../service/firstPageService';
import { commonService } from '@common/service';
import { Page } from '@common/component/page';
import './firstPage.less';

const FirstPage: React.FC<IReactReadProps> = () => {
    const [num, setNum] = useState<number>(10);

    const subscribeData = (data) => {
        setNum(num + 1);
    };

    useEffect(() => {
        firstPageService.request();
        commonService.ws.subscribe('lzw', subscribeData, this);

        return () => {
            commonService.ws.unSubscribe('lzw', subscribeData, this);
        };
    }, []);

    const goNextPage = () => {
        commonService.pageJump('push', {
            pathname: '/secondPage'
        });

        commonService.ws.send({ data: 0 });
    };

    return (
        <Page name="firstPage">
            <header>firstPage</header>
            <p>{num}</p>
            <a onClick={goNextPage}>NEXT</a>
        </Page>
    );
};

export default FirstPage;