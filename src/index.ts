import {RawSuite, suite} from "./Suite";

const data = {
"suite": [1,2,3,0,[],[1,0,14],[[4,5,6,0,[],[1,12,2],[],[[7,0,0,[],[1,13,1],[[0,8,0,0,0,0,0,0,[1,13,1],[[0,9,10,0,11,12,0,0,[1,13,0],[[13,2,12]]],[0,13,10,0,14,0,0,0,[1,13,0],[]]]],[0,9,10,0,11,15,0,0,[1,14,0],[[14,2,15]]]]]],[],[1,1,0,0]]],[],[],[1,1,0,0]],
"strings": ["*","*Tmp","*/Users/mkorpela/workspace/robotlog/tmp","*tmp","*Foo","*/Users/mkorpela/workspace/robotlog/tmp/foo.robot","*tmp/foo.robot","*Testing","*Keyword","*Log","*BuiltIn","*<p>Logs the given message with the given level.</p>","*something","*No Operation","*<p>Does absolutely nothing.</p>","*hello"],
"stats": [[{"elapsed":"00:00:00","fail":0,"label":"All Tests","pass":1,"skip":0}],[],[{"elapsed":"00:00:00","fail":0,"id":"s1","label":"Tmp","name":"Tmp","pass":1,"skip":0},{"elapsed":"00:00:00","fail":0,"id":"s1-s1","label":"Tmp.Foo","name":"Foo","pass":1,"skip":0}]],
"errors": [],
"baseMillis": 1671369899429,
"generated": 5334,
"expand_keywords": null,
"settings": {}
}
const mysuite = suite(data.suite as unknown as RawSuite, data.strings, data.baseMillis);
console.log(JSON.stringify(mysuite, null, 2));