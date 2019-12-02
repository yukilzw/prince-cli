/*eslint-disable*/
import countReducer from '../reducers/countReducer';
import countAction, { COUNT_ADD, COUNT_MINUS } from '../actions/countAction';

test('count reducers', () => {
    expect(
        countReducer.count(3, { type: COUNT_ADD })
    ).toBe(4);

    expect(
        countReducer.count(6, { type: COUNT_MINUS })
    ).toBe(5);
});

test('count actions', () => {
    const actionMode = {
        type: expect.stringMatching(/.+/)
    };

    expect(countAction.add()).toMatchObject(actionMode);
    expect(countAction.minus()).toMatchObject(actionMode);
});
