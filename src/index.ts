import {RawSuite, suite} from "./Suite";

const data = {
"suite": [
  1,
  2,
  3,
  0,
  [],
  [
    1,
    0,
    12
  ],
  [
    [
      4,
      5,
      6,
      0,
      [],
      [
        1,
        10,
        2
      ],
      [],
      [
        [
          7,
          0,
          0,
          [],
          [
            1,
            11,
            1
          ],
          [
            [
              0,
              8,
              9,
              0,
              10,
              11,
              0,
              0,
              [
                1,
                12,
                0
              ],
              [
                [
                  12,
                  2,
                  11
                ]
              ]
            ]
          ]
        ]
      ],
      [],
      [
        1,
        1,
        0,
        0
      ]
    ]
  ],
  [],
  [],
  [
    1,
    1,
    0,
    0
  ]
],
"strings": ["*","*Tmp","*/Users/mkorpela/workspace/robotlog/tmp","*tmp","*Foo","*/Users/mkorpela/workspace/robotlog/tmp/foo.robot","*tmp/foo.robot","*Testing","*Log","*BuiltIn","*<p>Logs the given message with the given level.</p>","*hello"],
"stats": [[{"elapsed":"00:00:00","fail":0,"label":"All Tests","pass":1,"skip":0}],[],[{"elapsed":"00:00:00","fail":0,"id":"s1","label":"Tmp","name":"Tmp","pass":1,"skip":0},{"elapsed":"00:00:00","fail":0,"id":"s1-s1","label":"Tmp.Foo","name":"Foo","pass":1,"skip":0}]],
"errors": [],
"baseMillis": 1671303934044,
"generated": 2710334,
"expand_keywords": null,
"settings": {}
};
const mysuite = suite(data.suite as unknown as RawSuite, data.strings, data.baseMillis);
console.log(JSON.stringify(mysuite, null, 2));