import * as puppeteer from 'puppeteer';
import inputInterface from "./inputInterface";
import outputInterface from "./outputInterface";
export default class getGMailList implements inputInterface, outputInterface {
    readonly id: string;
    readonly password: string;
    subject: string;
    sender: string;
    browser: puppeteer.Browser;
    page: puppeteer.Page;
    constructor(id: string, password: string);
    pageOn(): Promise<void>;
    getGmail(): Promise<{}>;
    login(page: any): Promise<void>;
    getEmailList(page: any): Promise<any>;
    outputFiltering(email_list: any): Promise<any[]>;
}
