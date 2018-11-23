import { main } from './app';
import * as chai from 'chai';
import {output} from './interfaces';



describe('app.js Test',()=>{
       it('테스트', async function(){
            let result: output = await main();
            chai.expect(result.mails).to.be.not.empty;
            console.log(result);
         });
    });