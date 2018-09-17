import 'mocha';
import { expect } from 'chai';
import * as readline from 'readline';
// If you're trying to import a function or class, you should use this way. 
// (do not : import * as getGMailList from "./getGMailList")
import getGMailList from './getGMailList';
import { isArray } from 'util';


describe('Get Gmail List', () => {
  it('should return gmail list', async () => {
    console.log('get email start!!');

    let read_line = (question:string) =>{
      return new Promise(function(resolve) {
        let rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        })

        rl.question(question, (answer) => {
          if (answer) {
            console.log('Your Input: ', answer);
          }
          rl.close();
          resolve(answer)
        });
      })
    }

    let id = await read_line("What is your Gmail Address?");
    let password = await read_line("What is your Gmail Password?");

    let get_mail = new getGMailList(String(id), String(password));

    let result = await get_mail.getGmail();

    // console.log(result);
    
    expect(result["status"]).to.equal(200);
    expect(isArray(result["mails"])).to.equal(true);

  }).timeout(100000);
});