const app = require('./app');
const chai = require('chai');
const main = app.main;
const expect = chai.expect;

interface output{    //최종 output 인터페이스
    mails: items[];
}
interface items {    //최종 output 인터페이스의 mails 속성에 들어갈 items 인터페이스
   subject: string | null;
   sender: string | null;
}
describe('app.js Test',()=>{
       it('테스트', async function(){
            let result: output = await main();
            expect(result.mails).to.be.not.empty;
            console.log(result);
         });
    });