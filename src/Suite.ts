interface StringStore {
    get: (id: number) => string;
}

const STATUSES = ['FAIL', 'PASS', 'SKIP', 'NOT RUN'] as const;
type STATUS = typeof STATUSES[number];

const KEYWORD_TYPES = ['KEYWORD', 'SETUP', 'TEARDOWN', 'FOR', 'ITERATION', 'IF', 'ELSE IF', 'ELSE', 'RETURN',
                         'TRY', 'EXCEPT', 'FINALLY', 'WHILE', 'CONTINUE', 'BREAK'] as const;
type KEYWORD_TYPE = typeof KEYWORD_TYPES[number];

const stringStore = (strings: string[]): StringStore => {

    const extract = (text: string): string => {
        /*const decoded = JXG.Util.Base64.decodeAsArray(text);
        const extracted = (new JXG.Util.Unzip(decoded)).unzip()[0][0];
        return JXG.Util.UTF8.decode(extracted);*/
        return text;
    }

    return {
        get: (id: number): string => {
            const text = strings[id];
            if (!text)
                return '';
            if (text[0] == '*')
                return text.substring(1);
            var extracted = extract(text);
            strings[id] = '*' + extracted;
            return extracted;
        }
    }
}

export type RawSuite = readonly [number, number, number, number, number[], RawStatus, RawSuite[], RawTest[], RawKeyword[], RawSuiteStats];
type RawStatus = [number, number, number] | [number, number, number, number];
type RawSuiteStats = [number, number, number, number];

type RawKeyword = [number, number, number, number, number, number, number, number, RawStatus, RawKeyword[]];
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

interface RobotFrameworkResultSuite {
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
    keywords: (RobotFrameworkResultKeyword | null)[];
    tests: RobotFrameworkResultTest[];
    suites: RobotFrameworkResultSuite[];
}

interface RobotFrameworkResultTest {
    id: string;
    name: string;
    doc: string;
    timeout: string;
    status: STATUS;
    message: string;
    times: Times;
    tags: string[];
    keywords: (RobotFrameworkResultKeyword | null)[];
}

interface RobotFrameworkResultKeyword {
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
    keywords: (RobotFrameworkResultKeyword | null)[];
}

const createSuite = (parent: RobotFrameworkResultSuite | undefined, element: RawSuite, strings: StringStore, index: number, baseMillis: number): RobotFrameworkResultSuite => {
    const status = element[5];
    const suite: RobotFrameworkResultSuite = {
        id: 's' + ((index || 0) + 1),
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
        suites: []
    }
    suite.keywords = element[8].map((rawKeyword, index) => createKeyword(suite, rawKeyword, strings, index, baseMillis));
    suite.tests =  element[7].map((rawTest, index) => createTest(suite, rawTest, strings, index, baseMillis));
    suite.suites = element[6].map((rawSuite, index) => createSuite(suite, rawSuite, strings, index, baseMillis));
    return suite;
}

const createTest = (parent: RobotFrameworkResultSuite, element: RawTest, strings: StringStore, index: number, baseMillis: number): RobotFrameworkResultTest => {
    const status = element[4];
    const test: RobotFrameworkResultTest = {
        id: 't' + (index + 1),
        name: strings.get(element[0]),
        doc: strings.get(element[2]),
        timeout: strings.get(element[1]),
        status: parseStatus(status),
        message: status.length === 4 ? strings.get(status[3]) : '',
        times: times(status, baseMillis),
        tags: element[3].map(strings.get),
        keywords: [],
    };
    test.keywords = element[5].map((rawKeyword, index) => createKeyword(test, rawKeyword, strings, index, baseMillis));
    return test;
}

const createKeyword = (parent: RobotFrameworkResultSuite | RobotFrameworkResultTest | RobotFrameworkResultKeyword, element: RawKeyword, strings: StringStore, index: number, baseMillis: number): RobotFrameworkResultKeyword | null => {
    if (element.length < 9) return null;
    const kw: RobotFrameworkResultKeyword = {
        type: KEYWORD_TYPES[element[0]],
        id: 'k' + (index + 1),
        name: strings.get(element[1]),
        libname: strings.get(element[2]),
        timeout: strings.get(element[3]),
        args: strings.get(element[5]),
        assign: strings.get(element[6]),
        tags: strings.get(element[7]),
        doc: strings.get(element[4]),
        status: parseStatus(element[8]),
        times: times(element[8], baseMillis),
        keywords: []
    };
    kw.keywords = element[9].map((rawKeyword, index) => createKeyword(kw, rawKeyword, strings, index, baseMillis));
    return kw;
}


export const suite = (suite: RawSuite, strings: string[], baseMillis: number) => {
    return createSuite(undefined, suite, stringStore(strings), 0, baseMillis);
}
