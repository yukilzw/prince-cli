import React = require('react');
import { connect } from 'react-redux';
import { Page } from '@common/component/page';
import './secondPage.less';

@connect(
    state => state
)
class {{PN}} extends React.Component<IReactReadProps> {
    render() {
        return (
            <Page name="{{PN}}">
                <header>{{PN}}</header>
            </Page>
        );
    }
}

export default {{PN}};