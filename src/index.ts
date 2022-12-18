import {RawSuite, suite} from "./Suite";

const data = {
"suite": [1,2,3,0,[],[1,0,1026],[[4,5,6,0,[],[1,10,1014],[],[[7,0,0,[],[1,12,1011],[[0,8,0,0,0,0,0,0,[1,12,0],[[0,9,10,0,11,12,0,0,[1,12,0],[[12,2,12]]],[0,13,10,0,14,0,0,0,[1,12,0],[]]]],[0,9,10,0,11,15,0,0,[1,12,0],[[12,2,15]]],[0,16,17,0,0,13,0,0,[1,13,1009],[[0,13,10,0,14,0,0,0,[1,13,0],[]],[1019,3,19],[1021,2,13]]]]]],[],[1,1,0,0]]],[],[],[1,1,0,0]],
"strings": ["*","*Tmp","*/Users/mkorpela/workspace/robotlog/tmp","*tmp","*Foo","*/Users/mkorpela/workspace/robotlog/tmp/foo.robot","*tmp/foo.robot","*Testing","*Keyword","*Log","*BuiltIn","*<p>Logs the given message with the given level.\x3c/p>","*something","*No Operation","*<p>Does absolutely nothing.\x3c/p>","*hello","*Keywot","*lib","*s1-s1-t1-k3","*paskaa"],
"stats": [[{"elapsed":"00:00:01","fail":0,"label":"All Tests","pass":1,"skip":0}],[],[{"elapsed":"00:00:01","fail":0,"id":"s1","label":"Tmp","name":"Tmp","pass":1,"skip":0},{"elapsed":"00:00:01","fail":0,"id":"s1-s1","label":"Tmp.Foo","name":"Foo","pass":1,"skip":0}]],
"errors": [[1019,3,19,18]],
"baseMillis": 1671393940179,
"generated": 3778,
"expand_keywords": null,
"settings": {}
}
const mysuite = suite(data.suite as unknown as RawSuite, data.strings, data.baseMillis);
console.log(JSON.stringify(mysuite, null, 2));