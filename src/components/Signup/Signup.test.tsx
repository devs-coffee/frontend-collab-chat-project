import Signup from './Signup';
//import '@testing-library/react/dont-cleanup-after-each.js';
import { render } from '@testing-library/react';



describe('Signup', () => {
    test('Should render without crash', async () => {
        render(<Signup />)
        
    })
    
})