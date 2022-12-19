import {FC} from "react";
import {
    RobotFrameworkResultKeyword,
    RobotFrameworkResultMessage,
    RobotFrameworkResultSuite,
    RobotFrameworkResultTest
} from "./Suite";

const MessageLog:FC<{message:RobotFrameworkResultMessage}> = ({message}):JSX.Element => {
    return <div>
        <span>{message.message}</span>
        <div>{message.level}</div>
        <div>{message.timestamp.toISOString()}</div>
    </div>
}

const KeywordLog:FC<{keyword:RobotFrameworkResultKeyword}> = ({keyword}):JSX.Element => {
    return <div>
        <label>{keyword.name}</label>
        {keyword.keywords.length > 0 && (<div>{keyword.keywords.map(k => <KeywordLog key={k.id} keyword={k}/>)}</div>)}
        <div>{keyword.messages.map((m, i) => <MessageLog key={i} message={m}/>)}</div>
    </div>
}

const TestLog:FC<{test:RobotFrameworkResultTest}> = ({test}):JSX.Element => {
    return <div>
        <label>{test.name}</label>
        <div>{test.keywords.map(k => <KeywordLog key={k.id} keyword={k}/>)}</div>
    </div>
}

export const RobotLog:FC<{suite:RobotFrameworkResultSuite}> = ({suite}):JSX.Element => {
    return <div>
        <label>{suite.name}</label>
        <div>{suite.keywords.map(k => <KeywordLog key={k.id} keyword={k}/>)}</div>
        <div>{suite.tests.map(t => <TestLog key={t.id} test={t}/>)}</div>
        <div>{suite.suites.map(s => <RobotLog key={s.id} suite={s}/>)}</div>
    </div>
}