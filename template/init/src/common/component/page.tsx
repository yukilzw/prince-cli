import React = require('react');

class Page extends React.Component<IReactReadProps, {}> {
    render() {
        const { children, name } = this.props;

        return (
            <div className={`body-wrap ${name || ''}`}>
                <div className="route-shade"></div>
                {
                    React.Children.map(children, child => child)
                }
            </div>
        );
    }
}

export { Page };