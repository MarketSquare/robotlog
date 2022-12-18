# Robotlog

Robot Framework Log structure in TypeScript

Status: Prototype

# Goal

This projects goal is to make a TypeScript package that can reveal Robot Framework log data given in JSON format to JavaScript / TypeScript.
This should allow anybody to make their own representation of the log data with their selected web technologies.

This should allow building the UI with React, Angular, Vue, Svelte, vanilla JS or whatever tech suites your needs.

This should interface with official JSON https://github.com/robotframework/robotframework/issues/3423 once it is available, for now using create_json.py as a placeholder.

# Example output

```JSON
{
  "id": "s1",
  "name": "Tmp",
  "source": "/Users/mkorpela/workspace/robotlog/tmp",
  "relativeSource": "tmp",
  "doc": "",
  "status": "PASS",
  "message": "",
  "times": {
    "startTime": "2022-12-17T19:05:34.044Z",
    "endTime": "2022-12-17T19:05:34.056Z",
    "elapsedMillis": 12
  },
  "statistics": {
    "total": 1,
    "pass": 1,
    "fail": 0,
    "skip": 0
  },
  "metadata": [],
  "keywords": [],
  "tests": [],
  "suites": [
    {
      "id": "s1",
      "name": "Foo",
      "source": "/Users/mkorpela/workspace/robotlog/tmp/foo.robot",
      "relativeSource": "tmp/foo.robot",
      "doc": "",
      "status": "PASS",
      "message": "",
      "times": {
        "startTime": "2022-12-17T19:05:34.054Z",
        "endTime": "2022-12-17T19:05:34.056Z",
        "elapsedMillis": 2
      },
      "statistics": {
        "total": 1,
        "pass": 1,
        "fail": 0,
        "skip": 0
      },
      "metadata": [],
      "keywords": [],
      "tests": [
        {
          "id": "t1",
          "name": "Testing",
          "doc": "",
          "timeout": "",
          "status": "PASS",
          "message": "",
          "times": {
            "startTime": "2022-12-17T19:05:34.055Z",
            "endTime": "2022-12-17T19:05:34.056Z",
            "elapsedMillis": 1
          },
          "tags": [],
          "keywords": [
            {
              "type": "KEYWORD",
              "id": "k1",
              "name": "Log",
              "libname": "BuiltIn",
              "timeout": "",
              "args": "hello",
              "assign": "",
              "tags": "",
              "doc": "<p>Logs the given message with the given level.</p>",
              "status": "PASS",
              "times": {
                "startTime": "2022-12-17T19:05:34.056Z",
                "endTime": "2022-12-17T19:05:34.056Z",
                "elapsedMillis": 0
              },
              "keywords": []
            }
          ]
        }
      ],
      "suites": []
    }
  ]
}
