import * as React from 'react';

const Page: React.FC<IReactReadProps> = ({ children, name }) => <div className={`body-wrap ${name || ''}`}>
    <div className="route-shade"></div>
    {
        React.Children.map(children, child => child)
    }
</div>;

export { Page };