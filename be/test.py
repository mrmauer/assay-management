import requests
import json
import traceback


class Tester:

    _tests = [
        {
            "name": "create_plate1",
            "path": "/plate",
            "method": "POST",
            "data": {
                "n_wells": 96,
                "description": "AUTOMATED TEST 1"
            },
            "to_cache": [
                ("plate1_plate_id", "plate_id"),
            ],
            "from_cache": [],
            "expected_response": 201,
        },
        {
            "name": "get_plate1_no_wells",
            "path": "/plate/{plate1_plate_id}",
            "method": "GET",
            "data": {},
            "to_cache": [],
            "from_cache": [
                "plate1_plate_id",
            ],
            "expected_response": 200,
        },
    ]

    def __init__(self, domain):
        self._domain = domain
        self.results = []
        self._cache = {}

    def integration_test(self):

        for t in self._tests:
            try:
                path_params = {k:self._cache[k] for k in t["from_cache"]}

                response = requests.request(
                    t["method"],
                    self._domain + t["path"].format(**path_params),
                    json=t["data"],
                )

                result = response.status_code == t["expected_response"]

                data = response.json()

                if result:
                    for k, v in t["to_cache"]:
                        self._cache[k] = data[v]

                self.results.append(
                    {
                        "name": t["name"],
                        "succeed": result,
                        "data": data
                    }
                )
            except Exception as e:
                print(traceback.format_exc())
                print(f"RESULTS:\n{self.results}")
                print(f"CACHE:\n{self._cache}")
                break

if __name__ == "__main__":
    tester = Tester("http://127.0.0.1:5000")
    tester.integration_test()
    print(json.dumps(tester.results, indent=4))
    succeeded = len(list(filter(lambda x: x["succeed"], tester.results)))
    print("--------------------------")
    print(f"{succeeded}/{len(tester.results)} tests succeeded!!!")
