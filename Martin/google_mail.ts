// ~/Martin $ ts-mocha ../test/google_mail.spec.ts [GOOGLE_ID] [GOOGLE_PW]

import * as puppeteer from 'puppeteer';
import { account, mail } from './interfaces';
import * as _ from 'lodash';

let gmails: mail[];

export async function get_browser(): Promise<puppeteer.Browser>{
    try {
        return await puppeteer.launch({headless:true});
    } catch (error) {
        throw '브라우저 실행 실패';
    }
}

export async function get_page(browser: puppeteer.Browser): Promise<puppeteer.Page>{
    try {
        return await browser.newPage();
    } catch (error) {
        throw '새페이지 실패';
    }
}

export async function google_login(user : account, page: puppeteer.Page): Promise<void>{
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.goto('https://accounts.google.com/ServiceLogin/identifier?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=AddSession');
    await page.type('#identifierId', user.id);
    await page.click('#identifierNext > content');
    try {
        await page.waitForNavigation({waitUntil:"networkidle0", timeout:2000});
    } catch (error) {
        throw '아이디 없음';
    }
    await page.type('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input', user.password);
    await page.click('#passwordNext > div.ZFr60d.CeoRYc');
    try {
        await page.waitForSelector('span.bog>span',{visible:true, timeout:5000});
    } catch (error) {
        throw '비밀번호 틀림';
    }
}

export async function get_mail_list(page: puppeteer.Page): Promise<void> {
    const subject = await page.$$('span.bog>span');
    const subject_texts = await Promise.all(
        subject.map(value => selectors_text(value))
    );
    const sender = await page.$$('span.yP');
    const sender_texts = await Promise.all(
        sender.map(value => selectors_text(value))
    );
    const all_promises = _.union(subject.map(value => selectors_text(value)),sender.map(value => selectors_text(value)));
    const subject_and_sender_texts = await Promise.all(all_promises);
    if(subject.length === 0 || sender.length === 0){
        throw '이메일 로드 실패';
    }

    // const length = subject_and_sender_texts.length/2;
    // const subject_texts = subject_and_sender_texts.slice(0, length);
    // const sender_texts = subject_and_sender_texts.slice(length);
    const mails = subject_texts.map((subject_text, index) => set_mail(subject_text, sender_texts[index]));
    
    gmails = mails;
}

export function get_gmails() : mail[]{
    return gmails;
}

async function selectors_text(selector : puppeteer.ElementHandle<Element>): Promise<any>{
    const valuehandle = await selector.getProperty('innerText');
    return valuehandle.jsonValue();
}

function set_mail(subject_value: string, sender_value: string): mail{ 
    return {subject:subject_value, sender:sender_value};
}

export async function close_browser(browser : puppeteer.Browser): Promise<void>{
    try {
        await browser.close();
    } catch (error) {
        throw '브라우저 닫기 실패';
    }
}