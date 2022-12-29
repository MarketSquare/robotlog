import {inflate} from "pako";

interface StringStore {
    get: (id: number) => string;
}

const STATUSES = ['FAIL', 'PASS', 'SKIP', 'NOT RUN'] as const;
type STATUS = typeof STATUSES[number];

const KEYWORD_TYPES = ['KEYWORD', 'SETUP', 'TEARDOWN', 'FOR', 'ITERATION', 'IF', 'ELSE IF', 'ELSE', 'RETURN',
                         'TRY', 'EXCEPT', 'FINALLY', 'WHILE', 'CONTINUE', 'BREAK'] as const;
type KEYWORD_TYPE = typeof KEYWORD_TYPES[number];

const MESSAGE_LEVELS = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FAIL', 'SKIP'] as const;
type MESSAGE_LEVEL = typeof MESSAGE_LEVELS[number];

const stringStore = (strings: string[]): StringStore => {

    const extract = (text: string): string => {
        const decoded = Uint8Array.from(atob(text), c => c.charCodeAt(0));
        return new TextDecoder().decode(inflate(decoded));
    }

    return {
        get: (id: number): string => {
            const text = strings[id];
            if (!text)
                return '';
            if (text[0] === '*')
                return text.substring(1);
            const extracted = extract(text);
            strings[id] = '*' + extracted;
            return extracted;
        }
    }
}

export type RawSuite = readonly [number, number, number, number, number[], RawStatus, RawSuite[], RawTest[], RawKeyword[], RawSuiteStats];
type RawStatus = [number, number, number] | [number, number, number, number];
type RawSuiteStats = [number, number, number, number];

type RawMessage = [number, number, number];
type RawKeyword = [number, number, number, number, number, number, number, number, RawStatus, (RawKeyword | RawMessage)[]];
type RawTest = [number, number, number, number[], RawStatus, RawKeyword[]];

interface Times {
    startTime: Date;
    endTime: Date;
    elapsedMillis: number;
}

const parseStatus = (stats: RawStatus):STATUS => {
    return STATUSES[stats[0]];
}

const timestamp = (millis: number, baseMillis: number): Date => {
    return new Date(millis + baseMillis);
}

const times = (stats: RawStatus, baseMillis: number): Times => {
    const startMillis = stats[1];
    const elapsedMillis = stats[2];
    return {
        startTime: timestamp(startMillis, baseMillis),
        endTime: timestamp(startMillis + elapsedMillis, baseMillis),
        elapsedMillis,
    };
}

interface SuiteStatuses {
    total: number;
    pass: number;
    fail: number;
    skip: number;
}

const suiteStats = (stats: RawSuiteStats): SuiteStatuses => {
    return {
        total: stats[0],
        pass: stats[1],
        fail: stats[2],
        skip: stats[3]
    };
}

const parseMetadata = (data: number[], strings: StringStore): [string, string][] => {
    let metadata: [string, string][] = [];
    for (let i=0; i<data.length; i+=2) {
        metadata.push([strings.get(data[i]) as string, strings.get(data[i+1]) as string]);
    }
    return metadata;
}

export interface RobotFrameworkResultSuite {
    id: string;
    name: string;
    source: string;
    relativeSource: string;
    doc: string;
    status: STATUS;
    message: string;
    times: Times;
    statistics: SuiteStatuses;
    metadata: [string, string][];
    keywords: RobotFrameworkResultKeyword[];
    tests: RobotFrameworkResultTest[];
    suites: RobotFrameworkResultSuite[];
    find: (selectedElementId: string) => RobotFrameworkResultSuite | RobotFrameworkResultTest | RobotFrameworkResultKeyword;
}

export interface RobotFrameworkResultTest {
    id: string;
    name: string;
    doc: string;
    timeout: string;
    status: STATUS;
    message: string;
    times: Times;
    tags: string[];
    keywords: RobotFrameworkResultKeyword[];
    find: (selectedElementId: string) => RobotFrameworkResultSuite | RobotFrameworkResultTest | RobotFrameworkResultKeyword;
}

export interface RobotFrameworkResultKeyword {
    type: KEYWORD_TYPE;
    id: string;
    name: string;
    libname: string;
    timeout: string;
    args: string;
    assign: string;
    tags: string;
    doc: string;
    status: STATUS;
    times: Times;
    keywords: RobotFrameworkResultKeyword[];
    messages: RobotFrameworkResultMessage[];
    find: (selectedElementId: string) => RobotFrameworkResultSuite | RobotFrameworkResultTest | RobotFrameworkResultKeyword;
}

export interface RobotFrameworkResultMessage {
    level: MESSAGE_LEVEL;
    timestamp: Date;
    message: string;
    link?: string;
}

const createSuite = (parent: RobotFrameworkResultSuite | undefined, element: RawSuite, strings: StringStore, index: number, baseMillis: number, elementsById?: {[id: string]: RobotFrameworkResultSuite | RobotFrameworkResultTest | RobotFrameworkResultKeyword}): RobotFrameworkResultSuite => {
    const status = element[5];
    const elementsByIdDict = elementsById ?? {};
    const suite: RobotFrameworkResultSuite = {
        id: ( parent ? parent.id + '-' : '' ) + 's' + ((index || 0) + 1),
        name: strings.get(element[0]),
        source: strings.get(element[1]),
        relativeSource: strings.get(element[2]),
        doc: strings.get(element[3]),
        status: parseStatus(status),
        message: status.length === 4 ? strings.get(status[3]) : '',
        times: times(status, baseMillis || 0),
        statistics: suiteStats(element[9]),
        metadata: parseMetadata(element[4], strings),
        keywords: [],
        tests: [],
        suites: [],
        find: (id: string) => {
            return elementsByIdDict[id];
        }
    }
    elementsByIdDict[suite.id] = suite;
    suite.keywords = element[8].map((rawKeyword, index) => createKeyword(suite, rawKeyword, strings, index, baseMillis, elementsByIdDict));
    suite.tests =  element[7].map((rawTest, index) => createTest(suite, rawTest, strings, index, baseMillis, elementsByIdDict));
    suite.suites = element[6].map((rawSuite, index) => createSuite(suite, rawSuite, strings, index, baseMillis, elementsByIdDict));
    return suite;
}

const createTest = (parent: RobotFrameworkResultSuite, element: RawTest, strings: StringStore, index: number, baseMillis: number, elementsById: {[id: string]: RobotFrameworkResultSuite | RobotFrameworkResultTest | RobotFrameworkResultKeyword}): RobotFrameworkResultTest => {
    const status = element[4];
    const test: RobotFrameworkResultTest = {
        id: parent.id + '-t' + (index + 1),
        name: strings.get(element[0]),
        doc: strings.get(element[2]),
        timeout: strings.get(element[1]),
        status: parseStatus(status),
        message: status.length === 4 ? strings.get(status[3]) : '',
        times: times(status, baseMillis),
        tags: element[3].map(strings.get),
        keywords: [],
        find: (id: string) => {
            return elementsById[id];
        }
    };
    elementsById[test.id] = test;
    test.keywords = element[5].map((rawKeyword, index) => createKeyword(test, rawKeyword, strings, index, baseMillis, elementsById));
    return test;
}

const createKeyword = (parent: RobotFrameworkResultSuite | RobotFrameworkResultTest | RobotFrameworkResultKeyword, element: RawKeyword, strings: StringStore, index: number, baseMillis: number, elementsById: {[id: string]: RobotFrameworkResultSuite | RobotFrameworkResultTest | RobotFrameworkResultKeyword}): RobotFrameworkResultKeyword => {
    const kw: RobotFrameworkResultKeyword = {
        type: KEYWORD_TYPES[element[0]],
        id: parent.id + '-k' + (index + 1),
        name: strings.get(element[1]),
        libname: strings.get(element[2]),
        timeout: strings.get(element[3]),
        args: strings.get(element[5]),
        assign: strings.get(element[6]),
        tags: strings.get(element[7]),
        doc: strings.get(element[4]),
        status: parseStatus(element[8]),
        times: times(element[8], baseMillis),
        keywords: [],
        messages: [],
        find: (id: string) => {
            return elementsById[id];
        }
    };
    elementsById[kw.id] = kw;
    kw.messages = (element[9].filter(r => r.length === 3) as RawMessage[]).map(rawMessage => createMessage(rawMessage, strings, baseMillis));
    kw.keywords = (element[9].filter(r => r.length === 10) as RawKeyword[]).map((rawKeyword, index) => createKeyword(kw, rawKeyword, strings, index, baseMillis, elementsById));
    return kw;
}

const createMessage = (element: RawMessage, strings: StringStore, baseMillis: number): RobotFrameworkResultMessage => {
    return {
        level: MESSAGE_LEVELS[element[1]],
        timestamp: timestamp(element[0], baseMillis),
        message: strings.get(element[2]),
    }
}


export const suite = (suite: RawSuite, strings: string[], baseMillis: number) => {
    return createSuite(undefined, suite, stringStore(strings), 0, baseMillis);
}
