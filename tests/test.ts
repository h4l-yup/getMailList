import { input, puppeteer_ready, connect_page, login, move_to_gmail, get_sender, get_mail_titles } from '../jc8n/getMailList';
import { mail } from '../jc8n/interfaces'
import { assert } from 'chai';


describe('### Third assignment ###', function () {
    let id_password: object;
    let page: object;
    it('#1 input id and password', async () => {
        id_password = await input();

        assert.isNotNull(id_password);
    }).timeout(100000);

    it('#2 ready for puppeteer', async () => {
        page = await puppeteer_ready();
        //console.log(page)
    })

    it('#3 connect google page', async () => {
        page = await connect_page(page);
        //console.log(page);
    })

    it('#4 login', async () => {
        page = await login(id_password, page);
        //console.log(page);
    }).timeout(100000)

    it('#5 move to gmail page', async () => {
        page = await move_to_gmail(page);
        //console.log(page);
    }).timeout(100000)

    let senders;
    it('#6 get sender list', async () => {
        senders = await get_sender(page);
        // console.log(senders);
    }).timeout(100000)

    let subjects;
    it('#7 get mail title list', async () => {
        subjects = await get_mail_titles(page);
        // console.log(subjects); 
    }).timeout(100000)

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