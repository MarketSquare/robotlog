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

const KeywordLog:FC<{keyword:RobotFrameworkResultKeyword, level:number}> = ({keyword, level}):JSX.Element => {
    return <div className={styles.container}>
        <div className={`${styles.vertical} ${styles.sticker}`}
        style={{top: 19*level, zIndex: 1000 - 100*level}}
        >
            <div className={styles.timestamp}>{keyword.times.startTime.toISOString()}</div>
            <div className={styles.status}>{keyword.type}</div>
            <span className={styles.logmessage}
            >
                {keyword.name} : {keyword.args}</span>
            <div className={styles.status}>{keyword.status}</div>
        </div>
        {keyword.keywords.length > 0 && (<div>{keyword.keywords.map(k => <KeywordLog key={k.id} keyword={k} level={level+1}/>)}</div>)}
        <div>{keyword.messages.map((m, i) => <MessageLog key={i} message={m}/>)}</div>
    </div>
}

const TestLog:FC<{test:RobotFrameworkResultTest, level:number}> = ({test, level}):JSX.Element => {
    return <div className={styles.container}>
        <div className={`${styles.vertical} ${styles.sticker}`}
        style={{top: 19*level, zIndex: 1000 - 100*level}}
        >
            <div className={styles.timestamp}>{test.times.startTime.toISOString()}</div>
            <div className={styles.status}>TEST</div>
            <span className={styles.logmessage}
            >: {test.name}</span>
            <div className={styles.status}>{test.status}</div>
        </div>
        <div>{test.keywords.map(k => <KeywordLog key={k.id} keyword={k} level={level+1}/>)}</div>
    </div>
}

export const RobotLog:FC<{suite:RobotFrameworkResultSuite, level?:number}> = ({suite, level=0}):JSX.Element => {
    return <div className={styles.container}>
        <div className={`${styles.vertical} ${styles.sticker}`}
        style={{top: 19*level, zIndex: 1000 - 100*level}}
        >
            <div className={styles.timestamp}>{suite.times.startTime.toISOString()}</div>
            <div className={styles.status}>SUITE</div>
            <span className={styles.logmessage}>{suite.name}</span>
            <div className={styles.status}>{suite.status}</div>
        </div>
        <div>{suite.keywords.filter(k => k.type === 'SETUP').map(k => <KeywordLog key={k.id} keyword={k} level={level+1}/>)}</div>
        <div>{suite.tests.map(t => <TestLog key={t.id} test={t} level={level+1}/>)}</div>
        <div>{suite.suites.map(s => <RobotLog key={s.id} suite={s} level={level+1}/>)}</div>
        <div>{suite.keywords.filter(k => k.type === 'TEARDOWN').map(k => <KeywordLog key={k.id} keyword={k} level={level+1}/>)}</div>
    </div>
}