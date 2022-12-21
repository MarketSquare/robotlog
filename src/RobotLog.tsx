import {FC} from "react";
import {
    RobotFrameworkResultKeyword,
    RobotFrameworkResultMessage,
    RobotFrameworkResultSuite,
    RobotFrameworkResultTest
} from "./Suite";
import styles from './RobotLog.module.css';

const MessageLog:FC<{message:RobotFrameworkResultMessage}> = ({message}):JSX.Element => {
    return <div className={styles.vertical}>
        <div className={styles.timestamp}>{message.timestamp.toISOString()}</div>
        <div className={styles.status}>{message.level}</div>
        <pre className={styles.logmessage}>{message.message}</pre>
    </div>
}

const KeywordLog:FC<{keyword:RobotFrameworkResultKeyword}> = ({keyword}):JSX.Element => {
    return <div className={styles.container}>
        <div className={`${styles.vertical} ${styles.keywordheader}`}>
            <div className={styles.timestamp}>{keyword.times.startTime.toISOString()}</div>
            <div className={styles.status}>{keyword.status}</div>
            <span className={styles.logmessage}>{keyword.type}: {keyword.name} : {keyword.args}</span>
        </div>
        {keyword.keywords.length > 0 && (<div>{keyword.keywords.map(k => <KeywordLog key={k.id} keyword={k}/>)}</div>)}
        <div>{keyword.messages.map((m, i) => <MessageLog key={i} message={m}/>)}</div>
    </div>
}

const TestLog:FC<{test:RobotFrameworkResultTest}> = ({test}):JSX.Element => {
    return <div className={styles.container}>
        <div className={`${styles.vertical} ${styles.testheader}`}>
            <div className={styles.timestamp}>{test.times.startTime.toISOString()}</div>
            <div className={styles.status}>{test.status}</div>
            <span className={styles.logmessage}>TEST: {test.name}</span>
        </div>
        <div>{test.keywords.map(k => <KeywordLog key={k.id} keyword={k}/>)}</div>
    </div>
}

export const RobotLog:FC<{suite:RobotFrameworkResultSuite}> = ({suite}):JSX.Element => {
    return <div className={styles.container}>
        <div className={`${styles.vertical} ${styles.suiteheader}`}>
            <div className={styles.timestamp}>{suite.times.startTime.toISOString()}</div>
            <div className={styles.status}>{suite.status}</div>
            <span className={styles.logmessage}>SUITE: {suite.name}</span>
        </div>
        <div>{suite.keywords.filter(k => k.type === 'SETUP').map(k => <KeywordLog key={k.id} keyword={k}/>)}</div>
        <div>{suite.tests.map(t => <TestLog key={t.id} test={t}/>)}</div>
        <div>{suite.suites.map(s => <RobotLog key={s.id} suite={s}/>)}</div>
        <div>{suite.keywords.filter(k => k.type === 'TEARDOWN').map(k => <KeywordLog key={k.id} keyword={k}/>)}</div>
    </div>
}