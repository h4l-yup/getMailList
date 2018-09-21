import { main } from './app';
import * as chai from 'chai';
import {output} from './interfaces';
const expect = chai.expect;

describe('app.js Test',()=>{
       it('테스트', async function(){
            let result: output = await main();
            expect(result.mails).to.be.not.empty;
            console.log(result);
         });
    });