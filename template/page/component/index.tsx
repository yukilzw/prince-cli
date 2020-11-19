import * as React from 'react';
import { connect } from 'react-redux';
import { Page } from '@common/component/page';
import './index.less';

const {{PN}}: React.FC<IReactReadProps> = () => {
    return (
        <Page name="{{PN}}">
            <header>{{PN}}</header>
        </Page>
    );
};

export default {{PN}};