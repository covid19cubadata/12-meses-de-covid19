import csv
import io
import json
import os
from collections import defaultdict
from datetime import datetime, timedelta

import requests  # noqa We are just importing this to prove the dependency installed correctly


def get_countries_incidence():
    if not os.path.exists('data/counties-codes.json'):
        data2 = requests.get(
            'https://covid.ourworldindata.org/data/owid-covid-data.csv').content
        # data2 = requests.get(
        #     'http://localhost:8000/utils/owid-covid-data.csv').content
        data2 = io.StringIO(data2.decode('utf8'))
        reader = csv.reader(data2)
        data = defaultdict(lambda: dict())
        headers = next(reader)
        headers = {j: i for i, j in enumerate(headers)}
        for i in reader:
            iso_code = i[headers['iso_code']]
            population = i[headers['population']]
            continent = i[headers['continent']]
            total_cases = i[headers['total_cases']]
            total_deaths = i[headers['total_deaths']]
            if not population and population != 0:
                continue
            name = i[headers['location']]
            if 'population' not in data[name]:
                data[name] = {
                    'population': int(float(population)),
                    'code': iso_code,
                    'continent': continent
                }
            data[name]['total_deaths'] = total_deaths
            data[name]['total_cases'] = total_cases
        data['Burma'] = data['Myanmar']
        data['Cabo Verde'] = data['Cape Verde']
        data['Congo (Kinshasa)'] = data['Congo']
        data['Holy See'] = data['Vatican']
        data['Korea, South'] = data['South Korea']
        data['Micronesia'] = data['Micronesia (country)']
        data['Taiwan*'] = data['Taiwan']
        data['Timor-Leste'] = data['Timor']
        data['US'] = data['United States']
        data['Cuba']['population'] = 11209628
        countries = data

        with open('data/counties-codes.json', 'w') as f:
            json.dump(data, f, indent=1)

        code_countries = {}

        with open('data/alpha3_to_alpha2.json', 'r') as r:
            dicc = json.load(r)
        
            for i,j in countries.items():
                alpha2 = ""
                try:
                    alpha2 = dicc[j['code'].lower()]
                except:
                    pass
                finally:
                    code_countries[
                        j['code']] = {
                            'population': int(float(j['population'])),
                            'name': i,
                            'continent': j['continent'],
                            'total_cases': j['total_cases'],
                            'total_deaths': j['total_deaths'],
                            'alpha2': alpha2
                        }

        with open('data/codes-countries.json', 'w') as f:
            json.dump(code_countries, f, indent=1)
    else:
        countries = json.load(open('data/counties-codes.json'))

    cubadata = requests.get(
        'https://covid19cubadata.github.io/data/covid19-cuba.json').content
    # cubadata = requests.get(
    #    'http://localhost:8000/utils/covid19-cuba.json').json()
    cubadata = json.loads(cubadata)

    counter = 0
    cuba = {}
    for i in cubadata['casos']['dias'].values():
        count = len(i.get('diagnosticados', []))+counter
        counter = count
        cuba["-".join(map(lambda x: str(int(x)), i['fecha'].split('/')))] = count

    data = requests.get(
        'https://pomber.github.io/covid19/timeseries.json').json()
    # data = json.load(open('utils/timeseries.json'))

    cubaupdated = []
    for i in data['Cuba']:
        if i['date'] in cuba:
            i['confirmed'] = cuba[i['date']]
        cubaupdated.append(i)
    data['Cuba'] = cubaupdated

    incidences = defaultdict(lambda: list())

    for country, confirmeds in data.items():
        if country == "Congo (Brazzaville)" or country == "Diamond Princess" or country == 'MS Zaandam' or country == 'West Bank and Gaza':
            continue
        confirmed = confirmeds[0]['confirmed']
        try:
            population = countries[country]['population']
        except KeyError:
            print(country)
            raise
        code = countries[country]['code']
        for n, i in enumerate(map(lambda x: x['confirmed'], confirmeds)):
            if n % 7 == 0:
                incidence = (i-confirmed)*10**5/population
                confirmed = i
                incidences[code].append(incidence)

    countries = list(incidences.keys())
    incidences_per_day = list(map(lambda v: {j: i for i, j in zip(
        v, countries)}, zip(*(incidences.values()))))

    delta = timedelta(days=7)
    currDate = datetime.fromisoformat('2020-01-22')
    for i in range(len(incidences_per_day)):
        incidences_per_day[i]['begin_date'] = currDate.isoformat().split('T')[
            0]
        currDate = currDate+delta
        incidences_per_day[i]['end_date'] = currDate.isoformat().split('T')[0]

    with open('data/incidences-per-day.json', 'w') as f:
        json.dump(list(incidences_per_day), f, indent=1)


if __name__ == "__main__":
    get_countries_incidence()
