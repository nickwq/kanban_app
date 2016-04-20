import React from 'react';
import  {
    renderIntoDocument,
    findRenderedDOMComponentWithClass,
    findRenderedDOMComponentWithTag,
    Simulate
} from 'react-addons-test-utils';
import assert from 'assert';
import Editable from '../app/components/Editable.jsx'

describe('Editable', () => {
    it('renders value', () => {
        const value = 'value';
        const component = renderIntoDocument(
            <Editable value={value}/>
        );

        const valueComponent = findRenderedDOMComponentWithClass(component, 'value');
        assert.equal(valueComponent.textContent, value)
    });

    it('triggers onValueClick', () => {
        let triggered = false;
        const value = 'value';
        const onValueClick = () =>  { triggered = true;};
        const component = renderIntoDocument(
            <Editable value={value} onValueClick={onValueClick}/>
        );

        const valueComponent = findRenderedDOMComponentWithClass(component, 'value');
        Simulate.click(valueComponent);

        assert.equal(triggered, true)

    });
});