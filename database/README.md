# Database management

Modules and scripts to setup a sqlite database containing all
our reading list information, add entries to the database, and
export the reading list to JSON to be consumed by our web application.

## Setup

Need to have pyenv. Setup the virtual environment as follows:

```bash
rm -rf .venv
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

For development, need to additionally run

```bash
pip install -r requirements-dev.txt
```

Then can setup the database (which checked into git!) by running

```bash
./setup_database.py -p data/production.db
```

Can add to the existing database with

```bash
./add_to_reading_list.py -p data/production.db
```

And export to the app wtih

```bash
./export_reading_list.py -p data/production.db -o ../web/src/data/production.json
```


