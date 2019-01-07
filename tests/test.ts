import { input, puppeteer_ready, connect_page, login, move_to_gmail, get_sender, get_mail_titles } from '../jc8n/getMailList';
import { mail, user } from '../jc8n/interfaces'
import { assert } from 'chai';
import { puppeteer } from '../node_modules/puppeteer';
// import { describe } from '../node_modules/ts-mocha'

describe('### Third assignment ###', function () {
    let id_password: user;
    let page: puppeteer.Page;
    
    it('#1 input id and password', async () => {
        id_password = await input();

        assert.isNotNull(id_password);
    }).timeout(100000);

    it('#2 ready for puppeteer', async () => {
        page = await puppeteer_ready();
        
        assert.isNotNull(page);
    })

    it('#3 connect google page', async () => {
        const result = await connect_page(page);
        let result_status;
        if(result !== null) {
            //사이트에 접속 성공시 status메서드가 200을 반환
            result_status = result.status();
        }

        assert.equal(result_status, 200);
    }).timeout(10000)



    it('#4 login', async () => {
        const result = await login(id_password, page);
        console.log(result);
    }).timeout(10000)

    it('#5 move to gmail page', async () => {
        await move_to_gmail(page);
        
    }).timeout(10000)



    
    let senders;
    it('#6 get sender list', async () => {
        senders = await get_sender(page);
        
        assert.isNotNull(senders);
    }).timeout(10000)

    let subjects;
    it('#7 get mail title list', async () => {
        subjects = await get_mail_titles(page);
        
        assert.isNotNull(subjects);
    }).timeout(10000)

    it('#8 output mail list', () => {
        const mails: mail[] = [];

        //메일제목과 보낸사람을 객체배열에 저장
        for (let i = 0; i < subjects.length; i++) {
            mails.push({
                subject: subjects[i],
                sender: senders[i]
            });
        }

        console.log(mails);
    })
})