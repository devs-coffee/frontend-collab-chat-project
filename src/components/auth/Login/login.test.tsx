import Login from './Login';
import {render} from '@testing-library/react';

describe('Login', () => {
    test('Should render without crash', async () => {
        render(<Login />)
    })
})