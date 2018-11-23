
import { ElementHandle } from "puppeteer";
import * as puppeteer from "puppeteer";
import { input, output, items } from "./interfaces"
import * as readline from "readline";  //사용자의 입력을 받을때 사용하는 모듈


const r = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});




async function getData(In: input): Promise<items[]> { // input(사용자의 id와 비번)을 받아서 promise(items 들이 담긴 배열을 가지고있는)를 반환한다.   
    let mails: items[];           //items의 배열들이 들어갈 변수 mails 선언
    mails = [];                    //변수에 배열 할당

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'); 
    await page.goto('https://accounts.google.com/ServiceLogin/identifier?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=AddSession', { waitUntil: 'domcontentloaded' });
    await page.type('input[type=email]', In.id); // 첫번째 인자(셀렉터) 를찾아 아이디(In.id)를 type 한다.

    await page.click('#identifierNext'); //다음버튼 클릭

    try {
        await page.waitForSelector('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input', {
            timeout: 2000
        });   //2초동안 페이지가넘어가지 않으면 에러발생후  catch문실행 
    } catch (e) {
        console.log("아이디 가 없습니다.");
        browser.close();
    }

    await page.evaluate( //In.pass를 가지고 패스워드입력창에 대입 
        `document.querySelector('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input').value = "${In.password}";`
    );
    await page.evaluate(`document.getElementById("passwordNext").click();`);//로그인 버튼 클릭

    try {         //6.5초동안 다음페이지의셀렉터가 나오지않는다면 에러발생후 catch 문 실행
        await page.waitForSelector('.mb', { timeout: 10000, visible: true });
    } catch (e) {
        console.log("비밀번호가 맞지않습니다.");
        browser.close();
    }
    await page.waitFor(2000);
    let names: Array<ElementHandle> = await page.$$('.yW'); //페이지 내의 셀렉터 .yW 를 모두 찾아 ElementHandle형태로 순서대로 배열에 넣어 반환 
    let subjects: Array<ElementHandle> = await page.$$('.y6');

    for (let index in names) {//names 의길이 만큼 반복문 을 실행한다. index 는 0부터 순서대로 높아진다.
        let data: items;   // items 타입의 data 선언
        data = { subject: '', sender: '' };         //data 변수에 빈객체 선언 
        data.sender = await names[index].$eval('span', element => element.textContent); //1.names배열에서 names[index](ElementHandle) 의 원소를 받아서  2.$eval() 을 실행하면 해당원소에서 span 셀렉터를 찾아 element 에 넣고 element.outerText를 브라우저 콘솔창에서 실행한후 3.나오는 값을 반환하여 빈객체 data.sender에 넣는다.
        data.subject = await subjects[index].$eval('span', element => element.textContent);
        //위와 같은방식
        mails.push(data);
        //mails (items 타입들의 배열) 에 데이터를 넣는다.
    }
    browser.close(); //브라우저 창을 닫는다.
    return mails; //mails (items 타입들의 배열) 을 반환한다.
}





export async function main(): Promise<output> {//사용자의 아이디와 패스워드를 입력받아서 getData() 함수를 호출 하는 main 함수 return값은 promise(output이 담긴)
    let In: input = {
        id: "",
        password: ""
    };
    let output: output = {
        mails: []
    };
    await new Promise((resolve, reject) => {
        r.question("your gmail id: ", function (id: string) {
            In.id = id;
            r.question("password: ", function (password: string) {
                In.password = password;
                r.close();
                resolve();
            })
        })
    })

    // In=await authentication();
    output.mails = await getData(In);
    return output;
}



