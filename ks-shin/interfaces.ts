interface input {    //사용자의 아이디와 패스워드 구조체 인터페이스
    id: string;
    password: string;
}
interface output {    //최종 output 인터페이스
    mails: items[];
}
interface items {    //최종 output 인터페이스의 mails 속성에 들어갈 items 인터페이스
    subject: string | null;
    sender: string | null;
}

export {input, output, items};