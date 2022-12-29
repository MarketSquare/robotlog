import {FC, useEffect, useRef, useState} from "react";
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
        <pre className={styles.logmessage} dangerouslySetInnerHTML={{__html:message.message}}/>
    </div>
}

interface LogProps<T extends RobotFrameworkResultKeyword | RobotFrameworkResultTest | RobotFrameworkResultSuite> {
    element: T;
    level: number;
    observer: IntersectionObserver | undefined;
    setSelectedElementId: (id:string) => void;
}

const KeywordLog:FC<LogProps<RobotFrameworkResultKeyword>> = ({element, level, observer, setSelectedElementId}):JSX.Element => {
    return <div className={styles.container}>
        <Header level={level} data={element.id} observer={observer}>
            <div className={styles.timestamp}>{element.times.startTime.toISOString()}</div>
            <div className={styles.status}>{element.type}</div>
            <span className={styles.logmessage}
            >
                {element.name} : {element.args}</span>
            <div className={styles.status}>{element.status}</div>
            <div>{element.id}</div>
        </Header>
        {element.keywords.length > 0 && (<div>{element.keywords.map(k => <KeywordLog key={k.id} element={k} level={level+1} observer={observer} setSelectedElementId={setSelectedElementId}/>)}</div>)}
        <div>{element.messages.map((m, i) => <MessageLog key={i} message={m}/>)}</div>
    </div>
}

const TestLog:FC<LogProps<RobotFrameworkResultTest>> = ({element, level, observer, setSelectedElementId}):JSX.Element => {
    return <div className={styles.container}>
        <Header level={level} data={element.id} observer={observer}>
            <div className={styles.timestamp}>{element.times.startTime.toISOString()}</div>
            <div className={styles.status}>TEST</div>
            <span className={styles.logmessage}
            >: {element.name}</span>
            <div className={styles.status}>{element.status}</div>
            <div>{element.id}</div>
        </Header>
        {element.keywords.map(k => <KeywordLog key={k.id} element={k} level={level+1} observer={observer} setSelectedElementId={setSelectedElementId}/>)}
    </div>
}

const Header:FC<{children:JSX.Element[], level: number, data: string, observer:IntersectionObserver | undefined}> = ({children, level, data, observer}):JSX.Element => {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current || !observer) return;
        const target = ref.current;
        observer.observe(target);
        return () => {
            observer.unobserve(target);
        }
    }, [ref, observer])

    return <div ref={ref} className={styles.vertical} data-id={data}>
        {children}
    </div>
}

const SuiteLog:FC<LogProps<RobotFrameworkResultSuite>> = ({element, level, observer, setSelectedElementId}, context):JSX.Element => {
    return <div className={styles.container}>
        <Header level={level} data={element.id} observer={observer}>
            <div className={styles.timestamp}>{element.times.startTime.toISOString()}</div>
            <div className={styles.status}>SUITE</div>
            <span className={styles.logmessage}>{element.name}</span>
            <div className={styles.status}>{element.status}</div>
            <div>{element.id}</div>
        </Header>
        {element.keywords.filter(k => k.type === 'SETUP').map(k => <KeywordLog key={k.id} element={k} level={level+1} observer={observer} setSelectedElementId={setSelectedElementId}/>)}
        {element.tests.map(t => <TestLog key={t.id} element={t} level={level+1} observer={observer} setSelectedElementId={setSelectedElementId}/>)}
        {element.suites.map(s => <SuiteLog key={s.id} element={s} level={level+1} observer={observer}  setSelectedElementId={setSelectedElementId}/>)}
        {element.keywords.filter(k => k.type === 'TEARDOWN').map(k => <KeywordLog key={k.id} element={k} level={level+1} observer={observer} setSelectedElementId={setSelectedElementId}/>)}
    </div>
}

export const RobotLog:FC<{
    suite:RobotFrameworkResultSuite;
    onSelectedElementId?: (id: string) => void;
    elementId?: string
}> = ({suite, onSelectedElementId, elementId }):JSX.Element => {

    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [intersectionObserver, setIntersectionObserver] = useState<IntersectionObserver | undefined>(undefined);

    useEffect(() => {
        const options = {
          root: null,
          rootMargin: '0px',
          threshold: 1.0
        }

        const handleIntersect:IntersectionObserverCallback = (entries) => {
            if (entries.length === 0) return;
            setSelectedElementId(entries[0].target.getAttribute("data-id"));
        }

        setIntersectionObserver(new IntersectionObserver(handleIntersect, options));
    }, [])

    useEffect(() => {
        if (!elementId) return;
        const elems = document.querySelectorAll(`[data-id='${elementId}']`);
        if (elems.length < 2) return;
        const e = elems[1];
        e.scrollIntoView();
    }, [elementId])

    useEffect(() => {
        if (!selectedElementId || !onSelectedElementId) return;
        onSelectedElementId(selectedElementId)
    }, [selectedElementId])

    return <div className={styles.robotlog} data-root="root">
        <div className={styles.header}>{selectedElementId}</div>
        <SuiteLog element={suite}
                  level={0}
                  observer={intersectionObserver}
                  setSelectedElementId={setSelectedElementId}/>
    </div>
}