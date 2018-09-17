// import * as bluebird from 'bluebird';
import * as puppeteer from 'puppeteer';
// import * as bluebird from 'bluebird';
import inputInterface from "./inputInterface";
import outputInterface from "./outputInterface";

export default class getGMailList implements inputInterface, outputInterface {
  // input 인터페이스의 ID 와 password
  readonly id: string;
  readonly password: string;
  // output 인터페이스의 
  subject: string; // subject(메일 제목) 과 sender(보낸이) 로 세팅할 class
  sender: string; // 그 class 를 담는 배열
  // global page
  browser: puppeteer.Browser;
  page: puppeteer.Page;

  constructor(id:string, password:string) {
    this.id = id;
    this.password = password;
  }

  // Browser Engine Start
  async pageOn() {
    // * 중요 : 이 함수 안에 Promise 또는 callback 이 존재한다면, 노드의 쓰레드는 해당 pageOn() 함수에 프로세스를 하나 주고 기다리지 않고 다음 로직을 돌린다. (아래의 1번 로직을 돌리고, 기다리지 않고 2번을 돌림.)
    // 하지만, 위 두 가지(Promsie OR callback)가 해당 함수 안에 존재하지 않는다면 쓰레드는 그 함수로 들어가 로직들을 전부 돌리고 다음 로직을 실행한다. (아래의 1번 로직을 다 돌리고 2번을 돌림)
    // Promise 또는 callback이 존재하는 1번같은 함수를 후자로 돌리기 위해서는(1번 다 돌리고 2번을 돌리는 것 - 순차적으로), pageOn() 함수앞에 await을 걸어줘야 하며, 이 await을 걸게되면 pageOn() 함수는 프로미스로 감싸지게 되고 자연스레 해당 함수의 내부 로직이 전부 완료되어 resolve 상태가 될 때 까지 기다리게 된다.
    // 다만, pageOn() 함수 안에, 프로미스가 존재하지 않을 경우 await을 걸어도 아무런 동작을 하지 않는다 (의미없는 구문).
    this.browser = await puppeteer.launch({headless:false});
    this.page = await this.browser.newPage();
  }

  async getGmail() {
    // * 중요 : 이 함수 안에 Promise 또는 callback 이 존재한다면, 노드의 쓰레드는 해당 pageOn() 함수에 프로세스를 하나 주고 기다리지 않고 다음 로직을 돌린다. (아래의 1번 로직을 돌리고, 기다리지 않고 2번을 돌림.)
    // 하지만, 위 두 가지(Promsie OR callback)가 해당 함수 안에 존재하지 않는다면 쓰레드는 그 함수로 들어가 로직들을 전부 돌리고 다음 로직을 실행한다. (아래의 1번 로직을 다 돌리고 2번을 돌림)
    // Promise 또는 callback이 존재하는 1번같은 함수를 후자로 돌리기 위해서는(1번 다 돌리고 2번을 돌리는 것 - 순차적으로), pageOn() 함수앞에 await을 걸어줘야 하며, 이 await을 걸게되면 pageOn() 함수는 프로미스로 감싸지게 되고 자연스레 해당 함수의 내부 로직이 전부 완료되어 resolve 상태가 될 때 까지 기다리게 된다.
    // 다만, pageOn() 함수 안에, 프로미스가 존재하지 않을 경우 await을 걸어도 아무런 동작을 하지 않는다 (의미없는 구문).
    await this.pageOn(); // 1번 로직
    const page = this.page; // 2번 로직

    await this.login(page);

    // 이메일 가져오기 함수 실행
    let email_list = await this.getEmailList(page);

    // 가져온 메일을 가지고 output에 맞게 filtering 하여 내보낸다.
    let mails = await this.outputFiltering(email_list);
    // console.log(mails, 'hihi');
    
    let result = {};
    
    console.log(mails);
    
    if (mails.length > 0) {
      result = {
        "status" : 200,
        "mails" : mails
      };
    }
    
    await this.page.close(); // 페이지 종료...
    await this.browser.close();
    return result;
  }
  
  async login(page) {
    // 로그인 페이지로 이동
    await page.goto('https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail&sacu=1&rip=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin');

    // ID 입력
    await page.type("#identifierId", this.id);
    
    // "다음" 버튼 클릭
    await page.click("#identifierNext > div.ZFr60d.CeoRYc");
    
    // 비밀번호 입력창 기다림...
    await page.waitForSelector("#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input");

    // 비밀번호 입력
    await page.evaluate(`document.querySelector("input[name=password]").value = "${this.password}";`);

    // "다음" 버튼 클릭
    await page.evaluate(`document.getElementById("passwordNext").click();`);

    // 검색창으로 로딩을 기다림
    await page.waitForSelector("#aso_search_form_anchor > div > input");
    
    // 메일 리스트가 뜨길 기다린다, 셀렉터 클래스들이 계속 변경되는 관계로 waitforselector로 검출이 불가능함...
    // for (let i = 1; i < 11; i++) {
    //   let wait_time = i * 100;
    //   let is_exist_class = await page.evaluate(() => {
    //     let length = 0;
    //     if (document.getElementsByClassName('F cf zt')) {
    //       length = document.getElementsByClassName('F cf zt').length;  
    //     }
    //     return length;
    //   });

    //   console.log(is_exist_class);
      
    //   // 검출...
    //   if (is_exist_class > 0) {
    //     break;
    //   }

    //   await bluebird.delay(wait_time);
    // }
    
    
    // 로그인 완료!
  }

  async getEmailList(page) {
    // return 구문이 puppeteer evaluate 의 template literals 안에서 구문에러를 발생시키기 때문에
    // 임의로 함수를 만들어 puppeteer browser engine에다 주입한다.
    function returnMailArrayFn(items){
      return items
    }

    await page.exposeFunction("returnMailArrayFn", returnMailArrayFn); // 주입
    
    // selector로 가지고오면 계속 특정 class 명 등등을 변경해서 그냥 처음에는 ID로 가져온다.
    const email_list:any = await page.evaluate(`
      let mail_array = [];
      
      // get email rows
      let tbody = document.getElementsByClassName("F cf zt")[0].getElementsByTagName("tbody")[0].rows;

      // sender의 위치는?
      // => document.getElementsByClassName("F cf zt")[0].getElementsByTagName("tbody")[0].rows[0].children[4].children[1].children[0].textContent
      // subject의 위치는?
      // => document.getElementsByClassName("F cf zt")[0].getElementsByTagName("tbody")[0].rows[0].children[5].children[0].children[0].children[0].children[0].children[0].textContent;

      for(let tr of tbody) {
        let sender = tr.children[4].children[1].children[0].textContent; // 메일 보낸이
        let subject = tr.children[5].children[0].children[0].children[0].children[0].children[0].textContent; // 메일 제목

        // sender & subject setting to json
        let mail_json = {
          [sender] : subject
        }; 
        mail_array.push(mail_json); // 리턴 할 mail array에 담는다.
      }

      // my exposeFunction execute...
      returnMailArrayFn(mail_array);
    `);
    
    return email_list
  }

  // 이미 메일을 sender 와 subject 형태로 추출하여 이 함수는 실행하지 않고, 바로 email list를 return 해도 되지만,
  // 과제에서 요구하는 output 형태에 맞게 interface를 사용해야 하기 때문에 필터링을 진행
  async outputFiltering(email_list) {
    let mails:Array<any> = [];

    for (const email of email_list) {
      let key = Object.keys(email)[0];
      let subject_value = email[key];
      
      let mail_info = {
        "subject" : subject_value,
        "sender" : key
      }
      mails.push(mail_info);
    }

    return mails
  }

}