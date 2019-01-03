import * as puppeteer from 'puppeteer';
import * as prompt from 'async-prompt';
import { user } from './interfaces';


//이메일, 비밀번호 입력받는 함수
export const input = async () => {
  const id_password: user = {
    email: '',
    password: ''
  };

  id_password.email = await prompt('email : ');
  id_password.password = await prompt.password('password : ');

  return id_password;
}

//###1 puppeteer 준비
export const puppeteer_ready = async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  //화면크기 지정
  await page.setViewport({ width: 1280, height: 800 })

  return page;
}

//###2 구글 페이지 이동
export const connect_page = async (page) => {
  await page.goto('https://www.google.com/')

  return page;
}

//###3 아이디 비밀번호 입력 후 로그인
export const login = async (id_password, page) => {
  //로그인버튼 클릭
  await page.waitForSelector('#gb_70')
  await page.click('#gb_70')

  //await navigationPromise
  //메일주소 입력 후 다음버튼 클릭
  await page.waitForSelector('input[type="email"]')
  await page.type('input[type="email"]', id_password.email)
  await page.click('#identifierNext')

  //비밀번호 입력 후 다음버튼 클릭
  await page.waitForSelector('input[type="password"]', { visible: true })
  await page.type('input[type="password"]', id_password.password)
  await page.click('#passwordNext')

  return page;
}

//###4 gmail버튼 클릭
export const move_to_gmail = async (page) => {
  await page.waitForSelector('#gbw > div > div > div.gb_Je.gb_R.gb_fh.gb_6g > div:nth-child(1) > a', { visible: true })
  await page.click('#gbw > div > div > div.gb_Je.gb_R.gb_fh.gb_6g > div:nth-child(1) > a')

  return page;
}


//###5 보낸사람 추출
export const get_sender = async (page) => {
  await page.waitForSelector('tbody tr .yW .bA4 span');
  const senders = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('tbody tr .yW .bA4 span'));
    return anchors.map(anchor => anchor.textContent);
  });

  return senders;
}

//###6 메일제목 추출
export const get_mail_titles = async (page) => {
   await page.waitForSelector('tbody tr .bog span');
   const mail_titles = await page.evaluate(() => {
     const anchors = Array.from(document.querySelectorAll('tbody tr .bog span'));
     return anchors.map(anchor => anchor.textContent);
   });

   return mail_titles;
}

/* export async function getMailList() {
  const id_password = await input();

  let page = await puppeteer_ready();
  page = await connect_page(page);
  page = await login(id_password, page);
  page = await move_to_gmail(page);
  const senders: string[] = await get_sender(page);
  const subjects: string[] = await get_mail_titles(page);
  
  const mail_informations: mail[] = [];

  //메일제목과 보낸사람을 객체배열에 저장
  for (let i = 0; i < subjects.length; i++) {
    mail_informations.push({
      subject: subjects[i],
      sender: senders[i]
    });
  }

  console.log(mail_informations);
} */

//getMailList();