import os
import requests
import json

def getForeignVsNativesData():
    if not os.path.exists('data/foreignvsnatives.json'):

        with open("data/foreignvsnatives.json", 'w') as w:
            data = requests.get(
                'https://covid19cubadata.github.io/data/covid19-cuba.json').content

            source = json.loads(data)

            result = {}

            for day in source['casos']['dias'].keys():
                date = source['casos']['dias'][day]['fecha']
                try:                   
                    cu = 0
                    foreign = 0

                    for patient in source['casos']['dias'][day]['diagnosticados']:
                        if patient['contagio'] != 'importado':
                            cu += 1
                        else:
                            foreign += 1
                    
                    result[date] = { 'not imported': cu, 'imported': foreign }
                except:
                    result[date] = { 'not imported': 0, 'imported': 0 }
                    continue
            
            json.dump(result, w, indent=4)


if __name__ == "__main__":
    getForeignVsNativesData()



    